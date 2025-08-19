import { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

// Проверяем наличие JWT_SECRET в продакшене
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production environment')
}

if (JWT_SECRET && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}

// Путь к базе данных пользователей
const USERS_DB_PATH = path.join(process.cwd(), 'data', 'users.json')

// Интерфейсы
export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: 'admin' | 'manager' | 'user'
  firstName: string
  lastName: string
  isActive: boolean
  createdAt: string
  lastLogin: string | null
  permissions: string[]
}

export interface DecodedToken {
  userId: string
  username: string
  role: string
  email: string
  exp: number
  iat: number
  iss: string
  sub: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Функции для работы с базой данных
async function loadUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_DB_PATH, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.users || []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

async function saveUsers(users: User[]): Promise<void> {
  try {
    const data = { users }
    await fs.writeFile(USERS_DB_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
    throw new Error('Failed to save users')
  }
}

// Аутентификация пользователя
export async function authenticateUser(credentials: LoginCredentials): Promise<{
  success: boolean
  user?: Omit<User, 'passwordHash'>
  token?: string
  error?: string
}> {
  try {
    const users = await loadUsers()
    const user = users.find(u => 
      u.username === credentials.username && 
      u.isActive
    )

    if (!user) {
      return {
        success: false,
        error: 'Неверное имя пользователя или пароль'
      }
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Неверное имя пользователя или пароль'
      }
    }

    // Обновляем время последнего входа
    user.lastLogin = new Date().toISOString()
    await saveUsers(users)

    // Создаем JWT токен
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
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
    return {
      success: false,
      error: 'Ошибка аутентификации'
    }
  }
}

// Проверка JWT токена
export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return payload as unknown as DecodedToken
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Получение токена из запроса
export function getTokenFromRequest(request: NextRequest): string | null {
  // Проверяем cookie
  const tokenFromCookie = request.cookies.get('auth-token')?.value
  
  // Проверяем заголовок Authorization
  const authHeader = request.headers.get('Authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null
  
  return tokenFromCookie || tokenFromHeader
}

// Проверка аутентификации для API маршрутов
export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean
  user?: DecodedToken
  error?: string
}> {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return {
        success: false,
        error: 'Токен не предоставлен'
      }
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return {
        success: false,
        error: 'Недействительный токен'
      }
    }

    // Проверяем, не истек ли токен
    if (decoded.exp * 1000 < Date.now()) {
      return {
        success: false,
        error: 'Токен истек'
      }
    }

    return {
      success: true,
      user: decoded
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Ошибка аутентификации'
    }
  }
}

// Проверка ролей
export function isAdmin(user: DecodedToken): boolean {
  return user.role === 'admin'
}

export function isManagerOrHigher(user: DecodedToken): boolean {
  return ['admin', 'manager'].includes(user.role)
}

// Создание нового пользователя (только для админов)
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<{
  success: boolean
  user?: Omit<User, 'passwordHash'>
  error?: string
}> {
  try {
    const users = await loadUsers()
    
    // Проверяем уникальность username и email
    if (users.some(u => u.username === userData.username)) {
      return {
        success: false,
        error: 'Пользователь с таким именем уже существует'
      }
    }
    
    if (users.some(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'Пользователь с таким email уже существует'
      }
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(userData.passwordHash, 12)
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      passwordHash
    }

    users.push(newUser)
    await saveUsers(users)

    const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser
    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      error: 'Ошибка создания пользователя'
    }
  }
}

// Изменение пароля
export async function changePassword(
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const users = await loadUsers()
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      }
    }

    // Проверяем текущий пароль
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Неверный текущий пароль'
      }
    }

    // Хешируем новый пароль
    user.passwordHash = await bcrypt.hash(newPassword, 12)
    await saveUsers(users)

    return { success: true }
  } catch (error) {
    console.error('Error changing password:', error)
    return {
      success: false,
      error: 'Ошибка изменения пароля'
    }
  }
}

// Экспортируем loadUsers для использования в других модулях
export { loadUsers }
