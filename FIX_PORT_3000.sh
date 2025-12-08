#!/bin/bash
# 🔧 Скрипт для освобождения порта 3000

echo "🔍 Поиск процессов на порту 3000..."

# Проверить через lsof
if command -v lsof &> /dev/null; then
    echo "Проверка через lsof:"
    sudo lsof -i :3000
    PIDS=$(sudo lsof -ti :3000)
    if [ ! -z "$PIDS" ]; then
        echo "Найдены процессы: $PIDS"
        read -p "Остановить эти процессы? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$PIDS" | xargs sudo kill -9
            sleep 2
        fi
    fi
fi

# Проверить через netstat
if command -v netstat &> /dev/null; then
    echo "Проверка через netstat:"
    sudo netstat -tulpn | grep :3000
fi

# Проверить через ss
if command -v ss &> /dev/null; then
    echo "Проверка через ss:"
    sudo ss -tulpn | grep :3000
fi

# Проверить Docker контейнеры
echo "Проверка Docker контейнеров на порту 3000:"
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}" | grep 3000 || echo "Нет контейнеров на порту 3000"

# Проверить все Docker контейнеры
echo "Все запущенные контейнеры:"
docker ps -a

echo ""
echo "Если порт все еще занят, попробуйте:"
echo "  sudo fuser -k 3000/tcp"
echo "  или"
echo "  sudo killall -9 node"
echo "  sudo killall -9 npm"

