'use client'

import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function ContactForm() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    socialNetwork: '' // Переименовываем с telegram на socialNetwork
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Отправляем заявку на API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit lead')
      }

      const result = await response.json()
      
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        setFormData({
          name: '',
          email: '',
          phone: '',
          socialNetwork: ''
        })
      } else {
        setStatus('error')
        setMessage(result.message || 'Произошла ошибка при отправке заявки')
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
      setMessage(t('contact.form.error'))
    }
  }

  return (
    <section className="py-20 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Elements */}
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-800 to-dark-900"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/3 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ref}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('contact.title')} <span className="gradient-text">The SIM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.name')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.email')}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.phone')}
                />
              </div>

              <div>
                <label htmlFor="socialNetwork" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.socialNetwork') || 'Социальная сеть / Мессенджер'}
                </label>
                <input
                  type="text"
                  id="socialNetwork"
                  name="socialNetwork"
                  value={formData.socialNetwork}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.socialNetwork') || 'Telegram, WeChat, Line, WhatsApp...'}
                />
              </div>

              {/* Status Message */}
              {status !== 'idle' && (
                <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                  status === 'success' ? 'bg-green-500/20 border border-green-500/30' :
                  status === 'error' ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-blue-500/20 border border-blue-500/30'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className={`text-sm ${
                    status === 'success' ? 'text-green-400' :
                    status === 'error' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {message}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-102 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{status === 'loading' ? t('contact.form.loading') : t('contact.form.submit')}</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('contact.info.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('contact.info.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{t('contact.info.socialNetwork')}</div>
                  <div className="text-gray-400">@Sergey_Loye, @Pavlentius2007 </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{t('contact.info.email')}</div>
                  <div className="text-gray-400">info@thesim.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{t('contact.info.support')}</div>
                  <div className="text-gray-400">{t('contact.info.supportHours')}</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="glass rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">{t('contact.trust.title')}</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">{t('contact.trust.freeConsultation')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">{t('contact.trust.personalApproach')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">{t('contact.trust.quickStart')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}