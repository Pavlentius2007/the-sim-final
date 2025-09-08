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
        className="flex items-center gap-2 px-2 py-2 md:px-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
      >
        {/* На мобильных показываем только флаг */}
        <span className="text-lg md:hidden">
          {currentLanguage?.flag || '🌐'}
        </span>
        
        {/* На десктопе показываем иконку глобуса + текст */}
        <Globe className="w-4 h-4 hidden md:block" />
        <span className="text-sm font-medium hidden md:block">
          {currentLanguage?.label}
        </span>
        
        <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-50"
          >
            <div className="py-2">
              {languageOptions.map((language) => (
                <button
                  key={language.value}
                  onClick={() => handleLanguageChange(language.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
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