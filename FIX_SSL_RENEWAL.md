# 🔒 Исправление обновления SSL сертификата

## Проблема:
Certbot не может обновить сертификат, потому что порт 80 занят Nginx.

## Решение:

### Вариант 1: Использовать webroot метод (рекомендуется)

```bash
# Обновить сертификат используя webroot (не требует остановки Nginx)
sudo certbot renew --webroot -w /var/www/html

# Или для конкретного домена
sudo certbot certonly --webroot -w /var/www/html -d thesim.site -d www.thesim.site --force-renewal
```

### Вариант 2: Временно остановить Nginx

```bash
# Остановить Nginx
sudo systemctl stop nginx

# Обновить сертификат
sudo certbot renew --force-renewal

# Запустить Nginx обратно
sudo systemctl start nginx
sudo systemctl reload nginx
```

### Вариант 3: Использовать nginx plugin (если настроен)

```bash
sudo certbot renew --nginx --force-renewal
```

---

## Проверка после обновления:

```bash
# Проверить срок действия сертификата
sudo certbot certificates

# Проверить что сертификат обновлен
openssl x509 -in /etc/letsencrypt/live/thesim.site/fullchain.pem -noout -dates

# Перезагрузить Nginx
sudo systemctl reload nginx

# Проверить сайт
curl -I https://thesim.site
```

---

## Настройка автоматического обновления:

```bash
# Проверить cron задачу
sudo crontab -l | grep certbot

# Если нет, добавить (certbot обычно добавляет автоматически)
# Проверить что есть задача на обновление
sudo cat /etc/cron.d/certbot
```

