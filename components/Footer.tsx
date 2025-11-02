'use client'

import { MessageCircle, Youtube } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'

interface FooterProps {
  currentLocale: string
}

export default function Footer({ currentLocale }: FooterProps) {
  const { t } = useTranslations()

  return (
    <footer className="relative bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-8 lg:py-12">
          {/* Company Info and Links Grid - Mobile First Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
            {/* Left Column - Company Info */}
            <div>
              <div className="mb-4">
                <div className="text-left">
                  <div className="text-3xl font-bold text-blue-500 mb-2" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>TheSim</div>
                  <div className="text-sm text-blue-400 font-medium uppercase tracking-wider mb-3">Smart Investments</div>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-sm mb-6 text-sm">
                {t('footer.description')}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://t.me/Sergey_Loye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 hover:text-primary-300 hover:bg-primary-500/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                
                <a
                  href="https://www.youtube.com/watch?v=gHkWXzRLNno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 hover:text-primary-300 hover:bg-primary-500/30 transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column - Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
              {/* Product - Left */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.product.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <button 
                      onClick={() => {
                        document.getElementById('about')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                      className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer text-left w-full"
                    >
                      {t('footer.sections.product.about')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        document.getElementById('benefits')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                      className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer text-left w-full"
                    >
                      {t('footer.sections.product.benefits')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        document.getElementById('security')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }}
                      className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer text-left w-full"
                    >
                      {t('footer.sections.product.security')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        const videoElement = document.getElementById('video')
                        if (videoElement) {
                          videoElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          })
                        } else {
                          window.location.href = `/${currentLocale}#video`
                        }
                      }}
                      className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer text-left w-full"
                    >
                      {t('footer.sections.product.video')}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal - Center */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.legal.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href={`/${currentLocale}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.legal.privacy')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${currentLocale}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.legal.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${currentLocale}/cookies`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.legal.cookies')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support - Right */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.support.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="https://t.me/Sergey_Loye" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.telegram')}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:Info@thesim.in" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.email')}
                    </a>
                  </li>
                  <li>
                    <a href="#contact-form" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.contact')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-gray-400 text-sm text-center lg:text-left">
                {t('footer.copyright')}
              </div>
              <div className="text-gray-500 text-xs text-center lg:text-right max-w-md">
                {t('footer.disclaimer')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}