# 🚀 Production Dockerfile for TheSim
FROM node:18-alpine AS base

# Устанавливаем зависимости для сборки
RUN apk add --no-cache libc6-compat

# Рабочая директория
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci && npm cache clean --force

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production
# Секреты должны передаваться через docker-compose env_file или docker run --env-file
ARG CSRF_SECRET
ARG JWT_SECRET
ARG ENCRYPTION_KEY
ARG COOKIE_SECRET
ENV CSRF_SECRET=${CSRF_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}
ENV COOKIE_SECRET=${COOKIE_SECRET}

# Создаем production сборку
RUN npm run build

# Production образ
FROM node:18-alpine AS runner

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из builder
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Устанавливаем права
RUN chown -R nextjs:nodejs /app

USER nextjs

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["node", "server.js"]
