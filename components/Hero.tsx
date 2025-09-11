'use client'

import { MessageCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Hero() {
  const { t } = useTranslations()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Простой фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/20"></div>
      
      {/* Упрощенные декоративные элементы */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-16 md:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand - оптимизированный */}
          <div className="mb-16 mt-8 md:mt-0">
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 mb-4" 
                     style={{textShadow: '0 4px 8px rgba(0,0,0,0.3)'}}>
                  TheSim
                </div>
                <div className="text-lg md:text-xl text-blue-400 font-medium uppercase tracking-wider">
                  Smart Investments
                </div>
              </div>
            </div>
            <div className="w-32 h-1.5 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" 
              style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
            {t('hero.title')}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.ctaButton')}
            </button>
            <a 
              href="https://t.me/Sergey_Loye" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              {t('hero.learnMore')}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">$10M+</div>
              <div className="text-gray-400">{t('hero.stats.managedAssets')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">540+</div>
              <div className="text-gray-400">{t('hero.stats.satisfiedClients')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">{t('hero.stats.support')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 