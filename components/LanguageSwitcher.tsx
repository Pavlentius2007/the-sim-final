'use client'

import { useState } from 'react'
import { m } from '@/components/LazyMotionProvider'
import { AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { getLanguageOptions } from '@/utils/languageUtils'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const languageOptions = getLanguageOptions()

  const handleLanguageChange = (locale: string) => {
    setIsOpen(false)
    
    // Создаем новый путь с новой локалью
    const pathSegments = pathname.split('/')
    pathSegments[1] = locale
    const newPath = pathSegments.join('/')
    
    router.push(newPath)
  }

  const currentLanguage = languageOptions.find(lang => lang.value === currentLocale)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-xl rounded-xl border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
        suppressHydrationWarning
      >
        {/* Градиентная подсветка при наведении */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* На мобильных показываем только флаг */}
        <span className="relative z-10 text-2xl md:hidden">
          {currentLanguage?.flag || '🌐'}
        </span>
        
        {/* На десктопе показываем только иконку глобуса */}
        <Globe className="relative z-10 w-5 h-5 md:w-6 md:h-6 hidden md:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1">
              {languageOptions.map((language) => (
                <button
                  key={language.value}
                  onClick={() => handleLanguageChange(language.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-all duration-200 ${
                    currentLocale === language.value
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.label}</span>
                </button>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
} 