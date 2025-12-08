#!/bin/bash
# 🔍 Скрипт проверки текущего развертывания на сервере

echo "🔍 Проверка текущего развертывания TheSim..."
echo ""

# 1. Проверить текущую директорию
echo "📁 Текущая директория:"
pwd
echo ""

# 2. Проверить какие docker-compose файлы есть
echo "📋 Доступные docker-compose файлы:"
ls -la docker-compose*.yml 2>/dev/null || echo "  Нет docker-compose файлов"
echo ""

# 3. Проверить запущенные Docker контейнеры
echo "🐳 Запущенные Docker контейнеры:"
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "  Docker не запущен или нет контейнеров"
echo ""

# 4. Проверить все контейнеры (включая остановленные)
echo "📦 Все контейнеры (включая остановленные):"
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}" | head -10
echo ""

# 5. Проверить какие процессы используют порт 3000
echo "🔌 Процессы на порту 3000:"
sudo lsof -i :3000 2>/dev/null || echo "  Порт 3000 свободен или нет доступа к lsof"
echo ""

# 6. Проверить через netstat
echo "🌐 Сетевые соединения на порту 3000:"
sudo netstat -tulpn | grep :3000 || echo "  Нет соединений на порту 3000"
echo ""

# 7. Проверить процессы Node.js
echo "📦 Процессы Node.js:"
ps aux | grep -E "node|npm|next" | grep -v grep || echo "  Нет процессов Node.js"
echo ""

# 8. Проверить PM2 (если установлен)
if command -v pm2 &> /dev/null; then
    echo "⚡ PM2 процессы:"
    pm2 list || echo "  PM2 не запущен"
else
    echo "⚡ PM2 не установлен"
fi
echo ""

# 9. Проверить systemd сервисы
echo "🔧 Systemd сервисы связанные с thesim:"
systemctl list-units --type=service | grep -i thesim || echo "  Нет systemd сервисов"
echo ""

# 10. Проверить Nginx
echo "🌐 Nginx статус:"
if command -v nginx &> /dev/null; then
    sudo systemctl status nginx --no-pager -l | head -10 || echo "  Nginx не запущен через systemd"
else
    echo "  Nginx не установлен"
fi
echo ""

# 11. Проверить какие docker-compose конфигурации используются
echo "📋 Проверка docker-compose конфигураций:"
if [ -f "docker-compose.yml" ]; then
    echo "  ✅ docker-compose.yml найден"
    echo "  Сервисы:"
    docker-compose config --services 2>/dev/null || echo "    Не удалось прочитать конфигурацию"
fi

if [ -f "docker-compose.prod.yml" ]; then
    echo "  ✅ docker-compose.prod.yml найден"
    echo "  Сервисы:"
    docker-compose -f docker-compose.prod.yml config --services 2>/dev/null || echo "    Не удалось прочитать конфигурацию"
fi

if [ -f "docker-compose.http.yml" ]; then
    echo "  ✅ docker-compose.http.yml найден"
    echo "  Сервисы:"
    docker-compose -f docker-compose.http.yml config --services 2>/dev/null || echo "    Не удалось прочитать конфигурацию"
fi
echo ""

# 12. Проверить логи последних запусков
echo "📋 Последние логи Docker:"
docker-compose logs --tail=5 2>/dev/null || echo "  Нет логов docker-compose"
echo ""

# 13. Проверить доступность сайта
echo "🌐 Проверка доступности сайта:"
curl -I https://thesim.site 2>/dev/null | head -3 || echo "  Сайт недоступен"
echo ""

echo "✅ Проверка завершена!"
echo ""
echo "💡 Рекомендации:"
echo "  1. Если контейнеры не запущены, используйте:"
echo "     docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "  2. Если порт 3000 занят, найдите процесс:"
echo "     sudo lsof -i :3000"
echo ""
echo "  3. Для просмотра логов:"
echo "     docker-compose -f docker-compose.prod.yml logs -f"

