#!/bin/bash

# 🚀 Скрипт развертывания TheSim на thesim.site

echo "🌐 Развертывание TheSim на thesim.site..."

# 1. Остановка старых контейнеров
echo "⏹️ Остановка старых контейнеров..."
docker-compose -f docker-compose.prod.yml down

# 2. Обновление кода
echo "📥 Обновление кода..."
git pull origin main

# 3. Сборка и запуск
echo "🔨 Сборка и запуск..."
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Проверка статуса
echo "✅ Проверка статуса..."
docker-compose -f docker-compose.prod.yml ps

# 5. Проверка логов
echo "📋 Последние логи:"
docker-compose -f docker-compose.prod.yml logs --tail=20

# 6. Проверка доступности
echo "🌐 Проверка доступности сайта..."
sleep 10
curl -I http://localhost:80 || echo "❌ HTTP недоступен"
curl -I https://localhost:443 || echo "❌ HTTPS недоступен"

echo "🎉 Развертывание завершено!"
echo "🌐 Сайт доступен по адресу: https://thesim.site"
echo "📊 Мониторинг: docker-compose -f docker-compose.prod.yml logs -f"
