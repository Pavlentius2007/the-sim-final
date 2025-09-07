# 🚀 Обновление сервера с новыми настройками домена

Write-Host "🌐 Обновление сервера для thesim.site..." -ForegroundColor Green

# 1. Подключение к серверу и обновление
Write-Host "📥 Подключение к серверу и обновление кода..." -ForegroundColor Yellow

# Команды для выполнения на сервере:
$serverCommands = @"
cd /root/the-sim-final
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml ps
"@

Write-Host "🔧 Выполните эти команды на сервере:" -ForegroundColor Cyan
Write-Host $serverCommands -ForegroundColor White

Write-Host "`n📋 Или используйте SSH:" -ForegroundColor Yellow
Write-Host "ssh root@94.141.162.192" -ForegroundColor White
Write-Host "cd /root/the-sim-final" -ForegroundColor White
Write-Host "git pull origin main" -ForegroundColor White
Write-Host "docker-compose -f docker-compose.prod.yml down" -ForegroundColor White
Write-Host "docker-compose -f docker-compose.prod.yml up -d --build" -ForegroundColor White

Write-Host "`n✅ После обновления сайт будет доступен по адресу:" -ForegroundColor Green
Write-Host "🌐 https://thesim.site" -ForegroundColor Cyan
Write-Host "🌐 https://www.thesim.site" -ForegroundColor Cyan
