import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorSuppressor from '@/components/ErrorSuppressor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheSim - Smart Investments | Управление цифровыми активами',
  description: 'TheSim - ваш надежный партнер в управлении цифровыми активами. Инвестируйте с защитой капитала, умными покупками и продажами.',
  keywords: 'инвестиции, цифровые активы, управление капиталом, TheSim, криптовалюты',
  authors: [{ name: 'TheSim Team' }],
  openGraph: {
    title: 'TheSim - Smart Investments',
    description: 'Управление цифровыми активами с защитой капитала',
    url: 'https://thesim.site',
    siteName: 'TheSim',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheSim - Smart Investments',
    description: 'Управление цифровыми активами с защитой капитала',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="/suppress-errors.js" defer></script>
      </head>
      <body className={inter.className}>
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  )
}
