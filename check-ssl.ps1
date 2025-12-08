# 🔒 Скрипт проверки SSL сертификатов для TheSim (PowerShell)

$DOMAIN = "thesim.site"
$CERT_PATH = "/etc/letsencrypt/live/${DOMAIN}"

Write-Host "🔍 Проверка SSL сертификатов для ${DOMAIN}..." -ForegroundColor Cyan

# Проверка существования сертификатов (для Linux/WSL)
if (Test-Path "${CERT_PATH}/fullchain.pem" -PathType Leaf) {
    Write-Host "✅ Сертификаты найдены" -ForegroundColor Green
    
    # Проверка срока действия (требует openssl)
    $expiryCheck = & openssl x509 -in "${CERT_PATH}/fullchain.pem" -noout -checkend 2592000 2>&1
    if ($LASTEXITCODE -eq 0) {
        $expiryDate = & openssl x509 -in "${CERT_PATH}/fullchain.pem" -noout -enddate 2>&1
        Write-Host "✅ Сертификат действителен: $expiryDate" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Сертификат истекает в течение 30 дней!" -ForegroundColor Yellow
        Write-Host "🔄 Запустите обновление: sudo certbot renew" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Сертификаты не найдены в ${CERT_PATH}" -ForegroundColor Red
    Write-Host "📝 Запустите: sudo certbot certonly --nginx -d ${DOMAIN} -d www.${DOMAIN}" -ForegroundColor Yellow
}

# Проверка SSL через PowerShell (для Windows)
Write-Host "`n🔍 Проверка SSL соединения..." -ForegroundColor Cyan
try {
    $request = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $response = Invoke-WebRequest -Uri "https://${DOMAIN}" -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ SSL соединение работает" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Проблемы с SSL соединением: $_" -ForegroundColor Yellow
}

Write-Host "`n📋 Рекомендации:" -ForegroundColor Cyan
Write-Host "   - Проверьте сертификат на SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}" -ForegroundColor White
Write-Host "   - Проверьте заголовки безопасности: https://securityheaders.com/?q=https://${DOMAIN}" -ForegroundColor White

