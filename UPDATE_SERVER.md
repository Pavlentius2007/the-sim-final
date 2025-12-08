# 🚀 Команды для обновления проекта на сервере

## 📋 Шаг 1: Локально (на вашем компьютере)

### 1.1 Добавить все изменения в git:
```bash
git add -A
```

### 1.2 Закоммитить изменения:
```bash
git commit -m "security: исправлены утечки данных и улучшена безопасность

- Удален хардкоженный Telegram Chat ID из кода
- Удалена ссылка на thesim.in из PersonalCabinetButton
- Добавлены заголовки безопасности (HSTS, XSS Protection, Referrer-Policy)
- Улучшена CSP политика (убраны unsafe-inline и unsafe-eval)
- Добавлена валидация и защита от CSRF/XSS в API endpoints
- Улучшена SSL конфигурация в nginx.conf
- Добавлены скрипты проверки SSL сертификатов
- Создана документация по безопасности"
```

### 1.3 Отправить изменения в GitHub:
```bash
git push origin main
```

---

## 🖥️ Шаг 2: На сервере (SSH подключение)

### 2.1 Подключиться к серверу:
```bash
ssh user@your-server-ip
# или
ssh user@thesim.site
```

### 2.2 Перейти в директорию проекта:
```bash
cd /path/to/thesim-project
# Например: cd /var/www/thesim или cd ~/thesim
```

### 2.3 Сохранить текущие изменения (если есть):
```bash
# Проверить статус
git status

# Если есть локальные изменения, сохранить их
git stash
```

### 2.4 Получить последние изменения из GitHub:
```bash
git fetch origin
git pull origin main
```

### 2.5 Обновить зависимости (если нужно):
```bash
npm install
# или если используете Docker:
docker-compose exec app npm install
```

### 2.6 Пересобрать проект (если нужно):
```bash
npm run build
# или для Docker:
docker-compose exec app npm run build
```

### 2.7 Перезапустить приложение:

**Если используете Docker:**
```bash
docker-compose restart
# или полный перезапуск:
docker-compose down
docker-compose up -d
```

**Если используете PM2 или systemd:**
```bash
# PM2
pm2 restart thesim

# systemd
sudo systemctl restart thesim
```

### 2.8 Проверить логи (убедиться что все работает):
```bash
# Docker
docker-compose logs -f --tail=100

# PM2
pm2 logs thesim

# systemd
sudo journalctl -u thesim -f
```

---

## 🔒 Шаг 3: Обновить SSL сертификаты (если нужно)

### 3.1 Проверить срок действия сертификатов:
```bash
sudo certbot certificates
```

### 3.2 Обновить сертификаты (если истекают):
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### 3.3 Сгенерировать dhparam (если еще не создан):
```bash
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
sudo chmod 600 /etc/nginx/dhparam.pem
sudo systemctl reload nginx
```

---

## ✅ Шаг 4: Проверка работоспособности

### 4.1 Проверить сайт:
```bash
curl -I https://thesim.site
```

### 4.2 Проверить API endpoints:
```bash
# Проверить что API работает
curl -X POST https://thesim.site/api/leads \
  -H "Content-Type: application/json" \
  -H "Origin: https://thesim.site" \
  -d '{"name":"test","email":"test@test.com"}'
```

### 4.3 Проверить SSL:
```bash
# Использовать созданный скрипт
bash check-ssl.sh
```

---

## 🛠️ Быстрая команда (все в одном):

Если у вас настроен SSH и путь к проекту, можно выполнить одной командой:

```bash
ssh user@server "cd /path/to/project && git pull origin main && docker-compose restart"
```

---

## ⚠️ ВАЖНО: Обновить секреты на сервере!

После обновления кода **обязательно** обновите секреты в `.env` файле на сервере:

```bash
# На сервере
cd /path/to/project
nano .env

# Обновите:
# - TELEGRAM_BOT_TOKEN (если был скомпрометирован)
# - TELEGRAM_CHAT_ID
# - JWT_SECRET
# - ENCRYPTION_KEY
# - COOKIE_SECRET
# - CSRF_SECRET

# После обновления перезапустите:
docker-compose restart
```

---

## 📝 Примечания:

1. **Резервная копия**: Перед обновлением рекомендуется сделать бэкап:
   ```bash
   cp -r /path/to/project /path/to/project.backup
   ```

2. **Проверка изменений**: Перед pull можно посмотреть что изменится:
   ```bash
   git fetch origin
   git diff HEAD origin/main
   ```

3. **Откат изменений**: Если что-то пошло не так:
   ```bash
   git reset --hard HEAD~1  # Откатить последний коммит
   # или
   git reset --hard origin/main  # Вернуться к версии из GitHub
   ```

---

**Дата создания**: 2025-11-06

