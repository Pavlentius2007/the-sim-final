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
ENV CSRF_SECRET=HmbmcNZ8g8sfhZGC8e6Vs3ESsx9Eh8ZpNAqUvjHWkT9ErcKwGr6HMkamMpdzBE4G
ENV JWT_SECRET=rSA4hfVLhhwa3u2dfgH8bwzbj7Q5SG9zGwnqeFLfFvYQZTYYdPnXu9cH9zqkLpks
ENV ENCRYPTION_KEY=hQEhGj93DC4cQrnfbvmgYWG2WMKDqj93
ENV COOKIE_SECRET=KCTe6jLdwJs9ChaBZc8XMJLqF7v5D8uZ

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
