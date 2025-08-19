'use client'


import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import '../globals.css'
import AdminNavigation from '@/components/AdminNavigation'
import { AuthProvider } from '@/hooks/useAuth'
import ToastProvider from '@/components/ToastProvider'
import GlobalStarryBackground from '@/components/GlobalStarryBackground'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

// Компонент для внутреннего содержимого
function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Не показываем навигацию на страницах логина, unauthorized и главной странице админки
  // Также не показываем на защищенных страницах (они имеют свой layout)
  const isPublicPage = pathname === '/admin/login' || pathname === '/admin/unauthorized' || pathname === '/admin'
  const isProtectedPage = pathname.startsWith('/admin/dashboard') || 
                         pathname.startsWith('/admin/leads') || 
                         pathname.startsWith('/admin/translations') || 
                         pathname.startsWith('/admin/videos') || 
                         pathname.startsWith('/admin/content') || 
                         pathname.startsWith('/admin/monitoring') || 
                         pathname.startsWith('/admin/settings')
  
  if (isPublicPage || isProtectedPage) {
    return (
      <div className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNavigation />
      <main className="flex-1 lg:ml-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            {/* Космический фон для админки */}
            <GlobalStarryBackground intensity="low" />
            <AdminLayoutContent>
              {children}
            </AdminLayoutContent>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
