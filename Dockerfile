# 🚀 CosmicLanding - Docker Image
# Многоэтапная сборка для оптимизации размера

# ========================================
# ЭТАП 1: Сборка
# ========================================
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production
ENV JWT_SECRET=yF83hS7WAaQtTqGHd6JuV3NMUEQ5m2cwbBmpVgGJ7cBbLHwZchtKyvGgYz3MkA7r
ENV ENCRYPTION_KEY=Yh5BhFGfcpuR2NVa5ajqtWqgCczDqCtv
ENV COOKIE_SECRET=j7dMx7xdvKkACjqV8uykN3tfPTNczZwm
ENV CSRF_SECRET=jvjJ2CVgJhrEPSa6rGbL54ENRa6HdXnmLFcrUuwauFXuh8B5zgGa9MBVQDdxttzz

# Собираем проект
RUN npm run build

# ========================================
# ЭТАП 2: Продакшен
# ========================================
FROM node:18-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Копируем package.json
COPY package*.json ./

# Устанавливаем только продакшен зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/middleware.ts ./

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Переменные окружения (будут переопределены в docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

# Команда запуска
CMD ["npm", "start"]
