# 🚀 Запуск TheSim в продакшен режиме (PowerShell)
Write-Host "🚀 Запуск TheSim в продакшен режиме..." -ForegroundColor Green

# Проверяем наличие Docker
try {
    $dockerVersion = & docker --version 2>$null
    Write-Host "✅ Docker найден: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не найден!" -ForegroundColor Red
    Write-Host "📥 Установите Docker Desktop для Windows" -ForegroundColor Yellow
    exit 1
}

# Проверяем наличие SSL сертификатов
if (-not (Test-Path "ssl\cert.pem") -or -not (Test-Path "ssl\key.pem")) {
    Write-Host "❌ SSL сертификаты не найдены!" -ForegroundColor Red
    Write-Host "🔐 Сначала создайте SSL сертификаты:" -ForegroundColor Yellow
    Write-Host "   cd ssl && .\generate-ssl.ps1" -ForegroundColor Cyan
    exit 1
}

# Останавливаем существующие контейнеры
Write-Host "🛑 Останавливаем существующие контейнеры..." -ForegroundColor Cyan
& docker-compose -f docker-compose.prod.yml down --remove-orphans

# Очищаем Docker кэш
Write-Host "🧹 Очищаем Docker кэш..." -ForegroundColor Cyan
& docker system prune -f

# Запускаем продакшен версию
Write-Host "🚀 Запускаем продакшен версию..." -ForegroundColor Cyan
& docker-compose -f docker-compose.prod.yml up --build -d

# Проверяем статус
Start-Sleep -Seconds 10
Write-Host "🔍 Проверяем статус контейнеров..." -ForegroundColor Cyan
& docker ps

Write-Host ""
Write-Host "🎉 TheSim запущен в продакшен режиме!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Доступ к сайту:" -ForegroundColor Cyan
Write-Host "   HTTP:  http://localhost (редирект на HTTPS)" -ForegroundColor White
Write-Host "   HTTPS: https://localhost" -ForegroundColor White
Write-Host ""
Write-Host "📊 Логи приложения:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml logs -f app" -ForegroundColor White
Write-Host ""
Write-Host "📊 Логи Nginx:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml logs -f nginx" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Остановка:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.prod.yml down" -ForegroundColor White
