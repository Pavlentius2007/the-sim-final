#!/bin/bash

# Генерация SSL сертификатов для локального тестирования
# ВНИМАНИЕ: Только для разработки, НЕ для продакшена!

echo "🔐 Генерация SSL сертификатов для локального тестирования..."

# Создаем приватный ключ
openssl genrsa -out key.pem 2048

# Создаем самоподписанный сертификат
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -subj "/C=RU/ST=Moscow/L=Moscow/O=TheSim/OU=Development/CN=localhost"

echo "✅ SSL сертификаты созданы:"
echo "   - key.pem (приватный ключ)"
echo "   - cert.pem (сертификат)"
echo ""
echo "⚠️  ВНИМАНИЕ: Эти сертификаты только для локального тестирования!"
echo "   Для продакшена используйте настоящие SSL сертификаты (Let's Encrypt)"


