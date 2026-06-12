import { Router, Request, Response } from 'express'
import { geminiService } from '../services/gemini'
import { vectorSearchService } from '../services/vectorSearch'

const router = Router()

interface ChatRequest extends Request {
  body: {
    message: string
    conversationHistory?: Array<{ role: string; content: string }>
  }
}

router.post('/', async (req: ChatRequest, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get context from vector search (benefits documents)
    const context = await vectorSearchService.searchBenefits(message)

    // Generate response using Gemini
    const response = await geminiService.generateResponse(
      message,
      conversationHistory,
      context
    )

    // Extract benefits from response if available
    const benefits = response.extractedBenefits || []

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
