#!/bin/bash
# 🔍 Скрипт проверки статуса приложения

echo "🔍 Проверка статуса TheSim..."
echo ""

cd /root/the-sim-final

# 1. Проверить PM2
echo "📊 Статус PM2:"
pm2 status
echo ""

# 2. Проверить логи (последние 10 строк)
echo "📋 Последние логи (без ошибок):"
pm2 logs thesim --lines 10 --nostream --err 2>/dev/null | tail -5 || echo "Нет ошибок"
echo ""

# 3. Проверить что приложение отвечает
echo "🌐 Проверка доступности:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Приложение доступно на localhost:3000"
    curl -I http://localhost:3000 2>/dev/null | head -3
else
    echo "⚠️  Приложение не отвечает на localhost:3000"
fi
echo ""

# 4. Проверить SSL сертификат
echo "🔒 Проверка SSL сертификата:"
if [ -f "/etc/letsencrypt/live/thesim.site/fullchain.pem" ]; then
    EXPIRY=$(openssl x509 -in /etc/letsencrypt/live/thesim.site/fullchain.pem -noout -enddate 2>/dev/null | cut -d= -f2)
    echo "Сертификат действителен до: $EXPIRY"
    
    # Проверить истекает ли в течение 30 дней
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -lt 30 ]; then
        echo "⚠️  Сертификат истекает через $DAYS_LEFT дней!"
        echo "Обновите: sudo certbot renew --webroot -w /var/www/html"
    else
        echo "✅ Сертификат действителен еще $DAYS_LEFT дней"
    fi
else
    echo "⚠️  Сертификат не найден"
fi
echo ""

# 5. Проверить Nginx
echo "🌐 Статус Nginx:"
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx запущен"
    sudo nginx -t 2>&1 | head -2
else
    echo "⚠️  Nginx не запущен"
fi
echo ""

# 6. Проверить порты
echo "🔌 Использование портов:"
echo "Порт 80:"
sudo lsof -i :80 2>/dev/null | head -2 || echo "  Свободен"
echo "Порт 443:"
sudo lsof -i :443 2>/dev/null | head -2 || echo "  Свободен"
echo "Порт 3000:"
sudo lsof -i :3000 2>/dev/null | head -2 || echo "  Свободен"
echo ""

echo "✅ Проверка завершена!"

