#!/bin/bash
# 🚀 Скрипт автоматического обновления проекта на сервере

set -e

PROJECT_DIR="${1:-/var/www/thesim}"
BACKUP_DIR="${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)"

echo "🔍 Проверка директории проекта..."
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Директория проекта не найдена: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📦 Создание резервной копии..."
if [ -d ".git" ]; then
    # Если есть git, делаем бэкап только измененных файлов
    git stash
else
    # Если нет git, делаем полный бэкап
    cp -r "$PROJECT_DIR" "$BACKUP_DIR"
    echo "✅ Резервная копия создана: $BACKUP_DIR"
fi

echo "🔄 Получение обновлений из GitHub..."
git fetch origin

echo "📥 Применение обновлений..."
git pull origin main

echo "📦 Обновление зависимостей..."
if [ -f "package.json" ]; then
    npm install --production
fi

echo "🏗️ Пересборка проекта..."
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    npm run build
fi

echo "🔄 Перезапуск приложения..."
if [ -f "docker-compose.yml" ]; then
    docker-compose restart
elif command -v pm2 &> /dev/null; then
    pm2 restart thesim || echo "⚠️ PM2 не запущен"
elif systemctl is-active --quiet thesim; then
    sudo systemctl restart thesim
else
    echo "⚠️ Не найден способ перезапуска приложения"
fi

echo "✅ Обновление завершено!"
echo "📋 Проверьте логи:"
echo "   docker-compose logs -f"
echo "   или"
echo "   pm2 logs thesim"

