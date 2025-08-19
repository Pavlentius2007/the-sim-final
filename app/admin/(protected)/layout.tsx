'use client'

import AdminNavigation from '@/components/AdminNavigation'

// Временно отключаем защиту - просто рендерим layout
export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNavigation />
      <main className="flex-1 lg:ml-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
