# 🚀 CosmicLanding - Docker Image (использует готовую сборку)
# Простая версия без многоэтапной сборки

FROM node:18-alpine

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем уже собранное приложение
COPY --chown=nextjs:nodejs .next ./.next
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs next.config.js ./
COPY --chown=nextjs:nodejs package.json ./

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
