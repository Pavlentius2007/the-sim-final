#!/bin/bash
# 🚀 Скрипт обновления проекта через PM2

set -e

echo "🚀 Обновление TheSim через PM2..."
echo ""

# Перейти в директорию проекта
cd /root/the-sim-final

# 1. Проверить статус PM2
echo "📊 Текущий статус PM2:"
pm2 list
echo ""

# 2. Обновить код из GitHub
echo "📥 Обновление кода из GitHub..."
git pull origin main
echo ""

# 3. Проверить что обновилось
echo "📋 Последний коммит:"
git log -1 --oneline
echo ""

# 4. Обновить зависимости
echo "📦 Обновление зависимостей..."
npm install --production
echo ""

# 5. Пересобрать проект
echo "🏗️ Пересборка проекта..."
npm run build
echo ""

# 6. Перезапустить PM2
echo "🔄 Перезапуск PM2..."
if pm2 list | grep -q "thesim"; then
    pm2 restart thesim
elif pm2 list | grep -q "app"; then
    pm2 restart app
else
    echo "⚠️  Приложение не найдено в PM2. Запускаю заново..."
    pm2 start npm --name "thesim" -- start
    pm2 save
fi
echo ""

# 7. Подождать немного
echo "⏳ Ожидание запуска..."
sleep 5

# 8. Проверить статус
echo "📊 Статус после перезапуска:"
pm2 status
echo ""

# 9. Проверить логи
echo "📋 Последние логи:"
pm2 logs thesim --lines 20 --nostream || pm2 logs --lines 20 --nostream
echo ""

# 10. Проверить доступность
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
echo "✅ Обновление завершено!"
echo ""
echo "📋 Полезные команды:"
echo "   pm2 logs thesim -f          # Логи в реальном времени"
echo "   pm2 monit                   # Мониторинг"
echo "   pm2 restart thesim          # Перезапуск"
echo "   pm2 stop thesim            # Остановка"

