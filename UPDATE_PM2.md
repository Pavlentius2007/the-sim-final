# 🚀 Обновление проекта через PM2

## Команды для обновления на сервере:

### 1. Обновить код из GitHub:
```bash
cd /root/the-sim-final
git pull origin main
```

### 2. Обновить зависимости (если нужно):
```bash
npm install --production
```

### 3. Пересобрать проект:
```bash
npm run build
```

### 4. Перезапустить PM2:
```bash
# Проверить статус
pm2 list

# Перезапустить приложение
pm2 restart thesim
# или если имя другое:
pm2 restart all

# Или перезапустить по ID
pm2 restart 0
```

### 5. Проверить логи:
```bash
pm2 logs thesim --lines 50
# или
pm2 logs --lines 50
```

### 6. Проверить статус:
```bash
pm2 status
pm2 info thesim
```

---

## Полная последовательность команд:

```bash
# 1. Перейти в директорию
cd /root/the-sim-final

# 2. Обновить код
git pull origin main

# 3. Обновить зависимости
npm install --production

# 4. Пересобрать
npm run build

# 5. Перезапустить PM2
pm2 restart thesim

# 6. Проверить статус
pm2 status

# 7. Проверить логи
pm2 logs thesim --lines 30
```

---

## Если PM2 не запущен или нужно настроить заново:

```bash
# Остановить текущий процесс (если есть)
pm2 stop thesim
pm2 delete thesim

# Запустить заново
cd /root/the-sim-final
npm run build
pm2 start npm --name "thesim" -- start
# или если есть ecosystem.config.js:
pm2 start ecosystem.config.js

# Сохранить конфигурацию PM2
pm2 save

# Настроить автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую выведет PM2
```

---

## Проверка работоспособности:

```bash
# Проверить что приложение работает
curl -I http://localhost:3000
curl -I https://thesim.site

# Проверить логи на ошибки
pm2 logs thesim --err --lines 50

# Мониторинг в реальном времени
pm2 monit
```

---

## Если порт 3000 занят:

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000

# Остановить PM2 процессы
pm2 stop all
pm2 delete all

# Убить процессы Node.js (если нужно)
sudo killall -9 node

# Запустить заново
pm2 start npm --name "thesim" -- start
```

---

## Важно: Обновить секреты в .env

После обновления кода обязательно обновите секреты:

```bash
nano .env

# Обновить:
# - TELEGRAM_BOT_TOKEN (если был скомпрометирован)
# - TELEGRAM_CHAT_ID
# - JWT_SECRET, ENCRYPTION_KEY, COOKIE_SECRET, CSRF_SECRET

# После обновления перезапустить:
pm2 restart thesim
```

