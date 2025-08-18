# 🚀 Развертывание CosmicLanding

Подробная инструкция по развертыванию приложения на сервере.

## 📋 Требования

- Ubuntu 18.04+ или другой Linux дистрибутив
- Docker и Docker Compose
- Открытые порты 80 и 443
- Домен (для SSL сертификатов)

## 🐳 Быстрое развертывание

### 1. Клонирование и настройка

```bash
# Клонируем репозиторий
git clone <your-repo-url>
cd The-Sim

# Делаем скрипты исполняемыми
chmod +x deploy-prod.sh
chmod +x ssl-setup.sh
```

### 2. Настройка SSL сертификатов

```bash
# Запускаем настройку SSL
./ssl-setup.sh
```

Выберите один из вариантов:
- **Самоподписанный сертификат** - для тестирования
- **Let's Encrypt** - для продакшена (рекомендуется)
- **Загрузка существующих** - если у вас уже есть сертификаты

### 3. Развертывание

```bash
# Запускаем развертывание
./deploy-prod.sh
```

## 🔧 Ручная настройка

### Установка Docker

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Создание SSL сертификатов

#### Let's Encrypt (рекомендуется)

```bash
# Установка certbot
sudo apt-get update
sudo apt-get install -y certbot

# Получение сертификата
sudo certbot certonly --standalone -d yourdomain.com --email admin@yourdomain.com

# Копирование в папку проекта
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem

# Установка прав
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
sudo chmod 600 ssl/key.pem
sudo chmod 644 ssl/cert.pem
```

#### Самоподписанный сертификат

```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=RU/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### Запуск приложения

```bash
# Сборка и запуск
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f
```

## 🌐 Настройка домена

### DNS записи

Добавьте A-запись, указывающую на IP вашего сервера:

```
A    @     YOUR_SERVER_IP
A    www   YOUR_SERVER_IP
```

### Nginx конфигурация

Файл `nginx.conf` уже настроен для:
- HTTP → HTTPS редирект
- SSL/TLS с современными настройками безопасности
- Прокси к Next.js приложению
- Кэширование статических файлов

## 🔒 Безопасность

### Переменные окружения

Все секретные ключи уже настроены в `docker-compose.prod.yml`:

- `JWT_SECRET` - для JWT токенов
- `ENCRYPTION_KEY` - для шифрования данных
- `COOKIE_SECRET` - для подписи cookies
- `CSRF_SECRET` - для CSRF защиты

### Firewall

```bash
# Открываем только необходимые порты
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Мониторинг

### Логи

```bash
# Логи приложения
docker-compose -f docker-compose.prod.yml logs -f cosmiclanding

# Логи Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Статус сервисов

```bash
# Проверка здоровья
curl https://yourdomain.com/api/health

# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps
```

## 🔄 Обновление

### Обновление кода

```bash
# Остановка
docker-compose -f docker-compose.prod.yml down

# Обновление кода
git pull origin main

# Пересборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

### Обновление SSL сертификатов

```bash
# Let's Encrypt автоматически обновляется
sudo certbot renew

# Копирование обновленных сертификатов
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem

# Перезапуск Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🚨 Устранение неполадок

### Проблемы с портами

```bash
# Проверка занятых портов
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Остановка сервисов, занимающих порты
sudo systemctl stop apache2  # если используется Apache
sudo systemctl stop nginx    # если используется системный Nginx
```

### Проблемы с SSL

```bash
# Проверка SSL сертификата
openssl x509 -in ssl/cert.pem -text -noout

# Проверка приватного ключа
openssl rsa -in ssl/key.pem -check
```

### Проблемы с Docker

```bash
# Очистка Docker
docker system prune -a -f

# Перезапуск Docker
sudo systemctl restart docker
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f`
2. Убедитесь, что все порты открыты
3. Проверьте DNS настройки
4. Убедитесь, что SSL сертификаты корректны

## 🎯 Следующие шаги

После успешного развертывания:

1. Настройте мониторинг (например, UptimeRobot)
2. Настройте резервное копирование
3. Настройте автоматическое обновление SSL сертификатов
4. Настройте CDN для статических файлов
