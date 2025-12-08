# 🔧 Исправление PM2 и SSL сертификата

## Проблемы:
1. PM2 запускает `next start`, но для `output: 'standalone'` нужно запускать `node .next/standalone/server.js`
2. SSL сертификат истек

## Решение:

### 1. Исправить запуск PM2:

```bash
cd /root/the-sim-final

# Остановить текущий процесс
pm2 stop thesim
pm2 delete thesim

# Запустить с правильной командой для standalone
pm2 start node --name "thesim" -- .next/standalone/server.js

# Или использовать ecosystem.config.js (если создан)
# pm2 start ecosystem.config.js

# Сохранить конфигурацию
pm2 save

# Проверить статус
pm2 status
pm2 logs thesim --lines 30
```

### 2. Обновить SSL сертификат:

```bash
# Проверить срок действия
sudo certbot certificates

# Обновить сертификаты
sudo certbot renew --force-renewal

# Перезагрузить Nginx
sudo systemctl reload nginx

# Проверить что сертификат обновлен
sudo certbot certificates
```

### 3. Проверить работоспособность:

```bash
# Проверить что приложение работает
curl -I http://localhost:3000

# Проверить сайт (после обновления SSL)
curl -I https://thesim.site

# Проверить логи PM2
pm2 logs thesim --lines 50
```

---

## Полная последовательность команд:

```bash
cd /root/the-sim-final

# 1. Исправить PM2
pm2 stop thesim
pm2 delete thesim
pm2 start node --name "thesim" -- .next/standalone/server.js
pm2 save

# 2. Обновить SSL
sudo certbot renew --force-renewal
sudo systemctl reload nginx

# 3. Проверить
pm2 status
pm2 logs thesim --lines 20
curl -I http://localhost:3000
```

---

## Если SSL не обновляется автоматически:

```bash
# Проверить логи certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Попробовать обновить вручную
sudo certbot certonly --nginx -d thesim.site -d www.thesim.site

# Проверить конфигурацию Nginx
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

