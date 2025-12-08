#!/bin/bash
# 🔧 Скрипт исправления ошибки сборки и обновления

set -e

echo "🔧 Исправление ошибки сборки..."
echo ""

cd /root/the-sim-final

# 1. Установить ВСЕ зависимости (включая dev)
echo "📦 Установка всех зависимостей (включая dev)..."
npm install
echo ""

# 2. Пересобрать проект
echo "🏗️ Пересборка проекта..."
npm run build
echo ""

# 3. Проверить что сборка успешна
if [ -d ".next" ]; then
    echo "✅ Сборка успешна!"
else
    echo "❌ Ошибка сборки!"
    exit 1
fi

# 4. Перезапустить PM2
echo "🔄 Перезапуск PM2..."
pm2 restart thesim
echo ""

# 5. Подождать запуска
echo "⏳ Ожидание запуска..."
sleep 5

# 6. Проверить статус
echo "📊 Статус PM2:"
pm2 status
echo ""

# 7. Проверить логи
echo "📋 Последние логи:"
pm2 logs thesim --lines 20 --nostream
echo ""

# 8. Проверить доступность
echo "🌐 Проверка доступности:"
if curl -I http://localhost:3000 2>/dev/null | head -1; then
    echo "✅ Приложение доступно на localhost:3000"
else
    echo "⚠️  Приложение может еще запускаться"
fi

if curl -I https://thesim.site 2>/dev/null | head -1; then
    echo "✅ Сайт доступен на https://thesim.site"
else
    echo "⚠️  Проверьте настройки Nginx"
fi

echo ""
echo "✅ Готово!"

