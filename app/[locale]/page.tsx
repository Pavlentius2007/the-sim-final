import Security from '@/components/Security'
import Footer from '@/components/Footer'
import ClientOnly from '@/components/ClientOnly'
import LazyMotionProvider from '@/components/LazyMotionProvider'
import ScrollToTop from '@/components/ScrollToTop'

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
      {/* Контент страницы с LazyMotion для оптимизации framer-motion */}
      <div className="relative z-10">
        <LazyMotionProvider>
          {/* Hero секция - загружается динамически */}
          <DynamicHero currentLocale={locale} />
          
          {/* Остальной контент загружается динамически */}
          <DynamicAbout />
          <DynamicBenefits />
          
          {/* Видеообзор - адаптивный для всех устройств */}
          <DynamicVideo />
          
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
      
      {/* Кнопка быстрой перемотки наверх */}
      <ClientOnly>
        <ScrollToTop />
      </ClientOnly>
    </main>
  )
}