import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Benefits Navigator - Find Benefits You Qualify For',
  description: 'AI-powered benefits finder to help you discover government and community benefits.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
