#!/bin/bash

# 🔒 CosmicLanding - Настройка SSL сертификатов
# Автоматическая настройка Let's Encrypt или самоподписанных сертификатов

set -e

echo "🔒 Настройка SSL сертификатов для CosmicLanding..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Создаем папку ssl
mkdir -p ssl

echo ""
echo "Выберите тип SSL сертификата:"
echo "1) Самоподписанный сертификат (для тестирования)"
echo "2) Let's Encrypt (для продакшена)"
echo "3) Загрузить существующие сертификаты"
echo "4) Выход"
echo ""

read -p "Введите номер (1-4): " choice

case $choice in
    1)
        print_status "Создаем самоподписанный SSL сертификат..."
        
        # Запрашиваем домен
        read -p "Введите домен (например, thesim.in): " domain
        domain=${domain:-thesim.in}
        
        # Создаем самоподписанный сертификат
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=RU/ST=State/L=City/O=Organization/CN=$domain"
        
        print_success "Самоподписанный SSL сертификат создан для домена: $domain"
        print_warning "⚠️  В браузере будет предупреждение о небезопасном соединении!"
        ;;
        
    2)
        print_status "Настройка Let's Encrypt..."
        
        # Проверяем наличие certbot
        if ! command -v certbot &> /dev/null; then
            print_error "Certbot не установлен. Устанавливаем..."
            sudo apt-get update
            sudo apt-get install -y certbot
        fi
        
        read -p "Введите домен (например, thesim.in): " domain
        domain=${domain:-thesim.in}
        
        read -p "Введите email для уведомлений: " email
        email=${email:-admin@$domain}
        
        print_status "Запускаем получение сертификата Let's Encrypt..."
        sudo certbot certonly --standalone -d $domain --email $email --agree-tos --non-interactive
        
        # Копируем сертификаты
        sudo cp /etc/letsencrypt/live/$domain/fullchain.pem ssl/cert.pem
        sudo cp /etc/letsencrypt/live/$domain/privkey.pem ssl/key.pem
        
        # Устанавливаем права
        sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
        sudo chmod 600 ssl/key.pem
        sudo chmod 644 ssl/cert.pem
        
        print_success "Let's Encrypt сертификат получен и настроен!"
        print_status "Сертификат будет автоматически обновляться каждые 60 дней."
        ;;
        
    3)
        print_status "Загрузка существующих сертификатов..."
        
        read -p "Путь к файлу сертификата (.crt или .pem): " cert_path
        read -p "Путь к файлу приватного ключа (.key или .pem): " key_path
        
        if [ -f "$cert_path" ] && [ -f "$key_path" ]; then
            cp "$cert_path" ssl/cert.pem
            cp "$key_path" ssl/key.pem
            
            # Устанавливаем права
            chmod 600 ssl/key.pem
            chmod 644 ssl/cert.pem
            
            print_success "Сертификаты загружены и настроены!"
        else
            print_error "Один или оба файла не найдены!"
            exit 1
        fi
        ;;
        
    4)
        print_status "Выход..."
        exit 0
        ;;
        
    *)
        print_error "Неверный выбор!"
        exit 1
        ;;
esac

echo ""
print_success "SSL сертификаты настроены!"
echo "📁 Файлы находятся в папке ssl/:"
echo "  - cert.pem (сертификат)"
echo "  - key.pem (приватный ключ)"
echo ""
echo "🚀 Теперь можете запустить развертывание:"
echo "  ./deploy-prod.sh"
echo ""
echo "⚠️  Не забудьте добавить папку ssl/ в .gitignore!"
