#!/bin/bash
# 🔒 Скрипт проверки и обновления SSL сертификатов для TheSim

set -e

DOMAIN="thesim.site"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"

echo "🔍 Проверка SSL сертификатов для ${DOMAIN}..."

# Проверка существования сертификатов
if [ ! -f "${CERT_PATH}/fullchain.pem" ] || [ ! -f "${CERT_PATH}/privkey.pem" ]; then
    echo "❌ Сертификаты не найдены в ${CERT_PATH}"
    echo "📝 Запустите: sudo certbot certonly --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    exit 1
fi

# Проверка срока действия сертификата
echo "📅 Проверка срока действия сертификата..."
DAYS_UNTIL_EXPIRY=$(openssl x509 -in "${CERT_PATH}/fullchain.pem" -noout -checkend 2592000 | grep -q "will expire" && echo "expired" || echo "valid")

if [ "$DAYS_UNTIL_EXPIRY" = "expired" ]; then
    echo "⚠️  Сертификат истекает в течение 30 дней!"
    echo "🔄 Обновление сертификата..."
    sudo certbot renew --quiet
    sudo systemctl reload nginx
    echo "✅ Сертификат обновлен"
else
    EXPIRY_DATE=$(openssl x509 -in "${CERT_PATH}/fullchain.pem" -noout -enddate | cut -d= -f2)
    echo "✅ Сертификат действителен до: ${EXPIRY_DATE}"
fi

# Проверка конфигурации Nginx
echo "🔍 Проверка конфигурации Nginx..."
if sudo nginx -t 2>/dev/null; then
    echo "✅ Конфигурация Nginx корректна"
else
    echo "❌ Ошибка в конфигурации Nginx!"
    exit 1
fi

# Проверка dhparam
if [ ! -f "/etc/nginx/dhparam.pem" ]; then
    echo "⚠️  dhparam.pem не найден. Генерация..."
    sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
    sudo chmod 600 /etc/nginx/dhparam.pem
    echo "✅ dhparam.pem создан"
else
    echo "✅ dhparam.pem существует"
fi

# Проверка SSL через openssl
echo "🔍 Проверка SSL соединения..."
if echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null | grep -q "Verify return code: 0"; then
    echo "✅ SSL соединение работает корректно"
else
    echo "⚠️  Проблемы с SSL соединением"
fi

echo ""
echo "✅ Проверка завершена!"
echo "📋 Рекомендации:"
echo "   - Проверьте сертификат на SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
echo "   - Проверьте заголовки безопасности: https://securityheaders.com/?q=https://${DOMAIN}"

