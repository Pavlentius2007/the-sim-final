'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  DollarSign, 
  Users, 
  Shield, 
  Headphones 
} from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Investment() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const terms = [
    {
      icon: DollarSign,
      title: t('investment.minAmount.title'),
      value: t('investment.minAmount.value'),
      description: t('investment.minAmount.description'),
      color: 'from-green-500 to-emerald-600',
      highlight: true
    },
    {
      icon: Users,
      title: t('investment.professional.title'),
      description: t('investment.professional.description'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: t('investment.transparency.title'),
      description: t('investment.transparency.description'),
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Headphones,
      title: t('investment.support.title'),
      description: t('investment.support.description'),
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-800 to-dark-900"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-20">
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
            {t('investment.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('investment.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`glass rounded-2xl p-6 text-center hover-lift group ${
                term.highlight ? 'ring-2 ring-primary-500/50 bg-primary-500/10' : ''
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${term.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <term.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {term.title}
              </h3>
              
              {term.value && (
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {term.value}
                </div>
              )}
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {term.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
