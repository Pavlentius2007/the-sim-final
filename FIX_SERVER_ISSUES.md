# 🔧 Исправление проблем на сервере

## Проблема: Порт 3000 уже занят

Ошибка: `address already in use` означает, что порт 3000 уже используется другим процессом или контейнером.

## Решение:

### Вариант 1: Остановить и запустить заново (рекомендуется)

```bash
# Остановить все контейнеры
docker-compose down

# Запустить заново
docker-compose up -d

# Проверить статус
docker-compose ps
```

### Вариант 2: Найти и остановить процесс, занимающий порт

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000
# или
sudo netstat -tulpn | grep 3000

# Остановить процесс (замените PID на реальный)
sudo kill -9 <PID>

# Затем перезапустить контейнеры
docker-compose restart
```

### Вариант 3: Остановить конкретный контейнер

```bash
# Посмотреть запущенные контейнеры
docker ps

# Остановить контейнер cosmiclanding-app
docker stop cosmiclanding-app

# Удалить контейнер
docker rm cosmiclanding-app

# Запустить заново
docker-compose up -d
```

---

## Очистка странных файлов

В выводе git pull видны странные файлы-артефакты:
- `" --date=iso \357\201\274 head -50"`
- `tatus --porcelain`

Эти файлы нужно удалить:

```bash
# На сервере
cd /root/the-sim-final

# Удалить странные файлы
rm -f " --date=iso \357\201\274 head -50"
rm -f "tatus --porcelain"

# Проверить что удалено
ls -la | grep -E "date|tatus"

# Добавить в .gitignore чтобы не попадали в git
echo '" --date=iso*' >> .gitignore
echo 'tatus*' >> .gitignore
```

---

## Полная последовательность команд для сервера:

```bash
# 1. Перейти в директорию проекта
cd /root/the-sim-final

# 2. Удалить странные файлы-артефакты
rm -f " --date=iso \357\201\274 head -50" 2>/dev/null
rm -f "tatus --porcelain" 2>/dev/null

# 3. Остановить все контейнеры
docker-compose down

# 4. Проверить что порт свободен
sudo lsof -i :3000 || echo "Порт 3000 свободен"

# 5. Запустить контейнеры заново
docker-compose up -d

# 6. Проверить статус
docker-compose ps

# 7. Проверить логи
docker-compose logs --tail=50

# 8. Проверить что сайт работает
curl -I https://thesim.site
```

---

## Проверка работоспособности после перезапуска:

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить логи приложения
docker-compose logs app --tail=100

# Проверить логи nginx (если используется)
docker-compose logs nginx --tail=50

# Проверить доступность сайта
curl -I https://thesim.site

# Проверить API
curl -X POST https://thesim.site/api/leads \
  -H "Content-Type: application/json" \
  -H "Origin: https://thesim.site" \
  -d '{"name":"test","email":"test@test.com"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

---

## Если проблемы продолжаются:

1. **Проверить конфигурацию docker-compose.yml:**
   ```bash
   cat docker-compose.yml | grep -A 5 ports
   ```

2. **Проверить использование портов:**
   ```bash
   sudo netstat -tulpn | grep -E "3000|80|443"
   ```

3. **Пересоздать контейнеры с нуля:**
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

4. **Проверить системные ресурсы:**
   ```bash
   df -h
   free -h
   docker system df
   ```

