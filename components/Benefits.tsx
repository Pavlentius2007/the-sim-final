'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Shield, 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Target, 
  Network, 
  RefreshCw, 
  Droplets 
} from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Benefits() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const benefits = [
    {
      icon: Shield,
      title: t('benefits.hedging.title'),
      description: t('benefits.hedging.description'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: TrendingUp,
      title: t('benefits.smartBuying.title'),
      description: t('benefits.smartBuying.description'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Brain,
      title: t('benefits.smartSelling.title'),
      description: t('benefits.smartSelling.description'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: BarChart3,
      title: t('benefits.analytics.title'),
      description: t('benefits.analytics.description'),
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Target,
      title: t('benefits.liquidation.title'),
      description: t('benefits.liquidation.description'),
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Network,
      title: t('benefits.diversification.title'),
      description: t('benefits.diversification.description'),
      color: 'from-teal-500 to-green-600'
    },
    {
      icon: RefreshCw,
      title: t('benefits.reinvestment.title'),
      description: t('benefits.reinvestment.description'),
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Droplets,
      title: t('benefits.liquidity.title'),
      description: t('benefits.liquidity.description'),
      color: 'from-cyan-500 to-blue-600'
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
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
            {t('benefits.why.title')} <span className="gradient-text">The SIM</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('benefits.why.subtitle')}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="glass rounded-2xl p-6 hover-lift group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 