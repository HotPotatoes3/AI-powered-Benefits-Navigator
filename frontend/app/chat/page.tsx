'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Benefit {
  name: string
  description: string
  eligibility: string
}

const LIFE_SITUATION_OPTIONS = ['student', 'employed', 'unemployed', 'retired', 'other']

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I\'m here to help you find benefits you may qualify for. Let me ask you a few questions to get started.\n\nFirst, please choose your current life situation from the options below so I can tailor the recommendations.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedSituation, setSelectedSituation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Benefit[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    const situation = selectedSituation || 'other'
    const messageText = inputValue.trim()
      ? `My current life situation is ${situation}. ${inputValue.trim()}`
      : `My current life situation is ${situation}.`

    if (!messageText.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: messageText,
        lifeSituation: situation,
        conversationHistory: messages,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message,
      }

      if (response.data.benefits) {
        setRecommendations(response.data.benefits)
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Benefits Navigator Chat</h1>
          <p className="text-gray-600 text-sm">Answer a few questions to find benefits you may qualify for</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-blue-50 border-t-4 border-primary p-4 mx-4">
            <h3 className="font-semibold text-primary mb-3">Recommended Benefits:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {recommendations.map((benefit, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-primary/20">
                  <h4 className="font-semibold text-gray-900">{benefit.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Situation selector */}
        <div className="mx-4 mt-4 rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
          <label htmlFor="lifeSituation" className="text-sm font-semibold text-gray-800">
            Current life situation
          </label>
          <p className="mt-1 text-xs text-gray-500">Pick one of the starter options to personalize the recommendations and the Firestore session context.</p>
          <select
            id="lifeSituation"
            value={selectedSituation}
            onChange={(e) => setSelectedSituation(e.target.value)}
            disabled={isLoading}
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
          >
            <option value="">Select a situation</option>
            {LIFE_SITUATION_OPTIONS.map((option) => (
              <option key={option} value={option} className="capitalize">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t bg-white p-4 mx-4 mb-4 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add details about your situation, income, or needs..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
