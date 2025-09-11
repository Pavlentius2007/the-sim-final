'use client'

import { useState, useEffect } from 'react'
import { m } from '@/components/LazyMotionProvider'
import { AnimatePresence } from 'framer-motion'
import { Cookie, X, Shield, Eye } from 'lucide-react'
import { useTranslations, useLocale } from '@/hooks/useTranslations'
import Link from 'next/link'

interface CookieConsentProps {
  currentLocale?: string
}

export default function CookieConsent({ currentLocale: _currentLocale }: CookieConsentProps = {}) {
  const { t } = useTranslations()
  const locale = useLocale()
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Проверяем, дал ли пользователь согласие ранее (только на клиенте)
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookieConsent')
      if (!consent) {
        // Показываем баннер через небольшую задержку
        const timer = setTimeout(() => {
          setShowBanner(true)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const acceptCookies = (type: 'all' | 'necessary') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', type)
      localStorage.setItem('cookieConsentDate', new Date().toISOString())
    }
    setShowBanner(false)
    setShowDetails(false)
  }

  const rejectCookies = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'rejected')
      localStorage.setItem('cookieConsentDate', new Date().toISOString())
    }
    setShowBanner(false)
    setShowDetails(false)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <m.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <div className="glass rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {t('cookies.title')}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t('cookies.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {t('cookies.description')}
          </p>

          {/* Cookie Details */}
          <AnimatePresence>
            {showDetails && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="border-t border-gray-700 pt-4 space-y-3">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {t('cookies.necessary.title')}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {t('cookies.necessary.description')}
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-3">
                    <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {t('cookies.analytics.title')}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {t('cookies.analytics.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="space-y-3">
            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            >
              {showDetails ? t('cookies.hideDetails') : t('cookies.showDetails')}
            </button>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => acceptCookies('all')}
                className="flex-1 bg-gradient-primary text-white px-4 py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all text-sm"
              >
                {t('cookies.acceptAll')}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => acceptCookies('necessary')}
                  className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  {t('cookies.necessary.only')}
                </button>
                
                <button
                  onClick={rejectCookies}
                  className="px-4 py-2.5 bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600 rounded-lg font-medium transition-colors text-sm"
                >
                  {t('cookies.reject')}
                </button>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <div className="text-center">
              <Link 
                href={`/${locale}/cookies`}
                className="text-gray-400 hover:text-primary-400 text-xs transition-colors"
              >
                {t('cookies.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  )
}
