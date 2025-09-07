# 🔧 Исправление ошибки 502 Bad Gateway для thesim.site

Write-Host "🔧 Диагностика и исправление ошибки 502..." -ForegroundColor Red

Write-Host "`n📋 ПРОБЛЕМА:" -ForegroundColor Yellow
Write-Host "502 Bad Gateway = Nginx не может подключиться к Next.js приложению" -ForegroundColor White

Write-Host "`n🔍 ДИАГНОСТИКА (выполните на сервере):" -ForegroundColor Cyan

$diagnosticCommands = @"
# 1. Проверка статуса контейнеров
docker ps -a

# 2. Проверка логов приложения
docker-compose -f docker-compose.prod.yml logs app

# 3. Проверка логов Nginx
docker-compose -f docker-compose.prod.yml logs nginx

# 4. Проверка портов
netstat -tlnp | grep :3000
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# 5. Проверка доступности приложения
curl -I http://localhost:3000
curl -I http://localhost:3000/ru
"@

Write-Host $diagnosticCommands -ForegroundColor White

Write-Host "`n🚀 ИСПРАВЛЕНИЕ:" -ForegroundColor Green

$fixCommands = @"
# 1. Остановка всех контейнеров
docker-compose -f docker-compose.prod.yml down

# 2. Очистка старых контейнеров
docker system prune -f

# 3. Обновление кода
cd /root/the-sim-final
git pull origin main

# 4. Пересборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Проверка статуса
docker-compose -f docker-compose.prod.yml ps

# 6. Мониторинг логов
docker-compose -f docker-compose.prod.yml logs -f
"@

Write-Host $fixCommands -ForegroundColor White

Write-Host "`n🌐 ПРОВЕРКА ПОСЛЕ ИСПРАВЛЕНИЯ:" -ForegroundColor Cyan
Write-Host "1. https://thesim.site - должен работать" -ForegroundColor White
Write-Host "2. https://www.thesim.site - должен работать" -ForegroundColor White
Write-Host "3. http://94.141.162.192.sslip.io/ru - должен работать" -ForegroundColor White

Write-Host "`n⚠️ ВАЖНО:" -ForegroundColor Red
Write-Host "SSL сертификат нужно настроить отдельно!" -ForegroundColor White
Write-Host "Сейчас сайт работает по HTTP, но Nginx настроен на HTTPS" -ForegroundColor White
