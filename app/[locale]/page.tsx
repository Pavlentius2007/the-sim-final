'use client'

import Hero from '@/components/Hero'
import About from '@/components/About'
import Benefits from '@/components/Benefits'
import Video from '@/components/Video'
import Security from '@/components/Security'
import Investment from '@/components/Investment'
import Testimonials from '@/components/Testimonials'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'


import { useTranslations } from '@/hooks/useTranslations'

export default function LocalePage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const { t: _t, isLoading } = useTranslations(locale as 'ru' | 'en' | 'zh' | 'th')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Navigation Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSwitcher currentLocale={locale} />
      </div>
      
      {/* Контент страницы с космическими эффектами */}
      <div className="relative z-10">
                 <Hero />
         <About />
        <Benefits />
        <Video />
        <Security />
        <Investment />
        <Testimonials />
        <ContactForm />
        
        <Footer currentLocale={locale} />
      </div>
    </main>
  )
}