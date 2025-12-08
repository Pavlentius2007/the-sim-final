# 🔧 Исправление запуска PM2 для standalone режима

## Проблема:
Next.js настроен на `output: 'standalone'`, но PM2 запускает `next start`, который не работает с standalone режимом.

## Решение:

### 1. Остановить текущий процесс PM2:
```bash
pm2 stop thesim
pm2 delete thesim
```

### 2. Запустить с правильной командой для standalone:
```bash
cd /root/the-sim-final
pm2 start node --name "thesim" -- .next/standalone/server.js
pm2 save
```

### 3. Или создать ecosystem.config.js для PM2:
```bash
cd /root/the-sim-final
nano ecosystem.config.js
```

Содержимое файла:
```javascript
module.exports = {
  apps: [{
    name: 'thesim',
    script: '.next/standalone/server.js',
    cwd: '/root/the-sim-final',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
```

Затем запустить:
```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Обновление SSL сертификата:

```bash
# Проверить срок действия
sudo certbot certificates

# Обновить сертификаты
sudo certbot renew

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## Полная последовательность команд:

```bash
cd /root/the-sim-final

# 1. Остановить старый процесс
pm2 stop thesim
pm2 delete thesim

# 2. Запустить с правильной командой
pm2 start node --name "thesim" -- .next/standalone/server.js

# 3. Сохранить конфигурацию
pm2 save

# 4. Проверить статус
pm2 status
pm2 logs thesim --lines 30

# 5. Обновить SSL
sudo certbot renew
sudo systemctl reload nginx

# 6. Проверить сайт
curl -I https://thesim.site --insecure  # временно для проверки
```

