# 🚀 TheSim - Landing Page

Современный лендинг для проекта TheSim с поддержкой мультиязычности и адаптивным дизайном.

## 📋 Возможности

- ✅ Мультиязычность (Русский, English, 中文, ไทย)
- ✅ Адаптивный дизайн для всех устройств
- ✅ SEO оптимизация
- ✅ Анимации и эффекты (Framer Motion)
- ✅ Cookie Consent
- ✅ Форма обратной связи с интеграцией Telegram
- ✅ Admin панель
- ✅ Docker ready

## 🛠️ Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стили
- **Framer Motion** - Анимации
- **Docker** - Контейнеризация

## 📦 Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Открыть http://localhost:3000
```

### 🐳 Production (Docker)

#### 1. Создайте файл `.env` с секретами:

```bash
cp env.example .env
```

#### 2. Отредактируйте `.env` файл:

```env
# 🔐 Security Secrets (ОБЯЗАТЕЛЬНО ПОМЕНЯЙТЕ!)
JWT_SECRET=your_jwt_secret_here_min_32_chars
ENCRYPTION_KEY=your_encryption_key_32_chars_exactly
COOKIE_SECRET=your_cookie_secret_here_min_32_chars
CSRF_SECRET=your_csrf_secret_here_min_32_chars

# 🌍 Allowed Origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 🔔 Telegram Bot (опционально)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

#### 3. Генерация секретов:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

#### 4. Запуск с Docker Compose:

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

#### 5. Или использование Production версии с Nginx:

```bash
# Для HTTP
docker-compose -f docker-compose.http.yml up -d

# Для HTTPS (с SSL)
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Безопасность

⚠️ **ВАЖНО**: Никогда не коммитьте файл `.env` в git!

- Все секреты должны быть в `.env` файле
- `.env` уже добавлен в `.gitignore`
- Используйте сильные, уникальные секреты для production
- `ENCRYPTION_KEY` должен быть ровно 32 символа

## 🌐 Настройка домена

1. Настройте DNS записи для вашего домена
2. Установите SSL сертификат (Let's Encrypt)
3. Настройте Nginx (см. `nginx.conf`)
4. Обновите `ALLOWED_ORIGINS` в `.env`

Подробности в файлах:
- `DNS_SETUP_THESIM_SITE.md`
- `DOMAIN_SETUP.md`
- `FIX_SSL_CERTIFICATE.md`

## 📝 Скрипты

```bash
npm run dev          # Локальная разработка
npm run build        # Production сборка
npm start            # Запуск production сборки
npm run lint         # Проверка кода
npm run init:admin   # Инициализация admin пользователя
```

## 🗂️ Структура проекта

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Мультиязычные страницы
│   ├── admin/             # Admin панель
│   └── api/               # API routes
├── components/            # React компоненты
├── hooks/                 # Custom hooks
├── lib/                   # Утилиты и типы
├── messages/              # Переводы (i18n)
├── public/                # Статические файлы
│   └── videos/           # Видео файлы (не в git)
├── utils/                 # Вспомогательные функции
├── Dockerfile            # Docker конфигурация
├── docker-compose.yml    # Docker Compose
└── next.config.js        # Next.js конфигурация
```

## 🎥 Видео файлы

Видео файлы хранятся в `public/videos/` и **не включены в git** из-за размера.

Структура:
```
public/videos/
├── en/
│   ├── sim-overview-480p.mp4
│   ├── sim-overview-720p.mp4
│   └── sim-overview-1080p.mp4
├── ru/
├── th/
└── zh/
```

Загрузите видео файлы отдельно на сервер.

## 🌍 Добавление нового языка

1. Добавьте перевод в `messages/{locale}.json`
2. Обновите `utils/languageUtils.ts`
3. Добавьте видео для языка в `public/videos/{locale}/`

## 📊 SEO

- Автоматическая генерация sitemap.xml
- Robots.txt настроен
- Structured Data (JSON-LD)
- Оптимизированные мета-теги
- Open Graph и Twitter Cards

## 🚀 Деплой на сервер

1. Клонируйте репозиторий
2. Создайте `.env` файл с секретами
3. Загрузите видео файлы в `public/videos/`
4. Запустите `docker-compose up -d`
5. Настройте Nginx для SSL
6. Проверьте работу на домене

## 📞 Поддержка

При возникновении проблем проверьте:
- Логи: `docker-compose logs -f`
- Сборку: `npm run build`
- Порты: убедитесь что 80 и 443 свободны

## 📄 Лицензия

Частный проект.

---

Made with ❤️ for TheSim













