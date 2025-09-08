'use client'

import { m } from '@/components/LazyMotionProvider'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { useState, useEffect } from 'react'

export default function Testimonials() {
  const { t } = useTranslations()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Проверяем размер экрана
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const testimonials = [
    {
      name: t('testimonials.items.anton.name'),
      role: t('testimonials.items.anton.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.anton.content'),
      rating: 5,
      highlight: t('testimonials.items.anton.highlight')
    },
    {
      name: t('testimonials.items.lyudmila.name'),
      role: t('testimonials.items.lyudmila.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.lyudmila.content'),
      rating: 5,
      highlight: t('testimonials.items.lyudmila.highlight')
    },
    {
      name: t('testimonials.items.nattapong.name'),
      role: t('testimonials.items.nattapong.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.nattapong.content'),
      rating: 5,
      highlight: t('testimonials.items.nattapong.highlight')
    },
    {
      name: t('testimonials.items.david.name'),
      role: t('testimonials.items.david.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.david.content'),
      rating: 5,
      highlight: t('testimonials.items.david.highlight')
    },
    {
      name: t('testimonials.items.zhanna.name'),
      role: t('testimonials.items.zhanna.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.zhanna.content'),
      rating: 5,
      highlight: t('testimonials.items.zhanna.highlight')
    },
    {
      name: t('testimonials.items.olivier.name'),
      role: t('testimonials.items.olivier.role'),
      avatar: '/api/placeholder/60/60',
      content: t('testimonials.items.olivier.content'),
      rating: 5,
      highlight: t('testimonials.items.olivier.highlight')
    }
  ]

  const nextSlide = () => {
    // На мобильном показываем по 1 отзыву, на десктопе по 3
    const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevSlide = () => {
    // На мобильном показываем по 1 отзыву, на десктопе по 3  
    const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 3
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  return (
    <section className="py-20 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Elements */}
      {/* Убираем градиентные фоны */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800"></div> */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('testimonials.title')} <span className="gradient-text">The SIM</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </m.div>

        {/* Testimonials Carousel */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16"
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-0 md:-translate-x-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary-400" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-0 md:translate-x-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary-400" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: isMobile 
                  ? `translateX(-${currentIndex * 100}%)` 
                  : `translateX(-${currentIndex * 33.333}%)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <m.div
                  key={index}
                  className="w-full md:w-1/3 px-2 md:px-4 flex-shrink-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="glass rounded-2xl p-6 md:p-8 h-full hover-lift relative group">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="w-8 h-8 text-primary-500" />
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6">
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base line-clamp-4 md:line-clamp-none">
                        {testimonial.content.split(testimonial.highlight).map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="text-primary-400 font-semibold">
                                {testimonial.highlight}
                              </span>
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                    
                    {/* Author */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ 
              length: isMobile ? testimonials.length : testimonials.length - 2 
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </m.div>

        {/* CTA Section */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('testimonials.cta.title')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('testimonials.cta.subtitle')}
            </p>
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const contactForm = document.getElementById('contact-form')
                if (contactForm) {
                  contactForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  })
                  // Добавляем небольшой отступ сверху для лучшего вида
                  setTimeout(() => {
                    window.scrollBy({
                      top: -100,
                      behavior: 'smooth'
                    })
                  }, 500)
                }
              }}
              className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all cursor-pointer transform hover:-translate-y-1"
            >
              {t('testimonials.cta.button')}
            </m.button>
          </div>
        </m.div>
      </div>
    </section>
  )
} 