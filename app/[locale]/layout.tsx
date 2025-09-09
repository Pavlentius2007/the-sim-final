import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../globals.css'
import { LocaleProvider } from '@/hooks/useTranslations'
import StaticStarryBackground from '@/components/StaticStarryBackground'
import ClientOnly from '@/components/ClientOnly'
import CookieConsent from '@/components/CookieConsent'
import SEOStructuredData from '@/components/SEOStructuredData'
import LazyMotionProvider from '@/components/LazyMotionProvider'
import ErrorSuppressor from '@/components/ErrorSuppressor'


const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
})

export async function generateStaticParams() {
  return [
    { locale: 'ru' },
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'th' }
  ]
}

export async function generateMetadata({ 
  params: { locale } 
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const baseUrl = 'https://thesim.site'
  
  const titles = {
    ru: 'TheSim - Управление цифровыми активами | Инвестиции в криптовалюту | Защита капитала',
    en: 'TheSim - Digital Asset Management | Cryptocurrency Investments | Capital Protection',
    zh: 'TheSim - 数字资产管理 | 加密货币投资 | 资本保护',
    th: 'TheSim - การจัดการสินทรัพย์ดิจิทัล | การลงทุนในคริปโตเคอร์เรนซี | การปกป้องเงินทุน'
  }

  const descriptions = {
    ru: 'TheSim - ведущая платформа управления цифровыми активами. Защита капитала, умные инвестиции, диверсификация портфеля, интеграция с Binance API. Начните зарабатывать на криптовалютах уже сегодня с минимальными рисками.',
    en: 'TheSim - leading digital asset management platform. Capital protection, smart investments, portfolio diversification, Binance API integration. Start earning with cryptocurrencies today with minimal risks.',
    zh: 'TheSim - 领先的数字资产管理平台。资本保护、智能投资、投资组合多样化、币安API集成。今天就开始通过加密货币赚钱，风险最小。',
    th: 'TheSim - แพลตฟอร์มการจัดการสินทรัพย์ดิจิทัลชั้นนำ การปกป้องเงินทุน การลงทุนอัจฉริยะ การกระจายความเสี่ยงของพอร์ต การรวม Binance API เริ่มสร้างรายได้จากคริปโตเคอร์เรนซีวันนี้ด้วยความเสี่ยงต่ำสุด'
  }

  const keywords = {
    ru: 'криптовалюта, цифровые активы, инвестиции, блокчейн, биткоин, эфириум, торговля, портфель, DeFi, управление активами, защита капитала, Binance API, умные инвестиции, диверсификация, криптотрейдинг, альткоины, стейкинг, ликвидность, волатильность, пассивный доход',
    en: 'cryptocurrency, digital assets, investments, blockchain, bitcoin, ethereum, trading, portfolio, DeFi, asset management, capital protection, Binance API, smart investments, diversification, crypto trading, altcoins, staking, liquidity, volatility, passive income',
    zh: '加密货币, 数字资产, 投资, 区块链, 比特币, 以太坊, 交易, 投资组合, DeFi, 资产管理, 资本保护, 币安API, 智能投资, 多样化, 加密货币交易, 山寨币, 质押, 流动性, 波动性, 被动收入',
    th: 'คริปโตเคอร์เรนซี, สินทรัพย์ดิจิทัล, การลงทุน, บล็อกเชน, บิทคอยน์, อีเธอเรียม, การซื้อขาย, พอร์ตโฟลิโอ, DeFi, การจัดการสินทรัพย์, การปกป้องเงินทุน, Binance API, การลงทุนอัจฉริยะ, การกระจายความเสี่ยง, การซื้อขายคริปโต, อัลต์คอยน์, การสเตค, ความคล่องตัว, ความผันผวน, รายได้แบบพาสซีฟ'
  }
  
  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    keywords: keywords[locale as keyof typeof keywords],
    authors: [{ name: 'TheSim Team' }],
    creator: 'TheSim',
    publisher: 'TheSim',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ru': '/ru',
        'en': '/en', 
        'zh': '/zh',
        'th': '/th',
      },
    },
    openGraph: {
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      url: `${baseUrl}/${locale}`,
      siteName: 'TheSim',
      images: [
        {
          url: `${baseUrl}/images/dashboard-preview.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'ru' ? 'TheSim - Управление цифровыми активами' : 'TheSim - Digital Asset Management',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: [`${baseUrl}/images/dashboard-preview.jpg`],
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
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Viewport и базовые meta теги */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#4B6CB7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preload критичных ресурсов */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/images/dashboard-preview.jpg" as="image" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        
        {/* Безопасность - Content Security Policy (только для продакшена) */}
        {process.env.NODE_ENV === 'production' && (
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" />
        )}
        
        {/* Структурированные данные для SEO */}
        <SEOStructuredData locale={locale} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LocaleProvider locale={locale as 'ru' | 'en' | 'zh' | 'th'}>
          {/* Глобальный LazyMotion Provider для оптимизации */}
          <LazyMotionProvider>
            <ClientOnly>
              <ErrorSuppressor />
            </ClientOnly>
            <div className="relative z-20" suppressHydrationWarning>
              {children}
            </div>
            <ClientOnly>
              <StaticStarryBackground />
            </ClientOnly>
            <ClientOnly>
              <CookieConsent currentLocale={locale} />
            </ClientOnly>
          </LazyMotionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
} 