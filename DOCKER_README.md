# 🐳 CosmicLanding - Docker Развертывание

> **Полное руководство по развертыванию в Docker**

## 🚀 Быстрый старт

### **1. Клонирование проекта**
```bash
git clone <your-repository>
cd cosmiclanding
```

### **2. Настройка переменных окружения**
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

### **3. Запуск**
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 Требования к серверу

### **Минимальные:**
- **CPU**: 1 ядро
- **RAM**: 1 GB
- **Storage**: 5 GB
- **OS**: Ubuntu 20.04+, CentOS 8+, или любой Linux с Docker

### **Рекомендуемые:**
- **CPU**: 2 ядра
- **RAM**: 2 GB
- **Storage**: 10 GB
- **OS**: Ubuntu 22.04 LTS

## 🔧 Установка Docker

### **Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

### **CentOS/RHEL:**
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

### **Проверка:**
```bash
docker --version
docker-compose --version
```

## ⚙️ Настройка

### **1. Переменные окружения (.env)**
```env
# Обязательные
JWT_SECRET=your-64-character-secret
ENCRYPTION_KEY=your-32-character-key
COOKIE_SECRET=your-32-character-key
CSRF_SECRET=your-64-character-secret

# Настройки
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
PORT=3000
```

### **2. Генерация секретных ключей**
```bash
# JWT_SECRET (64 символа)
openssl rand -hex 32

# ENCRYPTION_KEY (32 символа)
openssl rand -hex 16

# COOKIE_SECRET (32 символа)
openssl rand -hex 16

# CSRF_SECRET (64 символа)
openssl rand -hex 32
```

## 🚀 Развертывание

### **Автоматическое (рекомендуется):**
```bash
./deploy.sh
```

### **Ручное:**
```bash
# Сборка
docker-compose build

# Запуск
docker-compose up -d

# Проверка статуса
docker-compose ps
```

## 🔒 SSL/HTTPS

### **1. Получение сертификатов**
```bash
# Let's Encrypt (бесплатно)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Копирование сертификатов
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
```

### **2. Автообновление сертификатов**
```bash
# Добавить в crontab
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Мониторинг

### **Просмотр логов:**
```bash
# Все сервисы
docker-compose logs -f

# Только приложение
docker-compose logs -f cosmiclanding

# Только Nginx
docker-compose logs -f nginx
```

### **Статистика контейнеров:**
```bash
docker stats
```

### **Использование ресурсов:**
```bash
docker system df
```

## 🔄 Обновление

### **Обновление кода:**
```bash
git pull origin main
./deploy.sh
```

### **Обновление зависимостей:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Решение проблем

### **Проблема: Контейнер не запускается**
```bash
# Проверка логов
docker-compose logs cosmiclanding

# Проверка статуса
docker-compose ps

# Перезапуск
docker-compose restart
```

### **Проблема: Недостаточно места**
```bash
# Очистка Docker
docker system prune -a

# Очистка образов
docker image prune -a
```

### **Проблема: Порт занят**
```bash
# Проверка занятых портов
netstat -tulpn | grep :3000

# Изменение порта в docker-compose.yml
ports:
  - "3001:3000"  # Внешний порт 3001
```

## 📈 Масштабирование

### **Горизонтальное масштабирование:**
```bash
# Увеличить количество экземпляров
docker-compose up -d --scale cosmiclanding=3
```

### **Load Balancer:**
```bash
# Добавить в docker-compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

## 🔍 Проверка работоспособности

### **1. Основной функционал:**
- [ ] Главная страница загружается
- [ ] API роуты работают
- [ ] Админ-панель доступна

### **2. Безопасность:**
- [ ] HTTPS работает
- [ ] Security headers настроены
- [ ] CORS работает

### **3. Производительность:**
- [ ] Страницы загружаются быстро
- [ ] Статические файлы кешируются
- [ ] Gzip сжатие работает

## 📞 Поддержка

### **При возникновении проблем:**
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус: `docker-compose ps`
3. Проверьте переменные окружения
4. Обратитесь к разработчикам

---

**CosmicLanding** - готовое решение для Docker развертывания! 🚀✨
