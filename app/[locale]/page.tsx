// Статические импорты для критичных компонентов
import Security from '@/components/Security'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PersonalCabinetButton from '@/components/PersonalCabinetButton'
import ClientOnly from '@/components/ClientOnly'
import LazyMotionProvider from '@/components/LazyMotionProvider'
import HydrationSafeWrapper from '@/components/HydrationSafeWrapper'

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
  return (
    <main className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      {/* Navigation Controls - критичные компоненты загружаются сразу */}
      <div className="fixed top-1 right-1 md:top-4 md:right-4 z-50 flex items-center gap-1 md:gap-3" suppressHydrationWarning>
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
          <HydrationSafeWrapper fallback={
            <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">TheSim</h1>
                <p className="text-xl text-gray-300">SMART INVESTMENTS</p>
              </div>
            </div>
          }>
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
          </HydrationSafeWrapper>
        </LazyMotionProvider>
        
        {/* Footer - статический для SEO */}
        <Footer />
      </div>
    </main>
  )
}