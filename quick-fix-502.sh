#!/bin/bash

# 🚀 Быстрое исправление ошибки 502 Bad Gateway

echo "🔧 Быстрое исправление ошибки 502..."

# 1. Остановка всех контейнеров
echo "⏹️ Остановка контейнеров..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.http.yml down 2>/dev/null || true

# 2. Очистка
echo "🧹 Очистка..."
docker system prune -f

# 3. Обновление кода
echo "📥 Обновление кода..."
git pull origin main

# 4. Запуск HTTP версии (без SSL)
echo "🚀 Запуск HTTP версии..."
docker-compose -f docker-compose.http.yml up -d --build

# 5. Ожидание запуска
echo "⏳ Ожидание запуска (30 секунд)..."
sleep 30

# 6. Проверка статуса
echo "✅ Проверка статуса..."
docker-compose -f docker-compose.http.yml ps

# 7. Проверка логов
echo "📋 Последние логи:"
docker-compose -f docker-compose.http.yml logs --tail=20

# 8. Проверка доступности
echo "🌐 Проверка доступности..."
curl -I http://localhost:80 || echo "❌ HTTP недоступен"

echo "🎉 Исправление завершено!"
echo "🌐 Сайт должен быть доступен по адресу: http://thesim.site"
echo "📊 Мониторинг: docker-compose -f docker-compose.http.yml logs -f"
