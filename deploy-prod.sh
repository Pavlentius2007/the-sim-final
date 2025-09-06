#!/bin/bash

# 🚀 TheSim - Скрипт развертывания для продакшена
# Автоматическое развертывание с Nginx и SSL

set -e

echo "🚀 Запуск развертывания TheSim в продакшене..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для цветного вывода
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker не установлен. Устанавливаем..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    print_success "Docker установлен. Перезапустите терминал и запустите скрипт снова."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose не установлен. Устанавливаем..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose установлен."
fi

# Создаем необходимые папки
print_status "Создаем необходимые папки..."
mkdir -p ssl
mkdir -p data
mkdir -p logs

# Проверяем SSL сертификаты
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    print_warning "SSL сертификаты не найдены. Создаем самоподписанные для тестирования..."
    
    # Создаем самоподписанный сертификат
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=RU/ST=State/L=City/O=Organization/CN=thesim.in"
    
    print_success "Самоподписанный SSL сертификат создан."
    print_warning "Для продакшена замените на настоящий сертификат!"
fi

# Останавливаем существующие контейнеры
print_status "Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

# Удаляем старые образы
print_status "Очищаем старые образы..."
docker system prune -f

# Собираем и запускаем
print_status "Собираем Docker образ..."
docker-compose -f docker-compose.prod.yml build --no-cache

print_status "Запускаем TheSim в продакшене..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
print_status "Ждем запуска приложения..."
sleep 15

# Проверяем статус
print_status "Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем здоровье сервисов
print_status "Проверяем здоровье сервисов..."
if docker-compose -f docker-compose.prod.yml exec -T thesim-app curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    print_success "Приложение запущено и отвечает!"
else
    print_warning "Приложение может еще запускаться. Проверьте логи: docker-compose -f docker-compose.prod.yml logs -f"
fi

# Проверяем nginx
if docker-compose -f docker-compose.prod.yml exec -T thesim-nginx nginx -t >/dev/null 2>&1; then
    print_success "Nginx настроен корректно!"
else
    print_error "Проблема с конфигурацией Nginx!"
fi

print_success "TheSim успешно развернут в продакшене!"
echo ""
echo "🌐 Приложение доступно по адресам:"
echo "  HTTP:  http://localhost"
echo "  HTTPS: https://localhost"
echo ""
echo "📋 Полезные команды:"
echo "  Просмотр логов: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Логи приложения: docker-compose -f docker-compose.prod.yml logs -f app"
echo "  Логи nginx: docker-compose -f docker-compose.prod.yml logs -f nginx"
echo "  Остановка: docker-compose -f docker-compose.prod.yml down"
echo "  Перезапуск: docker-compose -f docker-compose.prod.yml restart"
echo "  Обновление: ./deploy-prod.sh"
echo ""
echo "🔒 SSL сертификаты находятся в папке ssl/"
echo "⚠️  Для продакшена замените самоподписанные сертификаты на настоящие!"
