'use client'

import { useEffect } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PersonalCabinetButton from '@/components/PersonalCabinetButton'

interface NavigationProps {
  currentLocale: string
}

export default function Navigation({ currentLocale }: NavigationProps) {
  // Обработка якорных ссылок
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }, 100)
        }
      }
    }

    // Обрабатываем хеш при загрузке страницы
    handleHashChange()

    // Обрабатываем изменения хеша
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <PersonalCabinetButton />
      <LanguageSwitcher currentLocale={currentLocale} />
    </>
  )
}
