#!/bin/bash
# 🔒 Скрипт обновления SSL сертификата

set -e

echo "🔒 Обновление SSL сертификата для thesim.site..."
echo ""

# Проверить что мы root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт с sudo"
    exit 1
fi

# Метод 1: Попробовать через Nginx plugin
echo "📋 Попытка обновления через Nginx plugin..."
if certbot certonly --nginx -d thesim.site -d www.thesim.site --force-renewal --non-interactive --agree-tos --email admin@thesim.site 2>/dev/null; then
    echo "✅ Сертификат обновлен через Nginx plugin"
    sudo systemctl reload nginx
    exit 0
fi

# Метод 2: Если Nginx plugin не работает, использовать standalone
echo "📋 Попытка обновления через standalone режим..."
echo "⚠️  Nginx будет временно остановлен"

sudo systemctl stop nginx

if certbot certonly --standalone -d thesim.site -d www.thesim.site --force-renewal --non-interactive --agree-tos --email admin@thesim.site; then
    echo "✅ Сертификат обновлен через standalone режим"
    sudo systemctl start nginx
    sudo systemctl reload nginx
    exit 0
else
    echo "❌ Не удалось обновить сертификат"
    sudo systemctl start nginx
    exit 1
fi

