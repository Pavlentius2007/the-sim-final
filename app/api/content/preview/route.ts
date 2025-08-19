import { NextRequest, NextResponse } from 'next/server'

// Типы для предпросмотра
interface _PreviewContent {
  section: string
  language: string
  content: Record<string, unknown>
  changes: Array<{
    field: string
    oldValue: unknown
    newValue: unknown
  }>
}

// POST - генерация предпросмотра изменений
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, language = 'ru', content, generateScreenshot = false } = body
    
    if (!section || !content) {
      return NextResponse.json(
        { success: false, error: 'Section and content are required' },
        { status: 400 }
      )
    }
    
    // В реальном проекте здесь будет:
    // 1. Получение текущего контента из БД
    // 2. Сравнение с новым контентом
    // 3. Генерация diff
    // 4. Создание временного предпросмотра
    // 5. Опционально - генерация скриншота
    
    // Mock текущего контента
    const currentContent = {
      id: section,
      title: 'Текущий заголовок',
      subtitle: 'Текущий подзаголовок',
      description: 'Текущее описание секции',
      isActive: true
    }
    
    // Вычисляем изменения
    const changes = []
    for (const key in content) {
      if (currentContent[key as keyof typeof currentContent] !== content[key]) {
        changes.push({
          field: key,
          oldValue: currentContent[key as keyof typeof currentContent],
          newValue: content[key],
          type: getChangeType(currentContent[key as keyof typeof currentContent], content[key])
        })
      }
    }
    
    // Генерируем ID предпросмотра
    const previewId = `preview_${section}_${Date.now()}`
    
    // Создаем предпросмотр данных
    const previewData = {
      id: previewId,
      section,
      language,
      content: {
        ...currentContent,
        ...content
      },
      changes,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 часа
      url: `/preview/${previewId}`
    }
    
    // В реальном проекте здесь будет сохранение в временное хранилище
    
    const response: Record<string, unknown> = {
      success: true,
      data: previewData,
      stats: {
        totalChanges: changes.length,
        addedFields: changes.filter((c: { type?: string }) => c.type === 'added').length,
        modifiedFields: changes.filter((c: { type?: string }) => c.type === 'modified').length,
        removedFields: changes.filter((c: { type?: string }) => c.type === 'removed').length
      },
      message: 'Preview generated successfully'
    }
    
    // Если запрошен скриншот
    if (generateScreenshot) {
      response.screenshot = {
        url: `/api/content/preview/screenshot/${previewId}`,
        status: 'generating',
        estimatedTime: '30-60 seconds'
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}

// GET - получение предпросмотра по ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get('id')
    
    if (!previewId) {
      return NextResponse.json(
        { success: false, error: 'Preview ID is required' },
        { status: 400 }
      )
    }
    
    // В реальном проекте здесь будет получение из временного хранилища
    // Пока возвращаем mock данные
    const mockPreview = {
      id: previewId,
      section: 'hero',
      language: 'ru',
      content: {
        id: 'hero',
        title: 'Новый заголовок',
        subtitle: 'Новый подзаголовок',
        description: 'Новое описание секции',
        isActive: true
      },
      changes: [
        {
          field: 'title',
          oldValue: 'Старый заголовок',
          newValue: 'Новый заголовок',
          type: 'modified'
        }
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      url: `/preview/${previewId}`
    }
    
    return NextResponse.json({
      success: true,
      data: mockPreview,
      message: 'Preview fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching preview:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preview' },
      { status: 500 }
    )
  }
}

// DELETE - удаление предпросмотра
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get('id')
    
    if (!previewId) {
      return NextResponse.json(
        { success: false, error: 'Preview ID is required' },
        { status: 400 }
      )
    }
    
    // В реальном проекте здесь будет удаление из временного хранилища
    
    return NextResponse.json({
      success: true,
      message: 'Preview deleted successfully',
      deletedId: previewId
    })
    
  } catch (error) {
    console.error('Error deleting preview:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete preview' },
      { status: 500 }
    )
  }
}

// Вспомогательная функция для определения типа изменения
function getChangeType(oldValue: unknown, newValue: unknown): 'added' | 'modified' | 'removed' {
  if (oldValue === undefined || oldValue === null) {
    return 'added'
  }
  if (newValue === undefined || newValue === null) {
    return 'removed'
  }
  return 'modified'
}

