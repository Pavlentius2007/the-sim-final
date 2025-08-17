'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkle: number
  twinkleSpeed: number
  color: string
}

interface StarryBackgroundProps {
  className?: string
  starCount?: number
  baseSpeed?: number
  mouseSensitivity?: number
  scrollSensitivity?: number
}

export default function StarryBackground({
  className = '',
  starCount = 200,
  baseSpeed = 0.5,
  mouseSensitivity = 3,
  scrollSensitivity = 2
}: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const starsRef = useRef<Star[]>([])

  // Цвета звезд на основе существующей цветовой схемы
  const starColors = [
    '#FFFFFF', // белый
    '#4B6CB7', // primary-500
    '#8B5CF6', // accent-purple
    '#06B6D4', // accent-cyan
    '#3B82F6', // accent-blue
    '#F0F4FF', // primary-50
    '#C7D6FF'  // primary-200
  ]

  // Инициализация звезд
  const initializeStars = useCallback(() => {
    const stars: Star[] = []
    for (let i = 0; i < starCount; i++) {
      // Проверяем, что размеры окна валидны
      if (windowSize.width > 0 && windowSize.height > 0) {
        const x = Math.random() * windowSize.width
        const y = Math.random() * windowSize.height
        const size = Math.random() * 2.5 + 0.5
        const speed = Math.random() * baseSpeed + 0.1
        
        // Проверяем валидность всех значений
        if (isFinite(x) && isFinite(y) && isFinite(size) && isFinite(speed) &&
            !isNaN(x) && !isNaN(y) && !isNaN(size) && !isNaN(speed)) {
          stars.push({
            x,
            y,
            size,
            opacity: Math.random() * 0.8 + 0.2,
            speed,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            color: starColors[Math.floor(Math.random() * starColors.length)]
          })
        }
      }
    }
    starsRef.current = stars
  }, [starCount, baseSpeed, windowSize])

  // Обработчик движения мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }, [])

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)
  }, [])

  // Обработчик изменения размера окна
  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight
    
    // Проверяем валидность новых размеров
    if (isFinite(newWidth) && isFinite(newHeight) && 
        !isNaN(newWidth) && !isNaN(newHeight) && 
        newWidth > 0 && newHeight > 0) {
      setWindowSize({
        width: newWidth,
        height: newHeight
      })
    }
  }, [])

  // Анимация звезд
  const animateStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Создаем градиентный фон
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    )
    gradient.addColorStop(0, 'rgba(10, 15, 31, 0.8)') // dark-900
    gradient.addColorStop(0.5, 'rgba(10, 15, 31, 0.6)')
    gradient.addColorStop(1, 'rgba(10, 15, 31, 0.9)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Обновляем и рисуем звезды
    starsRef.current.forEach((star) => {
      // Проверяем валидность координат
      if (!isFinite(star.x) || !isFinite(star.y) || isNaN(star.x) || isNaN(star.y)) {
        // Если координаты невалидны, сбрасываем звезду
        star.x = Math.random() * canvas.width
        star.y = Math.random() * canvas.height
        star.speed = Math.random() * baseSpeed + 0.1
        return
      }

      // Обновляем мерцание
      star.twinkle += star.twinkleSpeed
      
      // Вычисляем дополнительную скорость от мыши
      const dx = mousePosition.x - star.x
      const dy = mousePosition.y - star.y
      const mouseDistance = Math.sqrt(dx * dx + dy * dy)
      const mouseInfluence = Math.max(0, 1 - mouseDistance / 400) * mouseSensitivity
      
      // Вычисляем дополнительную скорость от скролла
      const scrollInfluence = (scrollY / windowSize.height) * scrollSensitivity
      
      // Обновляем позицию звезды
      star.y += (star.speed + mouseInfluence + scrollInfluence) * 0.5
      
      // Если звезда вышла за пределы экрана, перемещаем её вверх
      if (star.y > canvas.height) {
        star.y = -10
        star.x = Math.random() * canvas.width
        star.color = starColors[Math.floor(Math.random() * starColors.length)]
      }

      // Дополнительная проверка валидности после обновления
      if (!isFinite(star.x) || !isFinite(star.y) || isNaN(star.x) || isNaN(star.y)) {
        return
      }

      // Рисуем звезду
      const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle))
      
      // Основная звезда
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `${star.color}${Math.floor(twinkleOpacity * 255).toString(16).padStart(2, '0')}`
      ctx.fill()

      // Свечение вокруг звезды (с дополнительной проверкой)
      try {
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        )
        glowGradient.addColorStop(0, `${star.color}${Math.floor(twinkleOpacity * 0.8 * 255).toString(16).padStart(2, '0')}`)
        glowGradient.addColorStop(0.5, `${star.color}${Math.floor(twinkleOpacity * 0.3 * 255).toString(16).padStart(2, '0')}`)
        glowGradient.addColorStop(1, 'transparent')
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()
      } catch (error) {
        // Если не удалось создать градиент, рисуем простую звезду
        console.warn('Failed to create star glow:', error)
      }

      // Иногда добавляем лучи для ярких звезд
      if (star.size > 1.8 && Math.sin(star.twinkle) > 0.8) {
        ctx.strokeStyle = `${star.color}${Math.floor(twinkleOpacity * 0.4 * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.8
        
        // Горизонтальный луч
        ctx.beginPath()
        ctx.moveTo(star.x - star.size * 5, star.y)
        ctx.lineTo(star.x + star.size * 5, star.y)
        ctx.stroke()
        
        // Вертикальный луч
        ctx.beginPath()
        ctx.moveTo(star.x, star.y - star.size * 5)
        ctx.lineTo(star.x, star.y + star.size * 5)
        ctx.stroke()
        
        // Диагональные лучи
        ctx.beginPath()
        ctx.moveTo(star.x - star.size * 3.5, star.y - star.size * 3.5)
        ctx.lineTo(star.x + star.size * 3.5, star.y + star.size * 3.5)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(star.x - star.size * 3.5, star.y + star.size * 3.5)
        ctx.lineTo(star.x + star.size * 3.5, star.y - star.size * 3.5)
        ctx.stroke()
      }
    })

    // Добавляем случайные метеоры
    if (Math.random() < 0.01) {
      const meteorX = Math.random() * canvas.width
      const meteorY = -20
      const meteorLength = Math.random() * 120 + 80
      const meteorColor = starColors[Math.floor(Math.random() * starColors.length)]
      
      // Проверяем валидность координат метеора
      if (isFinite(meteorX) && isFinite(meteorY) && isFinite(meteorLength) && 
          !isNaN(meteorX) && !isNaN(meteorY) && !isNaN(meteorLength)) {
        
        ctx.strokeStyle = `${meteorColor}cc`
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        
        // Основной след метеора
        ctx.beginPath()
        ctx.moveTo(meteorX, meteorY)
        ctx.lineTo(meteorX - meteorLength, meteorY + meteorLength)
        ctx.stroke()
        
        // Дополнительные следы
        ctx.strokeStyle = `${meteorColor}66`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(meteorX + 2, meteorY + 2)
        ctx.lineTo(meteorX - meteorLength + 2, meteorY + meteorLength + 2)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(meteorX - 2, meteorY - 2)
        ctx.lineTo(meteorX - meteorLength - 2, meteorY + meteorLength - 2)
        ctx.stroke()
      }
    }

    // Добавляем туманности
    if (Math.random() < 0.005) {
      const nebulaX = Math.random() * canvas.width
      const nebulaY = Math.random() * canvas.height
      const nebulaSize = Math.random() * 200 + 100
      const nebulaColor = starColors[Math.floor(Math.random() * starColors.length)]
      
      // Проверяем валидность координат туманности
      if (isFinite(nebulaX) && isFinite(nebulaY) && isFinite(nebulaSize) && 
          !isNaN(nebulaX) && !isNaN(nebulaY) && !isNaN(nebulaSize)) {
        try {
          const nebulaGradient = ctx.createRadialGradient(
            nebulaX, nebulaY, 0,
            nebulaX, nebulaY, nebulaSize
          )
          nebulaGradient.addColorStop(0, `${nebulaColor}20`)
          nebulaGradient.addColorStop(0.5, `${nebulaColor}10`)
          nebulaGradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = nebulaGradient
          ctx.beginPath()
          ctx.arc(nebulaX, nebulaY, nebulaSize, 0, Math.PI * 2)
          ctx.fill()
        } catch (error) {
          console.warn('Failed to create nebula:', error)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animateStars)
  }, [mousePosition, scrollY, windowSize, mouseSensitivity, scrollSensitivity, baseSpeed])

  // Инициализация размера окна при монтировании
  useEffect(() => {
    const initializeSize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    
    initializeSize()
  }, [])

  // Эффекты при монтировании (после инициализации размеров)
  useEffect(() => {
    if (windowSize.width > 0 && windowSize.height > 0) {
      initializeStars()
    }
  }, [windowSize, initializeStars])

  // Добавляем обработчики событий
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [handleMouseMove, handleScroll, handleResize])

  // Запуск анимации
  useEffect(() => {
    animateStars()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animateStars])



  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      width={windowSize.width}
      height={windowSize.height}
    />
  )
}