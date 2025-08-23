'use client'

interface StructuredDataProps {
  locale: string
  baseUrl: string
}

export default function StructuredData({ locale, baseUrl }: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TheSim",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "description": locale === 'ru' 
      ? "Ведущая платформа управления цифровыми активами с защитой капитала"
      : "Leading digital asset management platform with capital protection",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/thesim",
      "https://linkedin.com/company/thesim",
      "https://facebook.com/thesim"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Russian", "English", "Chinese", "Thai"],
      "email": "info@thesim.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Asset Management Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Capital Protection",
            "description": "Advanced risk management for digital assets"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Portfolio Diversification",
            "description": "Multi-asset portfolio management"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Smart Trading",
            "description": "AI-powered trading strategies"
          }
        }
      ]
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TheSim",
    "url": baseUrl,
    "description": locale === 'ru'
      ? "Платформа управления цифровыми активами"
      : "Digital Asset Management Platform",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === 'ru' ? "Главная" : "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === 'ru' ? "Услуги" : "Services",
        "item": `${baseUrl}/${locale}`
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": locale === 'ru' 
          ? "Как работает защита капитала в TheSim?"
          : "How does capital protection work in TheSim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'ru'
            ? "Мы используем продвинутые алгоритмы управления рисками и диверсификацию портфеля для минимизации потерь."
            : "We use advanced risk management algorithms and portfolio diversification to minimize losses."
        }
      },
      {
        "@type": "Question",
        "name": locale === 'ru'
          ? "Какие криптовалюты поддерживаются?"
          : "What cryptocurrencies are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'ru'
            ? "Поддерживаются все основные криптовалюты: Bitcoin, Ethereum, а также популярные альткоины."
            : "All major cryptocurrencies are supported: Bitcoin, Ethereum, and popular altcoins."
        }
      },
      {
        "@type": "Question",
        "name": locale === 'ru'
          ? "Как начать инвестировать?"
          : "How to start investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locale === 'ru'
            ? "Просто оставьте заявку на нашем сайте, и мы свяжемся с вами для консультации."
            : "Simply submit a request on our website, and we will contact you for consultation."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  )
}
