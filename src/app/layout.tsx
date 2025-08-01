import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Planner',
  description: 'A comprehensive financial planning application',
  keywords: 'financial planning, budget, savings, investment, money management',
  authors: [{ name: 'Financial Planner Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#2E4057',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Financial Planner" />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  )
}