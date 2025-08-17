'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Youtube } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import Link from 'next/link'


interface FooterProps {
  currentLocale: string
}

export default function Footer({ currentLocale }: FooterProps) {
  const { t } = useTranslations()

  return (
    <footer className="relative overflow-hidden">
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-dark-800"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/2 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-8 lg:py-12"
        >
          {/* Company Info and Links Grid - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
            {/* Left Column - Company Info */}
            <div>
              <div className="mb-4">
                <div className="text-left">
                  <div className="text-3xl font-bold text-blue-500 mb-2 drop-shadow-lg">TheSim</div>
                  <div className="text-sm text-blue-400 font-medium uppercase tracking-wider mb-3">Smart Investments</div>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md mb-4">
                {t('footer.description')}
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <motion.a
                  href="https://t.me/Sergey_Loye"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 hover:text-primary-300 hover:bg-primary-500/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://www.youtube.com/watch?v=gHkWXzRLNno"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 hover:text-primary-300 hover:bg-primary-500/30 transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Right Column - Links - Three Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product - Left */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.product.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.product.about')}
                    </a>
                  </li>
                  <li>
                    <a href="#benefits" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.product.benefits')}
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.product.security')}
                    </a>
                  </li>
                  <li>
                    <a href="#video" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.product.video')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support - Center */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.support.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.contact')}
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/Sergey_Loye" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.telegram')}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@thesim.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.email')}
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/Sergey_Loye" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {t('footer.sections.support.help')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal - Right */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('footer.sections.legal.title')}</h4>
                <ul className="space-y-1">
                  <li>
                    <a 
                      href={`/${currentLocale}/privacy`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {t('footer.sections.legal.privacy')}
                    </a>
                  </li>
                  <li>
                    <a 
                      href={`/${currentLocale}/terms`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {t('footer.sections.legal.terms')}
                    </a>
                  </li>
                  <li>
                    <Link 
                      href={`/${currentLocale}/terms-of-service`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {t('footer.sections.legal.termsOfService')}
                    </Link>
                  </li>
                  <li>
                    <a 
                      href={`/${currentLocale}/cookies`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {t('footer.sections.legal.cookies')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>



          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

    </footer>
  )
}