import Security from '@/components/Security'
import Footer from '@/components/Footer'
import ClientOnly from '@/components/ClientOnly'
import LazyMotionProvider from '@/components/LazyMotionProvider'
import Navigation from '@/components/Navigation'

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

export default function LocalePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Navigation Controls - критичные компоненты загружаются сразу */}
      <div className="fixed top-1 right-1 md:top-4 md:right-4 z-50 flex flex-col gap-2">
        <ClientOnly>
          <Navigation currentLocale={locale} />
        </ClientOnly>
      </div>
      
      {/* Контент страницы с LazyMotion для оптимизации framer-motion */}
      <div className="relative z-10">
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
          
          {/* Security - обернут в ClientOnly для избежания гидратации */}
          <ClientOnly>
            <Security />
          </ClientOnly>
          <DynamicInvestment />
          <DynamicTestimonials />
          <DynamicFAQ />
          
          <div id="contact-form">
            <DynamicContactForm />
          </div>
        </LazyMotionProvider>
        
        {/* Footer - обернут в ClientOnly для избежания гидратации */}
        <ClientOnly>
          <Footer currentLocale={locale} />
        </ClientOnly>
      </div>
    </main>
  )
}