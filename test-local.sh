#!/bin/bash

echo "🚀 Локальное тестирование TheSim в Docker..."

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Удаляем старые образы
echo "🗑️  Удаляем старые образы..."
docker rmi thesim-thesim-app 2>/dev/null || true

# Создаем SSL сертификаты если их нет
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "🔐 Создаем SSL сертификаты..."
    cd ssl
    bash generate-ssl.sh
    cd ..
fi

# Собираем и запускаем
echo "🔨 Собираем Docker образ..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Запускаем приложение..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 30

# Проверяем статус
echo "🔍 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи
echo "📋 Логи приложения:"
docker-compose -f docker-compose.prod.yml logs thesim-app

echo ""
echo "✅ Тестирование завершено!"
echo "🌐 Приложение доступно по адресам:"
echo "   - HTTP:  http://localhost"
echo "   - HTTPS: https://localhost"
echo ""
echo "📝 Для просмотра логов: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Для остановки: docker-compose -f docker-compose.prod.yml down"


