# 📦 Руководство по передаче проекта

## Текущая ситуация

**Размер проекта**: 3.08 GB  
**Проблема**: `.git/` занимает 2.67 GB из-за больших файлов в истории

---

## ✅ Рекомендуемый способ передачи

### Вариант 1: Передача через GitHub (РЕКОМЕНДУЕТСЯ)

Получатель просто клонирует репозиторий:

```bash
git clone https://github.com/Pavlentius2007/the-sim-final.git
cd the-sim-final
npm install
npm run build
```

**Преимущества**:
- ✅ Получатель скачает только код (без `node_modules` и `.next`)
- ✅ Сохранится вся история изменений
- ✅ Легко обновлять код через `git pull`

**Недостаток**:
- ❌ `.git` всё равно будет большой (2.67 GB)

---

### Вариант 2: Чистая передача (без истории Git)

Если размер критичен, создайте чистую копию:

```powershell
# В папке проекта
# Создать архив без ненужных файлов
Compress-Archive -Path app,components,messages,lib,utils,types,hooks,data,ssl,public,*.js,*.ts,*.json,*.md,.env.example,.gitignore -DestinationPath the-sim-clean.zip

# Размер будет ~5-10 MB вместо 3 GB!
```

Получатель должен:
```bash
# Распаковать архив
# Перейти в папку
npm install       # Установит node_modules (~344 MB)
npm run build     # Создаст .next (~139 MB)
git init          # Инициализировать новый Git (если нужно)
```

---

### Вариант 3: Уменьшить размер .git (очистить историю)

**⚠️ ВНИМАНИЕ**: Это удалит историю больших файлов и изменит все commit hash!

```powershell
# Установить BFG Repo-Cleaner
# https://rpo.github.io/bfg-repo-cleaner/

# Удалить файлы больше 10MB из истории
java -jar bfg.jar --strip-blobs-bigger-than 10M .

# ИЛИ удалить конкретные файлы/папки
java -jar bfg.jar --delete-folders videos .
java -jar bfg.jar --delete-folders dashboard .

# Очистить
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Принудительно загрузить в GitHub
git push origin main --force
```

**После этого `.git` уменьшится до ~50-100 MB**

---

## 📋 Что НЕ нужно передавать

Эти папки/файлы НЕ передаются (они в `.gitignore`):

- ❌ `node_modules/` - установятся через `npm install`
- ❌ `.next/` - создастся через `npm run build`
- ❌ `.env` - содержит секретные ключи (передать отдельно!)
- ❌ `.git/` - если не нужна история

---

## 🔐 Важно передать отдельно

### 1. Файл `.env` (СЕКРЕТНО!)

**НЕ КОММИТЬТЕ** `.env` в Git! Передайте получателю отдельно:

```env
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id
JWT_SECRET=сгенерировать_новый
ENCRYPTION_KEY=сгенерировать_новый
COOKIE_SECRET=сгенерировать_новый
CSRF_SECRET=сгенерировать_новый
```

Генерация секретов:
```bash
openssl rand -base64 32
```

### 2. Конфигурация сервера

- `nginx.conf` - конфигурация Nginx ✅ (уже в репозитории)
- `SERVER_RECOVERY_GUIDE.md` - руководство по развёртыванию ✅ (уже в репозитории)
- SSL сертификаты - НЕ передаются (получатель создаст свои)

### 3. Доступы

Передайте получателю:
- GitHub repository URL
- Доступ к серверу (SSH ключ, IP, пароль)
- Telegram Bot Token и Chat ID
- Данные для домена (если нужно)

---

## 📦 Итоговые размеры

### Передача через Git clone:
- **Скачивание**: ~2.7 GB (с историей .git)
- **После npm install**: ~3.4 GB
- **После npm build**: ~3.6 GB

### Передача чистого архива:
- **Архив кода**: ~5-10 MB
- **После npm install**: ~350 MB
- **После npm build**: ~500 MB
- **Новый .git init**: ~5 MB

---

## 🚀 Пошаговая инструкция для получателя

### 1. Получить код

**Через GitHub**:
```bash
git clone https://github.com/Pavlentius2007/the-sim-final.git
cd the-sim-final
```

**Или через архив**:
- Распаковать `the-sim-clean.zip`
- Перейти в папку

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить окружение

Создать файл `.env` в корне проекта:
```env
TELEGRAM_BOT_TOKEN=получить_от_передающего
TELEGRAM_CHAT_ID=получить_от_передающего
JWT_SECRET=сгенерировать_openssl
ENCRYPTION_KEY=сгенерировать_openssl
COOKIE_SECRET=сгенерировать_openssl
CSRF_SECRET=сгенерировать_openssl
```

### 4. Локальная разработка

```bash
npm run dev
```

Открыть http://localhost:3000

### 5. Развёртывание на сервере

Следовать инструкциям в `SERVER_RECOVERY_GUIDE.md`

---

## 💡 Рекомендации

1. **Для разработки**: Используйте GitHub clone
2. **Для быстрой передачи**: Используйте чистый архив
3. **Если нужно уменьшить размер**: Очистите историю Git через BFG

---

## 📞 Контакты

- **Репозиторий**: https://github.com/Pavlentius2007/the-sim-final
- **Домен**: https://thesim.site
- **Сервер**: 94.141.162.192

