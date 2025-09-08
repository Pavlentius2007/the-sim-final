# 🔒 Исправление SSL сертификата для thesim.site

## Проблема:
Браузер показывает "Не защищено" потому что используется самоподписанный сертификат, которому браузеры не доверяют.

## Решение: Установить Let's Encrypt сертификат

### 1. Подключиться к серверу:
```bash
ssh root@your_server_ip
```

### 2. Перейти в директорию проекта:
```bash
cd /root/the-sim-final
```

### 3. Остановить Nginx (чтобы освободить порт 80):
```bash
docker-compose -f docker-compose.prod.yml stop nginx
```

### 4. Установить certbot (если не установлен):
```bash
apt update
apt install certbot -y
```

### 5. Получить SSL сертификат от Let's Encrypt:
```bash
certbot certonly --standalone -d thesim.site -d www.thesim.site
```

При запросе введите:
- Email для уведомлений
- Согласитесь с условиями (Y)
- Согласитесь на рассылку (Y или N)

### 6. Проверить, что сертификаты созданы:
```bash
ls -la /etc/letsencrypt/live/thesim.site/
```

Должны быть файлы:
- `fullchain.pem` (сертификат)
- `privkey.pem` (приватный ключ)

### 7. Обновить Nginx конфигурацию:
```bash
nano nginx.conf
```

Найти SSL строки и заменить на:
```nginx
ssl_certificate /etc/letsencrypt/live/thesim.site/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/thesim.site/privkey.pem;
```

### 8. Обновить docker-compose.prod.yml:
```bash
nano docker-compose.prod.yml
```

В секции nginx добавить volume для сертификатов:
```yaml
nginx:
  # ... остальные настройки ...
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Добавить эту строку
```

### 9. Запустить контейнеры:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 10. Проверить статус:
```bash
docker-compose -f docker-compose.prod.yml ps
curl -I https://thesim.site
```

### 11. Настроить автообновление сертификата:
```bash
crontab -e
```

Добавить строку (обновление каждые 60 дней в 3 утра):
```bash
0 3 */60 * * certbot renew --quiet && docker-compose -f /root/the-sim-final/docker-compose.prod.yml restart nginx
```

## Альтернативный способ (если домен еще не делегирован):

Если DNS записи еще не настроены, можно временно использовать HTTP validation:

1. Остановить nginx
2. Запустить временный веб-сервер certbot
3. Получить сертификат
4. Перезапустить nginx с новыми сертификатами

## Проверка результата:

После установки сертификата:
- ✅ Браузер покажет 🔒 (зеленый замок)
- ✅ Исчезнет предупреждение "Не защищено"
- ✅ SSL рейтинг A/A+ на ssllabs.com

## Важно:

1. **DNS должен быть настроен** - A записи должны указывать на IP сервера
2. **Порт 80 должен быть доступен** для HTTP validation
3. **Сертификат обновляется автоматически** каждые 60-90 дней

## Если возникли проблемы:

```bash
# Проверить логи certbot
journalctl -u certbot

# Проверить конфигурацию nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Проверить логи nginx
docker-compose -f docker-compose.prod.yml logs nginx
```
