# 🔧 Руководство по восстановлению сервера TheSim

## Дата создания: 8 декабря 2025

---

## 📋 Текущая конфигурация сервера

### Основная информация
- **Сервер**: 94.141.162.192
- **Домен**: thesim.site, www.thesim.site
- **Путь проекта**: `/root/the-sim-final`
- **SSL**: Let's Encrypt (действителен до 2026-03-08)
- **Web-сервер**: Nginx 1.24.0
- **Node.js менеджер**: PM2
- **OS**: Ubuntu 24.04.3 LTS

---

## 🚀 Быстрое восстановление

### 1. Восстановление Nginx конфигурации

```bash
# Загрузить файл nginx.conf на сервер
scp nginx.conf root@94.141.162.192:/root/

# На сервере
sudo cp /root/nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Восстановление статических файлов

```bash
# Создать папки
sudo mkdir -p /var/www/html/videos
sudo mkdir -p /var/www/html/images

# Скопировать видео и изображения
sudo cp -r /root/the-sim-final/public/videos/* /var/www/html/videos/
sudo cp -r /root/the-sim-final/public/images/* /var/www/html/images/

# Установить права
sudo chown -R www-data:www-data /var/www/html/videos
sudo chown -R www-data:www-data /var/www/html/images
sudo chmod -R 755 /var/www/html/videos
sudo chmod -R 755 /var/www/html/images
```

### 3. Восстановление Next.js приложения

```bash
cd /root/the-sim-final

# Обновить код
git pull origin main

# Установить зависимости (если нужно)
npm install

# Собрать проект
npm run build

# Перезапустить PM2
pm2 delete thesim
pm2 start npm --name "thesim" -- start
pm2 save
pm2 startup
```

---

## 🔍 Проверка работоспособности

```bash
# 1. Проверить Nginx
sudo nginx -t
sudo systemctl status nginx

# 2. Проверить PM2
pm2 status
pm2 logs thesim --lines 20

# 3. Проверить SSL сертификат
curl -I https://thesim.site
sudo certbot certificates

# 4. Проверить видео
curl -I https://thesim.site/videos/dashboard/DEMO.mp4

# 5. Проверить доступ к сайту
curl https://thesim.site
```

---

## 📁 Структура файлов на сервере

```
/root/the-sim-final/          # Основной проект
├── .next/                    # Сборка Next.js (без standalone)
├── public/                   # Исходные статические файлы
│   ├── videos/              # Исходники видео (не используются Nginx напрямую)
│   └── images/              # Исходники изображений
├── app/                      # Next.js приложение
├── components/               # React компоненты
├── next.config.js            # Конфигурация (standalone ВЫКЛЮЧЕН!)
└── package.json

/var/www/html/                # Статические файлы для Nginx
├── videos/                   # Видео отдаются напрямую через Nginx
│   ├── dashboard/
│   │   └── DEMO.mp4
│   ├── ru/
│   ├── en/
│   ├── zh/
│   └── th/
└── images/                   # Изображения отдаются напрямую через Nginx

/etc/nginx/nginx.conf         # Конфигурация Nginx
/etc/letsencrypt/             # SSL сертификаты
```

---

## ⚙️ Важные настройки

### Next.js конфигурация

В `next.config.js` параметр `output: 'standalone'` **ЗАКОММЕНТИРОВАН**:

```javascript
module.exports = {
  //output: 'standalone',  // ОТКЛЮЧЕНО!
  // ... остальные настройки
}
```

### PM2 команды

```bash
# Запуск
pm2 start npm --name "thesim" -- start

# Остановка
pm2 stop thesim

# Перезапуск
pm2 restart thesim

# Логи
pm2 logs thesim

# Сохранить конфигурацию
pm2 save

# Автозапуск при перезагрузке
pm2 startup
```

### Nginx важные моменты

1. **user www-data;** должен быть в начале конфигурации
2. Статические файлы в `/var/www/html/` с правами `www-data:www-data`
3. Видео и изображения отдаются **НАПРЯМУЮ**, минуя Next.js
4. SSL сертификаты обновляются автоматически через Certbot

---

## 🔐 Безопасность

### Environment Variables (.env)

**ВАЖНО**: Файл `.env` на сервере содержит секретные ключи. Никогда не коммитьте его в Git!

Необходимые переменные:
```bash
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
JWT_SECRET=generate_with_openssl
ENCRYPTION_KEY=generate_with_openssl
COOKIE_SECRET=generate_with_openssl
CSRF_SECRET=generate_with_openssl
```

Генерация секретов:
```bash
openssl rand -base64 32
```

### SSL сертификаты

```bash
# Проверить срок действия
sudo certbot certificates

# Обновить принудительно
sudo certbot renew --force-renewal

# Автоматическое обновление (уже настроено)
sudo systemctl status certbot.timer
```

---

## 🐛 Типичные проблемы и решения

### 1. Видео не загружаются (404)

**Причина**: Файлы не скопированы в `/var/www/html/videos/`

**Решение**:
```bash
sudo cp -r /root/the-sim-final/public/videos/* /var/www/html/videos/
sudo chown -R www-data:www-data /var/www/html/videos
sudo chmod -R 755 /var/www/html/videos
```

### 2. Видео не загружаются (403)

**Причина**: Неправильные права доступа или Nginx работает не под `www-data`

**Решение**:
```bash
# Проверить пользователя Nginx
ps aux | grep nginx | grep worker

# Должно быть: www-data

# Если нет, добавить в nginx.conf в начало:
# user www-data;

sudo nginx -t
sudo systemctl restart nginx
```

### 3. Белая полоса внизу страницы

**Причина**: CSS проблемы с высотой body

**Решение**: Проверить что в `app/[locale]/layout.tsx` и `app/globals.css` применены изменения из последнего коммита.

### 4. PM2 процесс падает

**Причина**: Ошибки в приложении или неправильная сборка

**Решение**:
```bash
cd /root/the-sim-final
npm install
npm run build
pm2 delete thesim
pm2 start npm --name "thesim" -- start
pm2 logs thesim
```

### 5. SSL сертификат истёк

**Причина**: Не сработало автообновление Certbot

**Решение**:
```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d thesim.site -d www.thesim.site --force-renewal
sudo systemctl start nginx
```

---

## 📞 Контакты и документация

- **Git репозиторий**: https://github.com/Pavlentius2007/the-sim-final
- **Домен**: https://thesim.site
- **Документация Next.js**: https://nextjs.org/docs
- **Документация Nginx**: https://nginx.org/ru/docs/

---

## 📝 История изменений

### 8 декабря 2025
- ✅ Отключен режим `standalone` в Next.js
- ✅ Настроена прямая отдача видео через Nginx
- ✅ Скопированы статические файлы в `/var/www/html/`
- ✅ Добавлен `user www-data;` в Nginx конфигурацию
- ✅ Исправлены права доступа к файлам
- ✅ Обновлён SSL сертификат (действителен до 2026-03-08)
- ✅ Исправлена CSP политика
- ✅ Исправлена белая полоса внизу страницы

