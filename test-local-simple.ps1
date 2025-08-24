# Локальное тестирование TheSim в Docker
Write-Host "Локальное тестирование TheSim в Docker..." -ForegroundColor Green

# Останавливаем существующие контейнеры
Write-Host "Останавливаем существующие контейнеры..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# Собираем Docker образ
Write-Host "Собираем Docker образ..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml build

# Запускаем приложение
Write-Host "Запускаем приложение..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
Write-Host "Ждем запуска приложения..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Проверяем статус
Write-Host "Проверяем статус контейнеров..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "Тестирование завершено!" -ForegroundColor Green
Write-Host "Приложение доступно по адресам:" -ForegroundColor Cyan
Write-Host "   - HTTP:  http://localhost" -ForegroundColor White
Write-Host "   - HTTPS: https://localhost" -ForegroundColor White
Write-Host ""
Write-Host "Для просмотра логов: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host "Для остановки: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray

