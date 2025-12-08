# 🔧 Исправление ошибки Nginx http2

## Проблема:
`unknown directive "http2"` - версия Nginx не поддерживает директиву `http2 on;`

## Решение:

### Исправлено в nginx.conf:
- Изменено `listen 443 ssl; http2 on;` на `listen 443 ssl http2;`
- Закомментирован `ssl_dhparam` (если файл не существует)

### На сервере выполните:

```bash
cd /root/the-sim-final

# 1. Обновить код
git pull origin main

# 2. Скопировать исправленную конфигурацию
sudo cp nginx.conf /etc/nginx/nginx.conf

# 3. Проверить конфигурацию
sudo nginx -t

# 4. Если проверка прошла успешно, перезагрузить Nginx
sudo systemctl reload nginx

# 5. Проверить статус
sudo systemctl status nginx
```

---

## Если HTTP/2 все еще не поддерживается:

Можно убрать `http2` из директивы `listen`:

```bash
# Отредактировать конфигурацию
sudo nano /etc/nginx/nginx.conf

# Изменить:
# listen 443 ssl http2;
# На:
listen 443 ssl;

# Проверить и перезагрузить
sudo nginx -t
sudo systemctl reload nginx
```

---

## Генерация dhparam (опционально, для улучшения безопасности):

```bash
# Сгенерировать dhparam
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Установить права
sudo chmod 600 /etc/nginx/dhparam.pem

# Раскомментировать строку в nginx.conf
sudo nano /etc/nginx/nginx.conf
# Найти и раскомментировать: ssl_dhparam /etc/nginx/dhparam.pem;

# Проверить и перезагрузить
sudo nginx -t
sudo systemctl reload nginx
```

