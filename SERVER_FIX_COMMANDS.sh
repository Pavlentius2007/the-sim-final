#!/bin/bash
# 🔧 Скрипт исправления проблем на сервере после обновления

set -e

echo "🔍 Проверка текущего состояния..."

# Перейти в директорию проекта
cd /root/the-sim-final

# 1. Удалить странные файлы-артефакты
echo "🧹 Очистка артефактов..."
rm -f " --date=iso \357\201\274 head -50" 2>/dev/null || true
rm -f "tatus --porcelain" 2>/dev/null || true
find . -name "*--date=iso*" -type f -delete 2>/dev/null || true
find . -name "*--porcelain*" -type f -delete 2>/dev/null || true
find . -name "tatus*" -type f -delete 2>/dev/null || true

# 2. Проверить какие контейнеры запущены
echo "📦 Проверка Docker контейнеров..."
docker-compose ps

# 3. Остановить все контейнеры
echo "🛑 Остановка контейнеров..."
docker-compose down

# 4. Проверить что порт 3000 свободен
echo "🔍 Проверка порта 3000..."
if lsof -i :3000 2>/dev/null; then
    echo "⚠️  Порт 3000 все еще занят!"
    echo "Процессы на порту 3000:"
    lsof -i :3000
    read -p "Остановить процессы? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti :3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
else
    echo "✅ Порт 3000 свободен"
fi

# 5. Запустить контейнеры заново
echo "🚀 Запуск контейнеров..."
docker-compose up -d

# 6. Подождать немного для запуска
echo "⏳ Ожидание запуска контейнеров..."
sleep 5

# 7. Проверить статус
echo "📊 Статус контейнеров:"
docker-compose ps

# 8. Проверить логи
echo "📋 Последние логи:"
docker-compose logs --tail=30

# 9. Проверить доступность сайта
echo "🌐 Проверка доступности сайта..."
if curl -I https://thesim.site 2>/dev/null | head -1; then
    echo "✅ Сайт доступен"
else
    echo "⚠️  Проблемы с доступностью сайта"
fi

echo ""
echo "✅ Готово! Проверьте логи:"
echo "   docker-compose logs -f"

