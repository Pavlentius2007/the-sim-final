import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import fs from 'fs/promises'
import path from 'path'

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600'

// Проверяем наличие JWT_SECRET в продакшене
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production environment')
}

if (JWT_SECRET && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}

// Проверяем JWT_EXPIRES_IN
if (JWT_EXPIRES_IN && isNaN(parseInt(JWT_EXPIRES_IN))) {
  throw new Error('JWT_EXPIRES_IN must be a valid number')
}

// Путь к базе данных пользователей
const USERS_DB_PATH = path.join(process.cwd(), 'data', 'users.json')

// Загружаем пользователей
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.users || []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

// Аутентификация пользователя
async function authenticateUser(username: string, password: string) {
  try {
    const users = await loadUsers()
    const user = users.find((u: any) => 
      u.username === username && 
      u.isActive
    )

    if (!user) {
      return { success: false, error: 'Неверное имя пользователя или пароль' }
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return { success: false, error: 'Неверное имя пользователя или пароль' }
    }

    // Создаем JWT токен
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRES_IN))
      .setIssuer('the-sim-app')
      .setSubject(user.id)
      .sign(new TextEncoder().encode(JWT_SECRET))

    // Возвращаем пользователя без пароля
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Ошибка аутентификации' }
  }
}

// POST - вход в систему
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Простая валидация
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Заполните все поля' },
        { status: 400 }
      )
    }

    // Аутентифицируем пользователя
    const authResult = await authenticateUser(username, password)
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    // Создаем ответ
    const response = NextResponse.json({
      success: true,
      user: authResult.user,
      token: authResult.token
    })

    // Устанавливаем cookie с токеном
    response.cookies.set('auth-token', authResult.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 часа
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// GET - проверка аутентификации
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        error: 'Токен не предоставлен'
      })
    }

    // Проверяем JWT токен
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      )

      // Загружаем пользователя для проверки актуальности
      const users = await loadUsers()
      const user = users.find((u: Record<string, unknown>) => u.id === payload.userId && u.isActive)

      if (!user) {
        return NextResponse.json({
          authenticated: false,
          error: 'Пользователь не найден или неактивен'
        }, { status: 401 })
      }

      // Возвращаем пользователя без пароля
      const { passwordHash: _passwordHash, ...userWithoutPassword } = user as Record<string, unknown>

      return NextResponse.json({
        authenticated: true,
        success: true,
        user: userWithoutPassword
      })
    } catch {
      return NextResponse.json({
        authenticated: false,
        error: 'Недействительный токен'
      }, { status: 401 })
    }
    
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({
      authenticated: false,
      error: 'Ошибка проверки сессии'
    }, { status: 500 })
  }
}

// DELETE - выход из системы
export async function DELETE(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Успешный выход из системы'
    })

    // Удаляем cookie с токеном
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка выхода из системы'
    }, { status: 500 })
  }
}

