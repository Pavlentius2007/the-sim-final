import { NextRequest } from 'next/server'
import { withAuthSecurity } from '@/lib/apiWrapper'
import { createSecureResponse } from '@/lib/security'
import { createUser, loadUsers } from '@/lib/auth'
import { isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  return withAuthSecurity(request, async (req) => {
    try {
      // Проверяем, что пользователь - админ
      const token = req.cookies.get('auth-token')?.value
      if (!token) {
        return createSecureResponse({
          error: 'Требуется аутентификация'
        }, 401)
      }

      const { authenticateRequest } = await import('@/lib/auth')
      const authResult = await authenticateRequest(req)
      
      if (!authResult.success || !authResult.user) {
        return createSecureResponse({
          error: 'Недействительный токен'
        }, 401)
      }

      if (!isAdmin(authResult.user)) {
        return createSecureResponse({
          error: 'Недостаточно прав'
        }, 403)
      }

      // Загружаем список пользователей
      const users = await loadUsers()
      const usersWithoutPasswords = users.map(user => {
        const { passwordHash: _passwordHash, ...userWithoutPassword } = user
        return userWithoutPassword
      })

      return createSecureResponse({
        success: true,
        users: usersWithoutPasswords
      })
    } catch (error) {
      console.error('Error loading users:', error)
      return createSecureResponse({
        error: 'Ошибка загрузки пользователей'
      }, 500)
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuthSecurity(request, async (req) => {
    try {
      // Проверяем права админа
      const token = req.cookies.get('auth-token')?.value
      if (!token) {
        return createSecureResponse({
          error: 'Требуется аутентификация'
        }, 401)
      }

      const { authenticateRequest, isAdmin } = await import('@/lib/auth')
      const authResult = await authenticateRequest(req)
      
      if (!authResult.success || !authResult.user) {
        return createSecureResponse({
          error: 'Недействительный токен'
        }, 401)
      }

      if (!isAdmin(authResult.user)) {
        return createSecureResponse({
          error: 'Недостаточно прав'
        }, 403)
      }

      // Получаем данные нового пользователя
      const userData = await req.json()
      
      // Создаем пользователя
      const result = await createUser(userData)
      
      if (!result.success) {
        return createSecureResponse({
          error: result.error
        }, 400)
      }

      return createSecureResponse({
        success: true,
        user: result.user
      }, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return createSecureResponse({
        error: 'Ошибка создания пользователя'
      }, 500)
    }
  })
}
