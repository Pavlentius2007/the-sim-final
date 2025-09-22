'use client'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import PersonalCabinetButton from '@/components/PersonalCabinetButton'

interface HeroNavigationProps {
  currentLocale: string
}

export default function HeroNavigation({ currentLocale }: HeroNavigationProps) {
  return (
    <div className="flex items-center gap-2" suppressHydrationWarning>
      <PersonalCabinetButton />
      <LanguageSwitcher currentLocale={currentLocale} />
    </div>
  )
}
