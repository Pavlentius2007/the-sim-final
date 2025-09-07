# 🌐 Настройка домена для TheSim

## 📋 ЧТО НУЖНО СДЕЛАТЬ:

### 1. DNS записи (в панели домена):
```
A     @           YOUR_SERVER_IP
A     www         YOUR_SERVER_IP
CNAME api         YOUR_SERVER_IP
CNAME admin       YOUR_SERVER_IP
```

### 2. SSL сертификат:
- Let's Encrypt (бесплатно)
- Или купленный сертификат

### 3. Nginx конфигурация:
- Проксирование на Next.js
- SSL редирект
- Gzip сжатие

### 4. Переменные окружения:
- Обновить ALLOWED_ORIGINS
- Добавить домен в CORS
- Настроить Telegram webhook

## 🔧 ГОТОВЫЕ КОНФИГУРАЦИИ:

### Nginx конфигурация (nginx.conf):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Compose для продакшена:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
    restart: unless-stopped
```

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. **Скажите название домена** - обновим конфигурацию
2. **Настроим DNS** - дадим точные записи
3. **Подготовим SSL** - создадим сертификаты
4. **Обновим код** - добавим домен в настройки
5. **Развернем на сервере** - запустим продакшен

## ⚡ БЫСТРЫЙ СТАРТ:

Если домен уже указывает на сервер:
1. Обновляем код с доменом
2. Коммитим и пушим
3. На сервере: `git pull && docker-compose up -d`
4. Настраиваем SSL
5. Готово! 🚀
