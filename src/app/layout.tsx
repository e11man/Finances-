import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Planner',
  description: 'A comprehensive financial planning application',
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