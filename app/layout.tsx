import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorSuppressor from '@/components/ErrorSuppressor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheSim - Управление цифровыми активами',
  description: 'TheSim - ведущая платформа управления цифровыми активами. Защита капитала, умные инвестиции, диверсификация портфеля, интеграция с Binance API. Начните зарабатывать на криптовалютах уже сегодня с минимальными рисками.',
  keywords: 'управление цифровыми активами, инвестиции в криптовалюту, диверсификация портфеля, защита капитала, криптотрейдинг, Binance API, умные инвестиции, блокчейн, биткоин, эфириум, торговля, портфель, DeFi, альткоины, стейкинг, ликвидность, волатильность, пассивный доход',
  authors: [{ name: 'TheSim Team' }],
  creator: 'TheSim',
  publisher: 'TheSim',
  openGraph: {
    title: 'TheSim - Управление цифровыми активами | Инвестиции в криптовалюту',
    description: 'Ведущая платформа управления цифровыми активами. Защита капитала, умные инвестиции, диверсификация портфеля, интеграция с Binance API.',
    url: 'https://thesim.site',
    siteName: 'TheSim',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://thesim.site/logo.svg',
        width: 1200,
        height: 630,
        alt: 'TheSim - Digital Asset Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheSim - Управление цифровыми активами | Инвестиции в криптовалюту',
    description: 'Ведущая платформа управления цифровыми активами. Защита капитала, умные инвестиции, диверсификация портфеля, интеграция с Binance API.',
    images: ['https://thesim.site/logo.svg'],
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
  metadataBase: new URL('https://thesim.site'),
  alternates: {
    canonical: 'https://thesim.site',
    languages: {
      'ru': 'https://thesim.site/ru',
      'en': 'https://thesim.site/en',
      'zh': 'https://thesim.site/zh',
      'th': 'https://thesim.site/th',
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
