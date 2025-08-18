# 🚀 CosmicLanding - Полное развертывание

## 📋 Обзор проекта

CosmicLanding - это современное веб-приложение на Next.js с полной инфраструктурой для продакшена, включая Docker, Nginx, SSL и мониторинг.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (SSL)   │───▶│  Next.js App    │───▶│   PostgreSQL    │
│   Port 80/443   │    │  Port 3000      │    │   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Структура файлов развертывания

```
The-Sim/
├── 🐳 Docker
│   ├── Dockerfile                    # Многоэтапная сборка Next.js
│   ├── docker-compose.yml           # Локальная разработка
│   └── docker-compose.prod.yml      # Продакшен с Nginx
│
├── 🔒 SSL & Security
│   ├── ssl-setup.sh                 # Настройка SSL сертификатов
│   ├── nginx.conf                   # Nginx конфигурация
│   └── ssl/                         # SSL сертификаты
│
├── 🚀 Deployment
│   ├── deploy.sh                    # Локальное развертывание
│   ├── deploy-prod.sh               # Продакшен развертывание
│   └── check-deployment.sh          # Проверка готовности
│
├── 📚 Documentation
│   ├── QUICK_START.md               # Быстрый старт (3 шага)
│   ├── DEPLOYMENT.md                # Подробная инструкция
│   ├── SERVER_DEPLOY.md             # Краткая инструкция для сервера
│   └── README_DEPLOYMENT.md         # Этот файл
│
└── 🔧 Application
    ├── app/                         # Next.js приложение
    ├── components/                  # React компоненты
    ├── lib/                         # Утилиты и конфигурация
    └── package.json                 # Зависимости
```

## ⚡ Быстрое развертывание

### Локальная разработка
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Развертывание локально
./deploy.sh
```

### Продакшен развертывание
```bash
# 1. Клонирование
git clone <your-repo-url>
cd The-Sim

# 2. SSL настройка
./ssl-setup.sh

# 3. Развертывание
./deploy-prod.sh
```

## 🔒 Безопасность

- **JWT токены** для аутентификации
- **CSRF защита** от межсайтовых запросов
- **Шифрование** чувствительных данных
- **SSL/TLS** с современными настройками
- **Health checks** для мониторинга

## 📊 Мониторинг и логи

```bash
# Проверка здоровья
curl https://yourdomain.com/api/health

# Логи приложения
docker-compose -f docker-compose.prod.yml logs -f cosmiclanding

# Логи Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps
```

## 🌐 Домены и SSL

### Поддерживаемые домены
- `thesim.in` - основной домен
- `www.thesim.in` - www поддомен
- `localhost:3000` - локальная разработка

### SSL сертификаты
- **Let's Encrypt** (рекомендуется для продакшена)
- **Самоподписанные** (для тестирования)
- **Существующие** (загрузка ваших сертификатов)

## 🔄 Обновление и поддержка

### Обновление кода
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

### Обновление SSL
```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/yourdomain.com/* ssl/
docker-compose -f docker-compose.prod.yml restart nginx
```

### Резервное копирование
```bash
# Резервная копия данных
tar -czf backup-$(date +%Y%m%d).tar.gz data/ ssl/

# Восстановление
tar -xzf backup-YYYYMMDD.tar.gz
```

## 🚨 Устранение неполадок

### Частые проблемы

1. **Порт занят**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # или nginx
   ```

2. **SSL ошибки**
   ```bash
   openssl x509 -in ssl/cert.pem -text -noout
   openssl rsa -in ssl/key.pem -check
   ```

3. **Docker проблемы**
   ```bash
   docker system prune -a -f
   sudo systemctl restart docker
   ```

### Логи и диагностика
```bash
# Проверка готовности
./check-deployment.sh

# Детальные логи
docker-compose -f docker-compose.prod.yml logs -f

# Статус сервисов
docker-compose -f docker-compose.prod.yml ps
```

## 📚 Документация

- **QUICK_START.md** - Быстрый старт за 3 шага
- **DEPLOYMENT.md** - Подробная инструкция по развертыванию
- **SERVER_DEPLOY.md** - Краткая инструкция для сервера
- **DOCKER_README.md** - Детали Docker конфигурации

## 🎯 Следующие шаги

После успешного развертывания:

1. **Мониторинг**: Настройте UptimeRobot, Pingdom или аналоги
2. **Резервное копирование**: Автоматические бэкапы данных и SSL
3. **CDN**: Cloudflare или аналоги для статических файлов
4. **CI/CD**: GitHub Actions для автоматического развертывания
5. **Метрики**: Prometheus + Grafana для детального мониторинга

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи и статус сервисов
2. Убедитесь в корректности SSL сертификатов
3. Проверьте DNS настройки и порты
4. См. раздел "Устранение неполадок"
5. Обратитесь к документации в папке проекта

---

**🚀 Готово к развертыванию!** 

Выберите подходящий способ развертывания и следуйте инструкциям в соответствующих файлах.
