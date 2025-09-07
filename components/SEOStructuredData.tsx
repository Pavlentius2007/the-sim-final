export default function SEOStructuredData({ locale = 'ru' }: { locale?: string }) {
  const baseUrl = 'https://thesim.site'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TheSim",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "description": locale === 'ru' 
      ? "Ведущая платформа управления цифровыми активами с защитой капитала"
      : "Leading digital asset management platform with capital protection",
    "foundingDate": "2025",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://t.me/Sergey_Loye"
    },
    "sameAs": [
      "https://t.me/Sergey_Loye"
    ],
    "offers": {
      "@type": "Offer",
      "name": locale === 'ru' ? "Управление цифровыми активами" : "Digital Asset Management",
      "description": locale === 'ru' 
        ? "Защита капитала, умные инвестиции, диверсификация портфеля"
        : "Capital protection, smart investments, portfolio diversification",
      "price": locale === 'ru' ? "По запросу" : "On request",
      "priceCurrency": "USD"
    },
    "service": {
      "@type": "Service",
      "name": locale === 'ru' ? "Управление криптоактивами" : "Crypto Asset Management",
      "description": locale === 'ru'
        ? "Профессиональное управление цифровыми активами с интеграцией Binance API"
        : "Professional digital asset management with Binance API integration",
      "provider": {
        "@type": "Organization",
        "name": "TheSim"
      }
    }
  }

  // Добавляем FAQ структурированные данные для лучшего SEO
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'ru' ? [
      {
        "@type": "Question",
        "name": "Как работает защита капитала в TheSim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TheSim использует современные алгоритмы управления рисками и диверсификацию портфеля для максимальной защиты ваших инвестиций."
        }
      },
      {
        "@type": "Question", 
        "name": "Какие криптовалюты поддерживает платформа?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Платформа поддерживает все основные криптовалюты через интеграцию с Binance API, включая Bitcoin, Ethereum и множество альткоинов."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How does capital protection work in TheSim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TheSim uses modern risk management algorithms and portfolio diversification for maximum protection of your investments."
        }
      },
      {
        "@type": "Question",
        "name": "Which cryptocurrencies does the platform support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The platform supports all major cryptocurrencies through Binance API integration, including Bitcoin, Ethereum, and numerous altcoins."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}
