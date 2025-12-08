# 🚀 Руководство по развертыванию TheSim на сервере

## ⚠️ КРИТИЧЕСКИ ВАЖНО - Безопасность секретов!

**Перед деплоем обязательно создайте .env файл с уникальными секретами!**

## 📋 Чек-лист перед деплоем

- [ ] Создан файл `.env` с секретами
- [ ] Все секреты изменены на уникальные значения
- [ ] Загружены видео файлы на сервер
- [ ] Настроены DNS записи для домена
- [ ] Установлен SSL сертификат (для HTTPS)
- [ ] Настроен Nginx
- [ ] Проверена работа сборки (`npm run build`)

---

## 🔒 Шаг 1: Создание .env файла

### 1.1 Скопируйте пример:

```bash
cp env.example .env
```

### 1.2 Сгенерируйте секреты:

**Linux/Mac/WSL:**
```bash
# Генерируем 4 разных секрета
echo "JWT_SECRET=$(openssl rand -base64 48)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 24 | head -c 32)"
echo "COOKIE_SECRET=$(openssl rand -base64 48)"
echo "CSRF_SECRET=$(openssl rand -base64 48)"
```

**Windows PowerShell:**
```powershell
# JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | % {[char]$_})

# ENCRYPTION_KEY (точно 32 символа!)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# COOKIE_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | % {[char]$_})

# CSRF_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | % {[char]$_})
```

### 1.3 Отредактируйте .env файл:

```env
# 🔐 Security Secrets (ОБЯЗАТЕЛЬНО ПОМЕНЯЙТЕ!)
JWT_SECRET=ваш_сгенерированный_jwt_secret
ENCRYPTION_KEY=ровно_32_символа_для_encryption
COOKIE_SECRET=ваш_сгенерированный_cookie_secret
CSRF_SECRET=ваш_сгенерированный_csrf_secret

# 🌍 Allowed Origins (ваш домен)
ALLOWED_ORIGINS=https://thesim.site,https://www.thesim.site

# 🔔 Telegram Bot (опционально, для уведомлений о лидах)
TELEGRAM_BOT_TOKEN=получите_от_@BotFather
TELEGRAM_CHAT_ID=ваш_telegram_chat_id

# 🏭 Production Settings
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

### 1.4 Проверьте безопасность:

```bash
# .env НЕ должен быть в git
git status .env
# Должно быть: "Untracked files" или отсутствовать

# Убедитесь что .env в .gitignore
grep "\.env" .gitignore
```

---

## 📦 Шаг 2: Подготовка видео файлов

Видео файлы **НЕ в git** из-за большого размера. Загрузите их на сервер:

```bash
# Структура видео файлов:
public/videos/
├── en/
│   ├── sim-overview-480p.mp4
│   ├── sim-overview-720p.mp4
│   └── sim-overview-1080p.mp4
├── ru/
│   ├── sim-overview-480p.mp4
│   ├── sim-overview-720p.mp4
│   └── sim-overview-1080p.mp4
├── th/
│   └── ... (аналогично)
└── zh/
    └── ... (аналогично)
```

**Загрузка на сервер:**

```bash
# Через SCP
scp -r public/videos/* user@server:/path/to/project/public/videos/

# Или через rsync
rsync -avz --progress public/videos/ user@server:/path/to/project/public/videos/
```

---

## 🐳 Шаг 3: Docker Deployment

### Вариант A: Простой запуск (без SSL)

```bash
# 1. Клонируйте репозиторий
git clone <repository-url>
cd the-sim

# 2. Создайте .env файл (см. Шаг 1)
cp env.example .env
nano .env  # или vim, или любой редактор

# 3. Загрузите видео файлы (см. Шаг 2)

# 4. Запуск
docker-compose up -d

# 5. Проверка
docker-compose logs -f
```

Сайт доступен на `http://server-ip:3000`

### Вариант B: Production с Nginx + SSL

```bash
# 1. Подготовка (см. Вариант A, шаги 1-3)

# 2. Получите SSL сертификат
sudo apt-get install certbot
sudo certbot certonly --standalone -d thesim.site -d www.thesim.site

# 3. Обновите nginx.conf с правильными путями к сертификатам

# 4. Запуск с Nginx
docker-compose -f docker-compose.prod.yml up -d

# 5. Проверка
docker-compose -f docker-compose.prod.yml logs -f
```

Сайт доступен на:
- `http://thesim.site` (редирект на HTTPS)
- `https://thesim.site` (основной)

---

## 🔍 Шаг 4: Проверка работы

### 4.1 Проверьте логи:

```bash
docker-compose logs -f app
```

### 4.2 Проверьте доступность:

```bash
curl http://localhost:3000
# Должен вернуть HTML страницу
```

### 4.3 Проверьте API:

```bash
# Telegram API (если настроен)
curl -X POST http://localhost:3000/api/telegram/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Test"}'
```

### 4.4 Проверьте SSL (если настроен):

```bash
curl -I https://thesim.site
# Должен вернуть 200 OK
```

---

## 🔄 Обновление на сервере

```bash
# 1. Остановите контейнеры
docker-compose down

# 2. Обновите код
git pull origin main

# 3. Пересоберите (если нужно)
docker-compose build --no-cache

# 4. Запустите заново
docker-compose up -d

# 5. Проверьте
docker-compose logs -f
```

---

## 🛠️ Troubleshooting

### Проблема: Ошибка "Missing required environment variables"

**Решение:**
```bash
# Проверьте что .env файл существует
ls -la .env

# Проверьте содержимое
cat .env

# Убедитесь что все переменные заполнены
```

### Проблема: 502 Bad Gateway

**Решение:**
```bash
# Проверьте что приложение запущено
docker-compose ps

# Проверьте логи
docker-compose logs app

# Перезапустите
docker-compose restart app
```

### Проблема: Видео не загружаются

**Решение:**
```bash
# Проверьте наличие видео файлов
ls -R public/videos/

# Проверьте права доступа
chmod -R 755 public/videos/
```

### Проблема: SSL сертификат не работает

**Решение:**
```bash
# Проверьте сертификаты
sudo certbot certificates

# Обновите сертификаты
sudo certbot renew

# Перезапустите Nginx
docker-compose restart nginx
```

---

## 📊 Мониторинг

### Просмотр логов:

```bash
# Все сервисы
docker-compose logs -f

# Только приложение
docker-compose logs -f app

# Только Nginx
docker-compose logs -f nginx

# Последние 100 строк
docker-compose logs --tail=100 app
```

### Использование ресурсов:

```bash
docker stats
```

### Проверка здоровья:

```bash
docker-compose ps
```

---

## 🔐 Безопасность после деплоя

- [ ] `.env` файл имеет права доступа 600 (`chmod 600 .env`)
- [ ] Все секреты уникальны и не совпадают с примерами
- [ ] SSL сертификаты настроены и валидны
- [ ] Firewall настроен (только 80, 443 порты открыты)
- [ ] Настроен автоматический бэкап
- [ ] Настроен мониторинг (логи, uptime)

---

## 📞 Полезные команды

```bash
# Перезапуск
docker-compose restart

# Остановка
docker-compose stop

# Полная остановка и удаление
docker-compose down

# Просмотр запущенных контейнеров
docker ps

# Вход в контейнер
docker exec -it cosmiclanding-app sh

# Очистка неиспользуемых образов
docker system prune -a
```

---

## ✅ Готово!

Ваш сайт TheSim развернут и работает! 🎉

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте .env файл
3. Проверьте что видео файлы на месте
4. Проверьте SSL сертификаты (если используете HTTPS)

---

**Важно:** Регулярно обновляйте зависимости и SSL сертификаты!













