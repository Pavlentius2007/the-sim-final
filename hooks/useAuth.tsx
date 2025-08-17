'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  lastLogin?: string
  createdAt: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  hasPermission: (permission: string) => boolean
  hasRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Временно отключаем автоматическую проверку аутентификации
  useEffect(() => {
    // Не проверяем авторизацию на страницах входа
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      if (pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/unauthorized') {
        setLoading(false)
        return
      }
    }
    // Временно отключаем автоматическую проверку
    // checkAuth()
    setLoading(false)
  }, [])

  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth')
      const result = await response.json()

      if ((result.success || result.authenticated) && result.user) {
        setUser(result.user)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (
    username: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, rememberMe })
      })

      const result = await response.json()

      if (result.success && result.user) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Ошибка сети' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await fetch('/api/auth', {
        method: 'DELETE'
      })
      
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Даже при ошибке API очищаем локальное состояние
      setUser(null)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  // Проверка разрешений на основе роли
  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const permissions: Record<string, string[]> = {
      admin: [
        'view_dashboard',
        'manage_leads',
        'manage_content',
        'manage_translations',
        'view_monitoring',
        'manage_settings',
        'manage_users',
        'manage_videos'
      ],
      manager: [
        'view_dashboard',
        'manage_leads',
        'manage_content',
        'manage_translations',
        'view_monitoring',
        'manage_videos'
      ],
      viewer: [
        'view_dashboard',
        'view_leads',
        'view_content',
        'view_translations',
        'view_monitoring'
      ]
    }

    return permissions[user.role]?.includes(permission) || false
  }

  // Проверка роли
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false
    
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// HOC для защищенных маршрутов
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  _requiredPermissions?: string[],
  _requiredRoles?: string[]
) => {
  return function ProtectedComponent(props: P) {
    // Временно отключаем использование переменных из useAuth
    // const { user, loading, isAuthenticated, hasPermission, hasRole } = useAuth()
    // const router = useRouter()

    // Временно отключаем автоматические проверки и перенаправления
    // useEffect(() => {
    //   if (!loading) {
    //     // Не проверяем авторизацию на страницах входа
    //     if (typeof window !== 'undefined') {
    //       const pathname = window.location.pathname
    //       if (pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/unauthorized') {
    //       return
    //     }
        
    //     if (!isAuthenticated) {
    //       router.push('/admin')
    //       return
    //     }

    //     // Проверка разрешений
    //     if (requiredPermissions) {
    //       const hasAllPermissions = requiredPermissions.every(permission => 
    //         hasPermission(permission)
    //       )
    //       if (!hasAllPermissions) {
    //         router.push('/admin/unauthorized')
    //         return
    //       }
    //     }

    //     // Проверка ролей
    //     if (requiredRoles) {
    //       if (!hasRole(requiredRoles)) {
    //         router.push('/admin/unauthorized')
    //         return
    //       }
    //     }
    //   }
    // }, [loading, isAuthenticated, user, router])

    // Временно отключаем все проверки - просто рендерим компонент
    return <WrappedComponent {...props} />
    
    // if (loading) {
    //   return (
    //     <div className="min-h-screen flex items-center justify-center">
    //       <div className="text-center">
    //         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    //         <p className="text-white">Проверка авторизации...</p>
    //       </div>
    //     </div>
    //   )
    // }

    // if (!isAuthenticated) {
    //   return null // Перенаправление произойдет в useEffect
    // }

    // return <WrappedComponent {...props} />
  }
}

// Компонент для отображения ошибки доступа
export const UnauthorizedPage = () => {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-red-400 text-4xl">🚫</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Доступ запрещен
        </h1>
        <p className="text-gray-400 mb-6 max-w-md">
          У вас нет прав для просмотра этой страницы. 
          {user && ` Ваша роль: ${user.role}`}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Назад
          </button>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthProvider

