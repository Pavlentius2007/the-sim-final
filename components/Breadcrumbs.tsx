'use client'

import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbsProps {
  locale: string
  items?: Array<{
    label: string
    href?: string
  }>
}

export default function Breadcrumbs({ locale, items = [] }: BreadcrumbsProps) {
  const { t } = useTranslations()
  
  const breadcrumbItems = [
    {
      label: t('navigation.home') || 'Home',
      href: `/${locale}`
    },
    ...items
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-400">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-500" />
            )}
            
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-white transition-colors duration-200 flex items-center"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
