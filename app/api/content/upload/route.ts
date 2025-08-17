import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Разрешенные типы файлов
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// POST - загрузка медиа файлов
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const section = formData.get('section') as string
    const type = formData.get('type') as string // 'image' | 'video'
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // Валидация размера файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }
    
    // Валидация типа файла
    const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const fileName = `${section || 'general'}-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Определяем папку для сохранения
    const uploadDir = type === 'video' ? 'videos' : 'images'
    const publicPath = join(process.cwd(), 'public', uploadDir)
    const filePath = join(publicPath, fileName)
    
    try {
      // Создаем папку если её нет
      await mkdir(publicPath, { recursive: true })
      
      // Сохраняем файл
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      // Формируем URL для доступа к файлу
      const fileUrl = `/${uploadDir}/${fileName}`
      
      // Получаем дополнительную информацию о файле
      const fileInfo = {
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        section: section || 'general',
        uploadedAt: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        data: fileInfo,
        message: 'File uploaded successfully'
      })
      
    } catch (uploadError) {
      console.error('Error saving file:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to save file' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET - получение списка загруженных файлов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'image' | 'video' | 'all'
    const section = searchParams.get('section')
    
    // В реальном проекте здесь будет запрос к БД с информацией о файлах
    // Пока возвращаем mock данные
    const mockFiles = [
      {
        id: '1',
        name: 'hero-background.jpg',
        originalName: 'hero-background.jpg',
        size: 2048576,
        type: 'image/jpeg',
        url: '/images/hero-background.jpg',
        section: 'hero',
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'dashboard-preview.jpg',
        originalName: 'dashboard-preview.jpg',
        size: 1536000,
        type: 'image/jpeg',
        url: '/images/dashboard-preview.jpg',
        section: 'about',
        uploadedAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '3',
        name: 'platform-demo.mp4',
        originalName: 'platform-demo.mp4',
        size: 8388608,
        type: 'video/mp4',
        url: '/videos/platform-demo.mp4',
        section: 'video',
        uploadedAt: '2024-01-15T12:00:00Z'
      }
    ]
    
    let filteredFiles = [...mockFiles]
    
    // Фильтрация по типу
    if (type && type !== 'all') {
      filteredFiles = filteredFiles.filter(file => {
        if (type === 'image') return file.type.startsWith('image/')
        if (type === 'video') return file.type.startsWith('video/')
        return true
      })
    }
    
    // Фильтрация по секции
    if (section) {
      filteredFiles = filteredFiles.filter(file => file.section === section)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredFiles,
      total: filteredFiles.length,
      message: 'Files fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}

// DELETE - удаление файла
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    const _type = searchParams.get('type') || 'image'
    
    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      )
    }
    
    // В реальном проекте здесь будет удаление файла с диска и из БД
    // Пока просто возвращаем успешный результат
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      deletedFile: fileName
    })
    
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

