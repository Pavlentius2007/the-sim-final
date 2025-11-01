# 🚀 Production Dockerfile for TheSim
FROM node:18-alpine AS base

# Рабочая директория
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./

# Копируем исходный код
COPY . .

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm install --production=false

# Проверяем что установилось
RUN ls -la node_modules/ && \
    which next || echo "next not in PATH" && \
    ls -la node_modules/.bin/ || echo "no .bin folder" && \
    test -f node_modules/.bin/next && echo "next binary found" || echo "next binary NOT found"

# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

# Создаем production сборку  
RUN npm run build && npm cache clean --force

# Production образ
FROM node:18-alpine AS runner

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из builder
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public

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
