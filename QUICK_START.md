# 🚀 Быстрый старт - CosmicLanding

## ⚡ Развертывание за 3 шага

### 1️⃣ Подготовка
```bash
# Клонируем проект (если еще не сделано)
git clone <your-repo-url>
cd The-Sim

# Делаем скрипты исполняемыми
chmod +x deploy-prod.sh ssl-setup.sh
```

### 2️⃣ SSL сертификаты
```bash
# Настройка SSL (выберите Let's Encrypt для продакшена)
./ssl-setup.sh
```

### 3️⃣ Запуск
```bash
# Развертывание
./deploy-prod.sh
```

## 🌐 Результат
- Приложение доступно по адресу: `https://yourdomain.com`
- Автоматический HTTP → HTTPS редирект
- SSL сертификат настроен
- Nginx + Next.js + Docker

## 📋 Что получили
✅ **Безопасность**: JWT, CSRF, шифрование  
✅ **Производительность**: Nginx + кэширование  
✅ **Масштабируемость**: Docker контейнеры  
✅ **SSL**: Let's Encrypt или самоподписанный  
✅ **Мониторинг**: Health checks + логи  

## 🆘 Если что-то пошло не так
```bash
# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Статус
docker-compose -f docker-compose.prod.yml ps

# Перезапуск
docker-compose -f docker-compose.prod.yml restart
```

## 📚 Подробная документация
См. файл `DEPLOYMENT.md` для детальных инструкций.
