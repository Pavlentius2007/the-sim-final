# 🚀 Скрипт развертывания TheSim на thesim.site (PowerShell)

Write-Host "🌐 Развертывание TheSim на thesim.site..." -ForegroundColor Green

# 1. Остановка старых контейнеров
Write-Host "⏹️ Остановка старых контейнеров..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# 2. Обновление кода
Write-Host "📥 Обновление кода..." -ForegroundColor Yellow
git pull origin main

# 3. Сборка и запуск
Write-Host "🔨 Сборка и запуск..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Проверка статуса
Write-Host "✅ Проверка статуса..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml ps

# 5. Проверка логов
Write-Host "📋 Последние логи:" -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml logs --tail=20

# 6. Проверка доступности
Write-Host "🌐 Проверка доступности сайта..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
try {
    Invoke-WebRequest -Uri "http://localhost:80" -Method Head -TimeoutSec 5
    Write-Host "✅ HTTP доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTP недоступен" -ForegroundColor Red
}

try {
    Invoke-WebRequest -Uri "https://localhost:443" -Method Head -TimeoutSec 5 -SkipCertificateCheck
    Write-Host "✅ HTTPS доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS недоступен" -ForegroundColor Red
}

Write-Host "🎉 Развертывание завершено!" -ForegroundColor Green
Write-Host "🌐 Сайт доступен по адресу: https://thesim.site" -ForegroundColor Cyan
Write-Host "📊 Мониторинг: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Cyan
