#!/bin/bash

# 🔐 Настройка Let's Encrypt SSL сертификатов для TheSim (ПРОДАКШЕН)
echo "🔐 Настройка Let's Encrypt SSL сертификатов для TheSim..."

# Проверяем наличие certbot
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot не найден!"
    echo "📥 Установите certbot:"
    echo "   Ubuntu/Debian: sudo apt install certbot"
    echo "   CentOS/RHEL: sudo yum install certbot"
    echo "   или: sudo snap install --classic certbot"
    exit 1
fi

# Проверяем аргументы
if [ $# -eq 0 ]; then
    echo "📝 Использование: $0 <domain> [email]"
    echo "   Пример: $0 thesim.in admin@thesim.in"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}

echo "🌐 Домен: $DOMAIN"
echo "📧 Email: $EMAIL"

# Создаем директорию для сертификатов
mkdir -p ssl/letsencrypt

# Останавливаем Nginx если запущен
echo "🛑 Останавливаем Nginx..."
sudo systemctl stop nginx 2>/dev/null || true

# Получаем сертификат
echo "🔐 Получаем SSL сертификат от Let's Encrypt..."
sudo certbot certonly \
    --standalone \
    --preferred-challenges http \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --domains "$DOMAIN" \
    --cert-path "ssl/letsencrypt/cert.pem" \
    --key-path "ssl/letsencrypt/key.pem" \
    --fullchain-path "ssl/letsencrypt/fullchain.pem" \
    --chain-path "ssl/letsencrypt/chain.pem"

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат получен успешно!"
    
    # Копируем сертификаты в папку ssl
    echo "📁 Копируем сертификаты..."
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "ssl/cert.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "ssl/key.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/chain.pem" "ssl/chain.pem"
    
    # Устанавливаем права
    sudo chown $USER:$USER ssl/*.pem
    sudo chmod 600 ssl/key.pem
    sudo chmod 644 ssl/cert.pem ssl/chain.pem
    
    echo "🔒 Права на файлы установлены"
    
    # Создаем автообновление
    echo "🔄 Настраиваем автообновление сертификатов..."
    sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet && sudo systemctl reload nginx"; } | sudo crontab -
    
    echo ""
    echo "🎉 Let's Encrypt SSL сертификаты настроены!"
    echo ""
    echo "📁 Файлы:" 
    echo "   - ssl/cert.pem (полная цепочка сертификатов)"
    echo "   - ssl/key.pem (приватный ключ)"
    echo "   - ssl/chain.pem (промежуточные сертификаты)"
    echo ""
    echo "🔄 Автообновление настроено (каждый день в 12:00)"
    echo "🚀 Теперь можно запускать Nginx с HTTPS!"
    
else
    echo "❌ Ошибка получения SSL сертификата!"
    echo "🔍 Проверьте:"
    echo "   - Домен доступен из интернета"
    echo "   - Порты 80 и 443 открыты"
    echo "   - DNS записи настроены правильно"
    exit 1
fi


