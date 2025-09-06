# 🚀 Локальное тестирование TheSim в Docker (PowerShell)
Write-Host "🚀 Локальное тестирование TheSim в Docker..." -ForegroundColor Green

# Останавливаем существующие контейнеры
Write-Host "🛑 Останавливаем существующие контейнеры..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# Удаляем старые образы
Write-Host "🗑️  Удаляем старые образы..." -ForegroundColor Yellow
docker rmi thesim-thesim-app 2>$null

# Создаем SSL сертификаты если их нет
if (-not (Test-Path "ssl\cert.pem") -or -not (Test-Path "ssl\key.pem")) {
    Write-Host "🔐 Создаем SSL сертификаты..." -ForegroundColor Cyan
    
    # Проверяем наличие OpenSSL
    try {
        $opensslVersion = openssl version 2>$null
        Write-Host "✅ OpenSSL найден: $opensslVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ OpenSSL не найден. Создаем заглушки..." -ForegroundColor Red
        
        # Создаем заглушки для тестирования
        New-Item -ItemType Directory -Force -Path "ssl" | Out-Null
        
        # Создаем пустые файлы (для тестирования)
        "" | Out-File -FilePath "ssl\cert.pem" -Encoding UTF8
        "" | Out-File -FilePath "ssl\key.pem" -Encoding UTF8
        
        Write-Host "⚠️  Созданы заглушки SSL. Для продакшена нужны настоящие сертификаты!" -ForegroundColor Yellow
    }
}

# Собираем и запускаем
Write-Host "🔨 Собираем Docker образ..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml build

Write-Host "🚀 Запускаем приложение..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
Write-Host "⏳ Ждем запуска приложения..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Проверяем статус
Write-Host "🔍 Проверяем статус контейнеров..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи
Write-Host "📋 Логи приложения:" -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml logs thesim-app

Write-Host ""
Write-Host "✅ Тестирование завершено!" -ForegroundColor Green
Write-Host "🌐 Приложение доступно по адресам:" -ForegroundColor Cyan
Write-Host "   - HTTP:  http://localhost" -ForegroundColor White
Write-Host "   - HTTPS: https://localhost" -ForegroundColor White
Write-Host ""
Write-Host "📝 Для просмотра логов: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host "🛑 Для остановки: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray


