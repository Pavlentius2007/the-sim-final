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

# Собираем проект (ИСПРАВЛЕНО - используем npx)
RUN npx next build

# ========================================
# ЭТАП 2: Продакшен
# ========================================
FROM node:18-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Устанавливаем только продакшен зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
