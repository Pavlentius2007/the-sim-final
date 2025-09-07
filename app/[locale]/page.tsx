// import Hero from '@/components/Hero'
import HeroServer from '@/components/HeroServer'
import About from '@/components/About'
import Benefits from '@/components/Benefits'
import Video from '@/components/Video'
import Security from '@/components/Security'
import Investment from '@/components/Investment'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PersonalCabinetButton from '@/components/PersonalCabinetButton'
import ClientOnly from '@/components/ClientOnly'

// Импортируем переводы напрямую
import ruMessages from '@/messages/ru.json'
import enMessages from '@/messages/en.json'
import zhMessages from '@/messages/zh.json'
import thMessages from '@/messages/th.json'

const messages = {
  ru: ruMessages,
  en: enMessages,
  zh: zhMessages,
  th: thMessages
}

export default function LocalePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const currentMessages = messages[locale as keyof typeof messages] || messages.ru
  
  return (
    <main className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      {/* Navigation Controls */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 flex items-center gap-2 md:gap-3" suppressHydrationWarning>
        <ClientOnly>
          <PersonalCabinetButton />
        </ClientOnly>
        <ClientOnly>
          <LanguageSwitcher currentLocale={locale} />
        </ClientOnly>
      </div>
      
      {/* Контент страницы с космическими эффектами */}
      <div className="relative z-10">
        <HeroServer
          title={currentMessages.hero?.title || 'Управление цифровыми активами'}
          subtitle={currentMessages.hero?.subtitle || 'Защита капитала и умные инвестиции'}
          ctaButton={currentMessages.hero?.ctaButton || 'Начать инвестировать'}
          learnMore={currentMessages.hero?.learnMore || 'Узнать больше'}
          managedAssets={currentMessages.hero?.stats?.managedAssets || 'Управляемых активов'}
          satisfiedClients={currentMessages.hero?.stats?.satisfiedClients || 'Довольных клиентов'}
          support={currentMessages.hero?.stats?.support || 'Поддержка'}
        />
        <ClientOnly>
          <About />
        </ClientOnly>
        <ClientOnly>
          <Benefits />
        </ClientOnly>
        {/* Видео скрыто на мобильных устройствах из-за наложения */}
        <div className="hidden md:block">
          <ClientOnly>
            <Video />
          </ClientOnly>
        </div>
        <ClientOnly>
          <Security />
        </ClientOnly>
        <ClientOnly>
          <Investment />
        </ClientOnly>
        <ClientOnly>
          <Testimonials />
        </ClientOnly>
        <ClientOnly>
          <FAQ />
        </ClientOnly>
        <div id="contact-form">
          <ClientOnly>
            <ContactForm />
          </ClientOnly>
        </div>
        
        <ClientOnly>
          <Footer currentLocale={locale} />
        </ClientOnly>
      </div>
    </main>
  )
}