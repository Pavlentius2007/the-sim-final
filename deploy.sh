#!/bin/bash

# 🚀 CosmicLanding - Скрипт развертывания
# Автоматическое развертывание на сервере

set -e

echo "🚀 Запуск развертывания CosmicLanding..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Устанавливаем..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker установлен. Перезапустите терминал и запустите скрипт снова."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Устанавливаем..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose установлен."
fi

# Создаем папки для SSL (если нужно)
echo "📁 Создаем необходимые папки..."
mkdir -p ssl
mkdir -p data

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаем пример..."
    cat > .env << EOF
# 🔐 CosmicLanding - Переменные окружения
# ⚠️ НИКОГДА не коммитьте этот файл в git!

# JWT секретный ключ (минимум 32 символа)
JWT_SECRET=your-super-secure-jwt-secret-key-here-32-chars

# Секретный ключ для шифрования (ровно 32 символа)
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Секретный ключ для cookies (ровно 32 символа)
COOKIE_SECRET=your-32-character-cookie-secret-here

# Время жизни JWT токена (в секундах)
JWT_EXPIRES_IN=3600

# Разрешенные домены для CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Режим работы
NODE_ENV=production

# CSRF секретный ключ
CSRF_SECRET=your-csrf-secret-key-here-32-chars

# Порт сервера
PORT=3000
EOF
    echo "✅ Файл .env создан. Отредактируйте его перед запуском!"
    echo "⚠️  ОБЯЗАТЕЛЬНО измените все секретные ключи!"
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down --remove-orphans

# Удаляем старые образы
echo "🧹 Очищаем старые образы..."
docker system prune -f

# Собираем и запускаем
echo "🔨 Собираем Docker образ..."
docker-compose build --no-cache

echo "🚀 Запускаем CosmicLanding..."
docker-compose up -d

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 10

# Проверяем статус
echo "🔍 Проверяем статус..."
docker-compose ps

echo "✅ CosmicLanding успешно развернут!"
echo "🌐 Приложение доступно по адресу: http://localhost:3000"
echo "🔒 Для HTTPS настройте SSL сертификаты в папке ssl/"
echo ""
echo "📋 Полезные команды:"
echo "  Просмотр логов: docker-compose logs -f"
echo "  Остановка: docker-compose down"
echo "  Перезапуск: docker-compose restart"
echo "  Обновление: ./deploy.sh"
