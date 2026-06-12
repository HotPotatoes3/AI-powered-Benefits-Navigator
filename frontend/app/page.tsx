import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Benefits Navigator</div>
          <a href="/chat" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Benefits You May Qualify For in Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Answer a few simple questions about your situation and discover available government and community benefits tailored to you.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick & Easy</h3>
            <p className="text-gray-600">Answer simple questions about your situation in just a few minutes</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized</h3>
            <p className="text-gray-600">Get recommendations based on your specific circumstances and location</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Private & Secure</h3>
            <p className="text-gray-600">Your information is kept confidential and never shared with third parties</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16">
          <a href="/chat" className="inline-block bg-primary text-white text-lg px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold">
            Start Finding Benefits →
          </a>
        </div>
      </div>
    </main>
  )
}
