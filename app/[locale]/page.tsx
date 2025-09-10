'use client'

import { useEffect } from 'react'
// Статические импорты для критичных компонентов
import Security from '@/components/Security'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PersonalCabinetButton from '@/components/PersonalCabinetButton'
import ClientOnly from '@/components/ClientOnly'
import LazyMotionProvider from '@/components/LazyMotionProvider'

// Динамические импорты для оптимизации производительности
import {
  DynamicAbout,
  DynamicBenefits,
  DynamicVideo,
  DynamicInvestment,
  DynamicTestimonials,
  DynamicFAQ,
  DynamicContactForm,
  DynamicHero
} from '@/components/DynamicComponents'

// Убираем статические импорты переводов - используем только хук

export default function LocalePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  // Обработка якорных ссылок
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }, 100)
        }
      }
    }

    // Обрабатываем хеш при загрузке страницы
    handleHashChange()

    // Обрабатываем изменения хеша
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <main className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      {/* Navigation Controls - критичные компоненты загружаются сразу */}
      <div className="fixed top-1 right-1 md:top-4 md:right-4 z-50 flex flex-col gap-2" suppressHydrationWarning>
        <ClientOnly>
          <PersonalCabinetButton />
        </ClientOnly>
        <ClientOnly>
          <LanguageSwitcher currentLocale={locale} />
        </ClientOnly>
      </div>
      
      {/* Контент страницы с LazyMotion для оптимизации framer-motion */}
      <div className="relative z-10" suppressHydrationWarning>
        <LazyMotionProvider>
          {/* Hero секция - загружается динамически */}
          <DynamicHero />
          
          {/* Остальной контент загружается динамически */}
          <DynamicAbout />
          <DynamicBenefits />
          
          {/* Видео скрыто на мобильных устройствах из-за наложения */}
          <div className="hidden md:block">
            <DynamicVideo />
          </div>
          
          {/* Security - статический для SEO */}
          <Security />
          <DynamicInvestment />
          <DynamicTestimonials />
          <DynamicFAQ />
          
          <div id="contact-form">
            <DynamicContactForm />
          </div>
        </LazyMotionProvider>
        
        {/* Footer - статический для SEO */}
        <Footer currentLocale={locale} />
      </div>
    </main>
  )
}