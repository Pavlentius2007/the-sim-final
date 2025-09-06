import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../globals.css'
import { LocaleProvider } from '@/hooks/useTranslations'
import GlobalStarryBackground from '@/components/GlobalStarryBackground'
import ClientOnly from '@/components/ClientOnly'


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
  const baseUrl = 'https://94.141.162.192'
  
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
          url: `${baseUrl}/logo.svg`,
          width: 1200,
          height: 630,
          alt: 'TheSim - Digital Asset Management',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: [`${baseUrl}/logo.svg`],
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Content Security Policy */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self'; object-src 'none';" />
        
        {/* Структурированные данные для SEO - встроенные */}
        <script 
          type="application/ld+json"
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization", 
              "name": "TheSim",
              "url": "https://94.141.162.192",
              "logo": "https://94.141.162.192/logo.svg",
              "description": locale === 'ru' 
                ? "Ведущая платформа управления цифровыми активами с защитой капитала"
                : "Leading digital asset management platform with capital protection"
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LocaleProvider locale={locale as 'ru' | 'en' | 'zh' | 'th'}>
          <ClientOnly>
            <GlobalStarryBackground intensity="high" className="z-0" />
          </ClientOnly>
          <div className="relative z-20">
            {children}
          </div>
        </LocaleProvider>
      </body>
    </html>
  )
} 