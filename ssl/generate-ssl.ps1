# 🔐 Генерация SSL сертификатов для TheSim (PowerShell)
Write-Host "🔐 Генерация SSL сертификатов для TheSim..." -ForegroundColor Green

# Проверяем наличие OpenSSL
try {
    $opensslVersion = & openssl version 2>$null
    Write-Host "✅ OpenSSL найден: $opensslVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ OpenSSL не найден!" -ForegroundColor Red
    Write-Host "📥 Скачайте OpenSSL для Windows:" -ForegroundColor Yellow
    Write-Host "   https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Cyan
    Write-Host "   Или используйте WSL/Linux подсистему" -ForegroundColor Yellow
    exit 1
}

# Создаем директорию если её нет
if (-not (Test-Path "ssl")) {
    New-Item -ItemType Directory -Force -Path "ssl" | Out-Null
    Write-Host "📁 Создана папка ssl/" -ForegroundColor Green
}

# Создаем конфигурацию для сертификата
$opensslConfig = @"
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = RU
ST = Moscow
L = Moscow
O = TheSim
OU = Development
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = thesim.in
DNS.4 = *.thesim.in
IP.1 = 127.0.0.1
IP.2 = ::1
"@

# Сохраняем конфигурацию
$opensslConfig | Out-File -FilePath "ssl\openssl.conf" -Encoding UTF8
Write-Host "📝 Создан конфигурационный файл openssl.conf" -ForegroundColor Green

# Генерируем приватный ключ (2048 бит)
Write-Host "🔑 Генерируем приватный ключ..." -ForegroundColor Cyan
& openssl genrsa -out "ssl\key.pem" 2048
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Приватный ключ создан: ssl\key.pem" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка создания приватного ключа!" -ForegroundColor Red
    exit 1
}

# Генерируем самоподписанный сертификат
Write-Host "📜 Генерируем самоподписанный сертификат..." -ForegroundColor Cyan
& openssl req -new -x509 -key "ssl\key.pem" -out "ssl\cert.pem" -days 365 -config "ssl\openssl.conf"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Сертификат создан: ssl\cert.pem" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка создания сертификата!" -ForegroundColor Red
    exit 1
}

# Создаем полную цепочку сертификатов
Write-Host "🔗 Создаем полную цепочку сертификатов..." -ForegroundColor Cyan
& openssl x509 -in "ssl\cert.pem" -out "ssl\cert-chain.pem" -outform PEM
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Цепочка сертификатов создана: ssl\cert-chain.pem" -ForegroundColor Green
} else {
    Write-Host "⚠️  Цепочка сертификатов не создана (не критично)" -ForegroundColor Yellow
}

# Проверяем сертификат
Write-Host "🔍 Проверяем созданный сертификат..." -ForegroundColor Cyan
& openssl x509 -in "ssl\cert.pem" -text -noout | Select-String "Subject:", "Not Before:", "Not After:", "DNS:", "IP Address:"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Сертификат проверен успешно!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Ошибка проверки сертификата" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 SSL сертификаты созданы успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Файлы:" -ForegroundColor Cyan
Write-Host "   - ssl\key.pem (приватный ключ)" -ForegroundColor White
Write-Host "   - ssl\cert.pem (сертификат)" -ForegroundColor White
Write-Host "   - ssl\cert-chain.pem (цепочка)" -ForegroundColor White
Write-Host "   - ssl\openssl.conf (конфигурация)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ВНИМАНИЕ:" -ForegroundColor Yellow
Write-Host "   - Эти сертификаты только для локального тестирования!" -ForegroundColor Red
Write-Host "   - Для продакшена используйте Let's Encrypt или коммерческие сертификаты" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Теперь можно запускать Docker с HTTPS!" -ForegroundColor Green


