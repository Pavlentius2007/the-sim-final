# Скрипт для коммита и отправки изменений в GitHub

Write-Host "📦 Добавление всех изменений..." -ForegroundColor Cyan
git add -A

Write-Host "📝 Проверка статуса..." -ForegroundColor Cyan
git status

Write-Host "`n💾 Создание коммита..." -ForegroundColor Cyan
git commit -m "security: исправлены утечки данных и улучшена безопасность

- Удален хардкоженный Telegram Chat ID из кода
- Удалена ссылка на thesim.in из PersonalCabinetButton  
- Добавлены заголовки безопасности (HSTS, XSS Protection, Referrer-Policy)
- Улучшена CSP политика (убраны unsafe-inline и unsafe-eval)
- Добавлена валидация и защита от CSRF/XSS в API endpoints
- Улучшена SSL конфигурация в nginx.conf
- Добавлены скрипты проверки SSL сертификатов
- Создана документация по безопасности"

Write-Host "`n🚀 Отправка в GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Готово! Теперь на сервере выполните:" -ForegroundColor Green
Write-Host "   cd /root/the-sim-final" -ForegroundColor Yellow
Write-Host "   git pull origin main" -ForegroundColor Yellow
Write-Host "   docker-compose restart" -ForegroundColor Yellow

