import { Router, Request, Response } from 'express'
import { geminiService } from '../services/gemini'
import { vectorSearchService } from '../services/vectorSearch'
import { firestoreService } from '../services/firestore'

const router = Router()

interface ChatRequest extends Request {
  body: {
    message: string
    lifeSituation?: string
    conversationHistory?: Array<{ role: string; content: string }>
  }
}

router.post('/', async (req: ChatRequest, res: Response) => {
  try {
    const { message, lifeSituation, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Seed and use the life-situation profiles in Firestore so the chat can be grounded in the starter categories.
    await firestoreService.seedSituationProfiles()

    // Get context from vector search (benefits documents)
    const context = await vectorSearchService.searchBenefits(message)

    // Generate response using Gemini
    const response = await geminiService.generateResponse(
      message,
      conversationHistory,
      context,
      lifeSituation
    )

    // Extract benefits from response if available
    const benefits = response.extractedBenefits || []

    await firestoreService.saveConversationEntry({
      message,
      lifeSituation,
      conversationHistory,
      response: response.text,
      benefits,
    })

    res.json({
      message: response.text,
      benefits,
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
})

export default router
