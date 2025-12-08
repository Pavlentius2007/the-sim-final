# 🔒 Руководство по проверке безопасности GitHub репозитория

## ⚠️ КРИТИЧЕСКИЕ ПРОБЛЕМЫ ОБНАРУЖЕНЫ

### 🚨 Найденные утечки данных:

1. **Telegram Chat ID захардкожен в коде**
   - Файл: `app/api/leads/route.ts` (строка 11)
   - Значение: `'1262412157'` (@Pavlentius2007)
   - **Статус**: ПУБЛИЧНО ДОСТУПНО В GITHUB

2. **Telegram Chat ID в тестовом файле**
   - Файл: `test-telegram.html` (строка 24)
   - Значение: `'1262412157'`
   - **Статус**: ПУБЛИЧНО ДОСТУПНО В GITHUB

---

## 📋 Чек-лист проверки безопасности

### 1. Проверка истории Git на утечки секретов

#### Windows PowerShell:
```powershell
# Проверка на наличие .env файлов в истории
git log --all --full-history --name-only | Select-String "\.env"

# Поиск токенов Telegram в истории
git log --all --full-history -p | Select-String -Pattern "TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID" -Context 3

# Поиск JWT секретов
git log --all --full-history -p | Select-String -Pattern "JWT_SECRET|ENCRYPTION_KEY|COOKIE_SECRET" -Context 3

# Поиск паролей и API ключей
git log --all --full-history -p | Select-String -Pattern "(password|secret|key|token|api_key)" -Context 3
```

#### Linux/Mac:
```bash
# Проверка на наличие .env файлов в истории
git log --all --full-history --name-only | grep "\.env"

# Поиск токенов Telegram в истории
git log --all --full-history -p | grep -A 3 -B 3 "TELEGRAM_BOT_TOKEN\|TELEGRAM_CHAT_ID"

# Поиск JWT секретов
git log --all --full-history -p | grep -A 3 -B 3 "JWT_SECRET\|ENCRYPTION_KEY\|COOKIE_SECRET"

# Поиск паролей и API ключей
git log --all --full-history -p | grep -A 3 -B 3 -i "password\|secret\|key\|token\|api_key"
```

### 2. Проверка текущего кода на секреты

```powershell
# Поиск хардкоженных значений
Select-String -Path "**/*.ts","**/*.tsx","**/*.js","**/*.jsx" -Pattern "1262412157|TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID" -Recurse

# Проверка на наличие реальных токенов (не примеров)
Select-String -Path "**/*.ts","**/*.tsx" -Pattern "bot[0-9]+:[A-Za-z0-9_-]+" -Recurse
```

### 3. Проверка GitHub репозитория

#### Онлайн проверка:
1. Перейдите на GitHub.com → ваш репозиторий
2. Используйте поиск GitHub: `TELEGRAM_BOT_TOKEN` или `TELEGRAM_CHAT_ID`
3. Проверьте все коммиты на наличие секретов

#### Использование GitHub CLI:
```bash
gh api repos/:owner/:repo/commits --jq '.[].sha' | while read sha; do
  git show $sha | grep -i "telegram\|secret\|token"
done
```

### 4. Проверка настроек GitHub

1. **Settings → Secrets and variables → Actions**
   - Убедитесь, что секреты не видны в логах Actions

2. **Settings → Security → Code security and analysis**
   - Включите "Secret scanning" (если доступно)

3. **Settings → Collaborators**
   - Проверьте список людей с доступом к репозиторию

4. **Settings → Deploy keys**
   - Проверьте активные deploy keys

5. **Settings → Webhooks**
   - Проверьте активные webhooks и их URL

---

## 🛡️ МЕРЫ ЗАЩИТЫ

### НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ:

#### 1. Отозвать скомпрометированные токены

**Telegram Bot Token:**
- Перейдите к [@BotFather](https://t.me/BotFather) в Telegram
- Отправьте `/revoke` или `/newtoken`
- Создайте новый токен
- Обновите `.env` на сервере

**Telegram Chat ID:**
- Это публичный идентификатор, его нельзя "отозвать"
- Но злоумышленник теперь знает ваш chat_id
- Рекомендуется использовать только переменные окружения

#### 2. Удалить секреты из истории Git

⚠️ **ВНИМАНИЕ**: Это изменит историю Git. Используйте только если репозиторий приватный или вы готовы к force push.

```bash
# Установка git-filter-repo (если нет)
pip install git-filter-repo

# Удаление секрета из всей истории
git filter-repo --invert-paths --path app/api/leads/route.ts --path test-telegram.html

# Или использование BFG Repo-Cleaner
# Скачать: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt
```

**Альтернатива (безопаснее):**
- Создайте новый репозиторий
- Скопируйте только текущий код (без истории)
- Удалите старый репозиторий или сделайте его приватным

#### 3. Исправить код

- Удалить хардкоженные значения из кода
- Использовать только переменные окружения
- Удалить тестовые файлы с секретами

#### 4. Обновить секреты на сервере

```bash
# На сервере
cd /path/to/project
nano .env  # Обновите все секреты
docker-compose restart  # Перезапустите приложение
```

#### 5. Проверить логи на подозрительную активность

```bash
# Проверка логов Docker
docker-compose logs --tail=1000 | grep -i "error\|unauthorized\|failed"

# Проверка логов Nginx
tail -n 1000 /var/log/nginx/access.log | grep -i "admin\|api\|telegram"

# Проверка подозрительных IP
tail -n 1000 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

---

## 🔐 ПРЕДОТВРАЩЕНИЕ БУДУЩИХ УТЕЧЕК

### 1. Использование .gitignore

Убедитесь, что `.gitignore` содержит:
```
.env
.env.local
.env.*.local
*.log
ssl/*.pem
ssl/*.key
```

### 2. Pre-commit hooks

Создайте `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Проверка на секреты перед коммитом
if git diff --cached | grep -E "(TELEGRAM_BOT_TOKEN|JWT_SECRET|password.*=)" | grep -v "your_"; then
    echo "❌ ОБНАРУЖЕНЫ СЕКРЕТЫ В КОДЕ! Коммит отменен."
    exit 1
fi
```

### 3. Использование GitHub Secrets

Для CI/CD используйте GitHub Secrets:
- Settings → Secrets and variables → Actions
- Добавьте все секреты туда
- Используйте в workflows: `${{ secrets.TELEGRAM_BOT_TOKEN }}`

### 4. Сканирование кода

Используйте инструменты:
- **truffleHog**: `pip install truffleHog && truffleHog git file://.`
- **git-secrets**: `git secrets --scan-history`
- **gitleaks**: `gitleaks detect --source .`

### 5. Code Review

- Всегда проверяйте код перед merge
- Используйте pull requests
- Запретите прямые коммиты в main/master

---

## 📊 МОНИТОРИНГ

### Регулярные проверки:

1. **Еженедельно**: Проверка логов на подозрительную активность
2. **Ежемесячно**: Аудит доступа к репозиторию
3. **При каждом релизе**: Проверка на наличие секретов в коде

### Индикаторы взлома:

- Необычная активность в логах
- Неизвестные IP адреса в access.log
- Неожиданные запросы к API endpoints
- Изменения в коде, которые вы не делали
- Новые коммиты от неизвестных авторов

---

## 🆘 ЧТО ДЕЛАТЬ ПРИ ПОДОЗРЕНИИ НА ВЗЛОМ

1. **Немедленно**:
   - Отзовите все токены и ключи
   - Измените все пароли
   - Проверьте логи на активность злоумышленника

2. **В течение часа**:
   - Проверьте историю Git на утечки
   - Проверьте настройки GitHub
   - Обновите все секреты

3. **В течение дня**:
   - Проведите полный аудит безопасности
   - Обновите документацию по безопасности
   - Настройте мониторинг

---

## 📞 ПОДДЕРЖКА

Если обнаружены серьезные утечки:
- GitHub Security Advisory: https://github.com/security/advisories
- Сообщите о проблеме в GitHub Support

---

**Дата создания**: 2025-11-06
**Последнее обновление**: 2025-11-06

