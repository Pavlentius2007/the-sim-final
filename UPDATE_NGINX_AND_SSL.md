# 🔧 Обновление Nginx конфигурации и SSL

## Проблемы:
1. Nginx не настроен для обслуживания `.well-known/acme-challenge/`
2. `proxy_pass` указывает на `app:3000` (Docker), но приложение запущено через PM2 на `localhost:3000`

## Решение:

### 1. Обновить Nginx конфигурацию на сервере:

```bash
cd /root/the-sim-final

# Обновить код (чтобы получить исправленную nginx.conf)
git pull origin main

# Скопировать конфигурацию в место где Nginx её читает
# Обычно это /etc/nginx/nginx.conf или /etc/nginx/sites-available/
sudo cp nginx.conf /etc/nginx/nginx.conf
# или если используется sites-available:
# sudo cp nginx.conf /etc/nginx/sites-available/thesim.site
# sudo ln -sf /etc/nginx/sites-available/thesim.site /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

### 2. Обновить SSL сертификат:

```bash
# Теперь webroot должен работать
sudo certbot certonly --webroot -w /var/www/html -d thesim.site -d www.thesim.site --force-renewal

# Или через nginx plugin
sudo certbot certonly --nginx -d thesim.site -d www.thesim.site --force-renewal

# Перезагрузить Nginx
sudo systemctl reload nginx
```

### 3. Проверить:

```bash
# Проверить сертификат
sudo certbot certificates

# Проверить сайт
curl -I https://thesim.site

# Проверить что приложение работает
curl -I http://localhost:3000
```

---

## Если /var/www/html не существует:

```bash
# Создать директорию
sudo mkdir -p /var/www/html

# Установить права
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Затем обновить SSL
sudo certbot certonly --webroot -w /var/www/html -d thesim.site -d www.thesim.site --force-renewal
```

---

## Альтернатива: Использовать standalone режим

Если webroot не работает:

```bash
# Остановить Nginx
sudo systemctl stop nginx

# Обновить сертификат
sudo certbot certonly --standalone -d thesim.site -d www.thesim.site --force-renewal

# Запустить Nginx
sudo systemctl start nginx
sudo systemctl reload nginx
```

