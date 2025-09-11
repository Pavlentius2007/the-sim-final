'use client'

import { m } from '@/components/LazyMotionProvider'
import { useInView } from 'react-intersection-observer'
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { useState, useEffect } from 'react'

export default function Security() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Используем inView только на клиенте для избежания гидратации
  const shouldAnimate = isClient && inView

  const securityFeatures = [
    {
      icon: Shield,
      title: t('security.features.api.title'),
      description: t('security.features.api.description'),
      details: t('security.features.api.details')
    },
    {
      icon: Lock,
      title: t('security.features.noStorage.title'),
      description: t('security.features.noStorage.description'),
      details: t('security.features.noStorage.details')
    },
    {
      icon: Eye,
      title: t('security.features.transparency.title'),
      description: t('security.features.transparency.description'),
      details: t('security.features.transparency.details')
    },
    {
      icon: CheckCircle,
      title: t('security.features.protection.title'),
      description: t('security.features.protection.description'),
      details: t('security.features.protection.details')
    }
  ]

  return (
    <section id="security" className="py-20 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Elements */}
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">{t('security.title')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('security.subtitle')}
          </p>
        </m.div>

        {/* Security Features Grid */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {securityFeatures.map((feature, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="glass rounded-2xl p-8 hover-lift group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>

        {/* Security Stats */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            {t('security.stats.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {t('security.stats.uptime')}
              </div>
              <div className="text-gray-400">
                {t('security.stats.uptimeLabel')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {t('security.stats.assets')}
              </div>
              <div className="text-gray-400">
                {t('security.stats.assetsLabel')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {t('security.stats.protection')}
              </div>
              <div className="text-gray-400">
                {t('security.stats.protectionLabel')}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}