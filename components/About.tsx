'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, TrendingUp, Zap, BarChart3 } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import LiveDashboard from './LiveDashboard'

export default function About() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Shield,
      title: t('about.features.market.title'),
      description: t('about.features.market.description')
    },
    {
      icon: TrendingUp,
      title: t('about.features.assets.title'),
      description: t('about.features.assets.description')
    },
    {
      icon: Zap,
      title: t('about.features.trends.title'),
      description: t('about.features.trends.description')
    },
    {
      icon: BarChart3,
      title: t('about.features.api.title'),
      description: t('about.features.api.description')
    }
  ]

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">The SIM</span> — {t('about.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="glass rounded-2xl p-6 hover-lift group"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Screenshot Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
                     {/* Live Dashboard */}
           <LiveDashboard 
             videoSrc="https://youtu.be/i6aw3SWLuas"  // Ваше рабочее видео
             fallbackImage="/images/dashboard-preview.jpg"
           />

          {/* Content */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('about.dashboard.title')}
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('about.dashboard.description')}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                {t('about.dashboard.features.realTime')}
              </li>
              <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                {t('about.dashboard.features.analytics')}
              </li>
              <li className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                {t('about.dashboard.features.security')}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}