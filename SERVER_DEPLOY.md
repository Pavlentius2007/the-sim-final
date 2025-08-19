# 🚀 Развертывание на сервере - CosmicLanding

## ⚡ Быстрый старт (3 команды)

```bash
# 1. Клонируем проект
git clone <your-repo-url>
cd The-Sim

# 2. Настраиваем SSL
./ssl-setup.sh

# 3. Развертываем
./deploy-prod.sh
```

## 🔧 Что происходит при развертывании

1. **Docker сборка** - создается оптимизированный образ Next.js
2. **SSL настройка** - Let's Encrypt или самоподписанный сертификат
3. **Nginx запуск** - прокси + SSL + кэширование
4. **Health checks** - автоматическая проверка работоспособности

## 🌐 Результат

- **HTTP**: `http://yourdomain.com` → автоматический редирект на HTTPS
- **HTTPS**: `https://yourdomain.com` - основное приложение
- **API**: `https://yourdomain.com/api/*` - все API endpoints
- **Статика**: `https://yourdomain.com/_next/static/*` - кэширование

## 📋 Проверка готовности

```bash
# Проверяем все файлы и настройки
./check-deployment.sh
```

## 🆘 Основные команды

```bash
# Статус
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Остановка
docker-compose -f docker-compose.prod.yml down

# Обновление
git pull && docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔒 Безопасность

- Все секретные ключи уже настроены
- JWT + CSRF + шифрование включены
- SSL/TLS с современными настройками
- Health checks для мониторинга

## 📊 Мониторинг

```bash
# Проверка здоровья приложения
curl https://yourdomain.com/api/health

# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats
```

## 🎯 Следующие шаги

1. **Домен**: Настройте DNS записи на IP сервера
2. **SSL**: Замените самоподписанный на Let's Encrypt
3. **Мониторинг**: Настройте UptimeRobot или аналоги
4. **Резервное копирование**: Настройте автоматические бэкапы

## 📞 Поддержка

При проблемах:
1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f`
2. Проверьте порты: `sudo netstat -tulpn | grep :80`
3. Проверьте SSL: `openssl x509 -in ssl/cert.pem -text -noout`
4. См. `DEPLOYMENT.md` для детальных инструкций
