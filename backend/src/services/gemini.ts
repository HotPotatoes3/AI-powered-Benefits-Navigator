import { VertexAI } from '@google-cloud/vertexai'

const projectId = process.env.GCP_PROJECT_ID || 'benefits-navigator'
const region = process.env.VERTEX_AI_REGION || 'us-central1'

const vertexAI = new VertexAI({
  project: projectId,
  location: region,
})

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-pro',
})

interface ConversationMessage {
  role: string
  content: string
}

interface GenerateResponseResult {
  text: string
  extractedBenefits?: Array<{ name: string; description: string }>
}

export const geminiService = {
  async generateResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[],
    context: string
  ): Promise<GenerateResponseResult> {
    try {
      const systemPrompt = `You are a helpful benefits advisor assistant. Your role is to help users discover government and community benefits they may qualify for. 

When users describe their situation, ask clarifying questions about:
- Current employment status
- Annual household income
- State/location
- Family size
- Any specific needs or challenges

Based on their responses, recommend relevant benefits from the available database.

Here is relevant benefit information to help you:
${context}

Always be empathetic, encouraging, and emphasize that all information is confidential.`

      const chat = generativeModel.startChat()

      // Format conversation history for Gemini
      const chatHistory = conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))

      // Add system prompt to first user message if no history
      let messageWithContext = userMessage
      if (chatHistory.length === 0) {
        messageWithContext = `${systemPrompt}\n\nUser: ${userMessage}`
      }

      const response = await chat.sendMessage(messageWithContext)

      const responseText = response.response.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        text: responseText,
        extractedBenefits: [],
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate response')
    }
  },
}
