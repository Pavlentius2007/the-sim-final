# Скрипт для очистки кеша Next.js
Write-Host "Очистка кеша Next.js..." -ForegroundColor Yellow

# Останавливаем все процессы Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Удаляем папки кеша
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Удалена папка .next" -ForegroundColor Green
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "Удалена папка node_modules\.cache" -ForegroundColor Green
}

# Очищаем npm кеш
npm cache clean --force

Write-Host "Кеш очищен! Запускаем сервер..." -ForegroundColor Green
npm run dev
