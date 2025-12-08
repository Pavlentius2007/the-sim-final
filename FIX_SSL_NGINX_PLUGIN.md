# 🔒 Исправление SSL через Nginx plugin

## Проблема:
Webroot метод не работает, потому что Nginx не настроен для обслуживания `.well-known/acme-challenge/`.

## Решение: Использовать Nginx plugin

### 1. Обновить сертификат через Nginx plugin:

```bash
# Остановить Nginx временно (certbot запустит его сам для верификации)
sudo systemctl stop nginx

# Обновить сертификат через nginx plugin
sudo certbot certonly --nginx -d thesim.site -d www.thesim.site --force-renewal

# Запустить Nginx обратно
sudo systemctl start nginx
sudo systemctl reload nginx
```

### 2. Или настроить Nginx для webroot вручную:

Добавить в конфигурацию Nginx блок для `.well-known`:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/html;
    allow all;
}
```

Затем использовать webroot метод.

---

## Рекомендуемый способ (Nginx plugin):

```bash
# 1. Остановить Nginx
sudo systemctl stop nginx

# 2. Обновить сертификат
sudo certbot certonly --nginx -d thesim.site -d www.thesim.site --force-renewal

# 3. Запустить Nginx
sudo systemctl start nginx

# 4. Проверить
sudo certbot certificates
curl -I https://thesim.site
```

---

## Если Nginx plugin не работает:

### Вариант A: Настроить webroot в Nginx

```bash
# Отредактировать конфигурацию Nginx
sudo nano /etc/nginx/sites-available/thesim.site
# или
sudo nano /etc/nginx/nginx.conf

# Добавить блок:
location /.well-known/acme-challenge/ {
    root /var/www/html;
    allow all;
}

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx

# Затем обновить сертификат
sudo certbot certonly --webroot -w /var/www/html -d thesim.site -d www.thesim.site --force-renewal
```

### Вариант B: Использовать standalone режим (требует остановки Nginx)

```bash
# Остановить Nginx
sudo systemctl stop nginx

# Обновить сертификат в standalone режиме
sudo certbot certonly --standalone -d thesim.site -d www.thesim.site --force-renewal

# Запустить Nginx
sudo systemctl start nginx
sudo systemctl reload nginx
```

---

## Проверка после обновления:

```bash
# Проверить сертификат
sudo certbot certificates

# Проверить срок действия
openssl x509 -in /etc/letsencrypt/live/thesim.site/fullchain.pem -noout -dates

# Проверить сайт
curl -I https://thesim.site
```

