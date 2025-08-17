'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, X, Smartphone, Monitor } from 'lucide-react'

interface ContentPreviewProps {
  content: any
  isOpen: boolean
  onClose: () => void
}

export default function ContentPreview({ content, isOpen, onClose }: ContentPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!isOpen) return null

  const deviceClasses = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-full max-w-2xl',
    mobile: 'w-full max-w-sm'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-white rounded-xl shadow-2xl overflow-hidden ${deviceClasses[device]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Предварительный просмотр</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Переключатели устройств */}
            <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded ${device === 'desktop' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-2 rounded ${device === 'tablet' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Tablet"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded ${device === 'mobile' ? 'bg-white shadow' : 'text-gray-500'}`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="bg-white overflow-auto" style={{ height: '80vh' }}>
          <div className="p-6">
            {/* Hero Section */}
            <section className="text-center py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg mb-8">
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  The SIM
                </span>
              </h1>
              <h2 className="text-2xl font-bold mb-4">
                {content?.hero?.title || 'Заголовок не найден'}
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                {content?.hero?.subtitle || 'Подзаголовок не найден'}
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {content?.hero?.cta || 'Начать'}
                </button>
                <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                  {content?.hero?.learnMore || 'Узнать больше'}
                </button>
              </div>
            </section>

            {/* About Section */}
            <section className="py-12 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {content?.about?.title || 'О платформе'}
                </h2>
                <p className="text-lg text-gray-600">
                  {content?.about?.description || 'Описание платформы'}
                </p>
              </div>
              
              {content?.about?.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(content.about.features).map(([key, feature]) => (
                    <div key={key} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {(feature as Record<string, string>).title || 'Заголовок'}
                      </h3>
                      <p className="text-gray-600">
                        {(feature as Record<string, string>).description || 'Описание'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Benefits Section */}
            <section className="py-12 bg-gray-50 rounded-lg mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {content?.benefits?.title || 'Преимущества'}
                </h2>
                {content?.benefits?.why && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {content.benefits.why.title || 'Почему'}
                    </h3>
                    <p className="text-gray-600">
                      {content.benefits.why.subtitle || 'Подзаголовок'}
                    </p>
                  </div>
                )}
              </div>
              
              {content?.benefits && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(content.benefits).map(([key, benefit]) => {
                    if (key === 'title' || key === 'why') return null
                    return (
                      <div key={key} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {(benefit as Record<string, string>).title || 'Заголовок'}
                        </h3>
                        <p className="text-gray-600">
                          {(benefit as Record<string, string>).description || 'Описание'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Video Section */}
            {content?.video && (
              <section className="py-12 mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {content.video.title || 'Видеообзор'}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {content.video.subtitle || 'Описание видео'}
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {content.video.videoTitle || 'Название видео'}
                  </h3>
                  <div className="flex justify-center space-x-4 text-gray-300">
                    <span>{content.video.duration || '00:00'}</span>
                    <span>{content.video.quality || 'HD'}</span>
                    <span>{content.video.language || 'RU'}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Security Section */}
            {content?.security && (
              <section className="py-12 bg-blue-50 rounded-lg mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {content.security.title || 'Безопасность'}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {content.security.subtitle || 'Описание безопасности'}
                  </p>
                </div>
                
                {content.security.features && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(content.security.features).map(([key, feature]) => (
                      <div key={key} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {(feature as Record<string, string>).title || 'Заголовок'}
                        </h3>
                        <p className="text-gray-600">
                          {(feature as Record<string, string>).description || 'Описание'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Testimonials Section */}
            {content?.testimonials && (
              <section className="py-12 mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {content.testimonials.title || 'Отзывы'}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {content.testimonials.subtitle || 'Описание отзывов'}
                  </p>
                </div>
                
                {content.testimonials.items && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(content.testimonials.items).map(([key, testimonial]: [string, any]) => (
                      <div key={key} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {testimonial.name || 'Имя'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {testimonial.role || 'Роль'}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 italic">
                          "{testimonial.text || 'Текст отзыва'}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Contact Section */}
            {content?.contact && (
              <section className="py-12 bg-gray-900 text-white rounded-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {content.contact.title || 'Контакты'}
                  </h2>
                  <p className="text-lg text-gray-300">
                    {content.contact.subtitle || 'Описание контактов'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {content.contact.info?.title || 'Контактная информация'}
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>{content.contact.info?.email || 'email@example.com'}</p>
                      <p>{content.contact.info?.phone || '+7 (999) 123-45-67'}</p>
                      <p>{content.contact.info?.address || 'Адрес'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {content.contact.form?.title || 'Форма обратной связи'}
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder={content.contact.form?.namePlaceholder || 'Ваше имя'}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                      />
                      <input
                        type="email"
                        placeholder={content.contact.form?.emailPlaceholder || 'Email'}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                      />
                      <textarea
                        placeholder={content.contact.form?.messagePlaceholder || 'Сообщение'}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                      ></textarea>
                      <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {content.contact.form?.submitText || 'Отправить'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
