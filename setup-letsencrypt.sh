#!/bin/bash

# 🔒 Скрипт установки Let's Encrypt SSL сертификата для thesim.site

echo "🔒 Установка Let's Encrypt SSL сертификата для thesim.site"
echo "=================================================="

# Проверяем, что скрипт запущен от root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ошибка: Запустите скрипт от имени root (sudo)"
    exit 1
fi

# Останавливаем nginx для освобождения порта 80
echo "🛑 Остановка nginx..."
docker-compose -f docker-compose.prod.yml stop nginx || echo "Nginx не был запущен"

# Устанавливаем certbot если не установлен
if ! command -v certbot &> /dev/null; then
    echo "📦 Установка certbot..."
    apt update
    apt install certbot -y
else
    echo "✅ Certbot уже установлен"
fi

# Получаем сертификат
echo "🔐 Получение SSL сертификата от Let's Encrypt..."
certbot certonly --standalone \
    -d thesim.site \
    -d www.thesim.site \
    --non-interactive \
    --agree-tos \
    --email admin@thesim.site

# Проверяем, что сертификаты созданы
if [ -f "/etc/letsencrypt/live/thesim.site/fullchain.pem" ]; then
    echo "✅ SSL сертификат успешно получен!"
    ls -la /etc/letsencrypt/live/thesim.site/
else
    echo "❌ Ошибка: Не удалось получить SSL сертификат"
    echo "Проверьте:"
    echo "1. DNS записи указывают на этот сервер"
    echo "2. Порт 80 доступен из интернета"
    echo "3. Домен thesim.site резолвится"
    exit 1
fi

# Запускаем контейнеры с новой конфигурацией
echo "🚀 Запуск контейнеров с SSL..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
sleep 10

# Проверяем статус
echo "📊 Проверка статуса контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем SSL
echo "🔍 Проверка SSL сертификата..."
curl -I https://thesim.site 2>/dev/null | head -1

# Настраиваем автообновление сертификата
echo "⏰ Настройка автообновления сертификата..."
(crontab -l 2>/dev/null; echo "0 3 */60 * * certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.prod.yml restart nginx") | crontab -

echo ""
echo "🎉 Готово! SSL сертификат установлен и настроен!"
echo ""
echo "✅ Что сделано:"
echo "   - Получен официальный SSL сертификат от Let's Encrypt"
echo "   - Обновлена конфигурация Nginx"
echo "   - Настроено автообновление сертификата каждые 60 дней"
echo ""
echo "🔒 Теперь ваш сайт защищен и браузеры покажут зеленый замок!"
echo ""
echo "🔗 Проверьте: https://thesim.site"
echo "📧 SSL проверка: https://www.ssllabs.com/ssltest/analyze.html?d=thesim.site"
