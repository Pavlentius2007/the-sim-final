import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import '../globals.css'
import { LocaleProvider } from '@/hooks/useTranslations'
import GlobalStarryBackground from '@/components/GlobalStarryBackground'


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
  const titles = {
    ru: 'TheSim - Управление цифровыми активами',
    en: 'TheSim - Digital Asset Management',
    zh: 'TheSim - 数字资产管理',
    th: 'TheSim - การจัดการสินทรัพย์ดิจิทัล'
  }

  const descriptions = {
    ru: 'Инвестируйте с защитой капитала, умными покупками и продажами, диверсификацией портфеля.',
    en: 'Invest with capital protection, smart buying and selling, portfolio diversification.',
    zh: '通过资本保护、智能买卖和投资组合多样化进行投资。',
    th: 'ลงทุนด้วยการปกป้องเงินทุน การซื้อขายอัจฉริยะ และการกระจายความเสี่ยงของพอร์ต'
  }
  
  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ru': '/ru',
        'en': '/en', 
        'zh': '/zh',
        'th': '/th',
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <LocaleProvider locale={locale as any}>
          {/* Космический фон - позади всего */}
          <GlobalStarryBackground intensity="high" className="z-0" />

          {/* Контент - поверх звезд */}
          <div className="relative z-20">
            {children}
          </div>
        </LocaleProvider>
      </body>
    </html>
  )
} 