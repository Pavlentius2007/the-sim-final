# 🔐 Установка OpenSSL на Windows для генерации SSL сертификатов

## 🎯 **Вариант 1: Скачивание готового бинарника (рекомендуется)**

### **Шаг 1: Скачайте OpenSSL**
1. Перейдите на сайт: https://slproweb.com/products/Win32OpenSSL.html
2. Скачайте версию для Windows (64-bit):
   - **OpenSSL v3.x.x** - для Windows 10/11
   - **OpenSSL v1.1.x** - для Windows 7/8/10

### **Шаг 2: Установите OpenSSL**
1. Запустите скачанный `.exe` файл
2. Выберите папку установки (по умолчанию: `C:\OpenSSL-Win64`)
3. Завершите установку

### **Шаг 3: Добавьте в PATH**
1. Откройте "Система" → "Дополнительные параметры системы"
2. Нажмите "Переменные среды"
3. В разделе "Системные переменные" найдите `Path`
4. Нажмите "Изменить" → "Создать"
5. Добавьте: `C:\OpenSSL-Win64\bin`
6. Нажмите "ОК" во всех окнах

### **Шаг 4: Проверьте установку**
```powershell
openssl version
```

---

## 🐧 **Вариант 2: WSL (Windows Subsystem for Linux)**

### **Шаг 1: Установите WSL**
```powershell
# В PowerShell от администратора
wsl --install
```

### **Шаг 2: Перезагрузите компьютер**

### **Шаг 3: Установите OpenSSL в WSL**
```bash
# В WSL терминале
sudo apt update
sudo apt install openssl
```

### **Шаг 4: Проверьте установку**
```bash
openssl version
```

---

## 🚀 **Вариант 3: Chocolatey (менеджер пакетов)**

### **Шаг 1: Установите Chocolatey**
```powershell
# В PowerShell от администратора
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### **Шаг 2: Установите OpenSSL**
```powershell
choco install openssl
```

### **Шаг 3: Проверьте установку**
```powershell
openssl version
```

---

## ✅ **После установки OpenSSL**

### **Запустите генерацию сертификатов:**
```powershell
.\ssl\generate-ssl.ps1
```

### **Или вручную:**
```powershell
# Создайте папку ssl
mkdir ssl

# Генерируйте сертификаты
openssl genrsa -out ssl\key.pem 2048
openssl req -new -x509 -key ssl\key.pem -out ssl\cert.pem -days 365 -subj "/C=RU/ST=Moscow/L=Moscow/O=TheSim/CN=localhost"
```

---

## 🔍 **Проверка сертификатов**

### **Просмотр информации о сертификате:**
```powershell
openssl x509 -in ssl\cert.pem -text -noout
```

### **Проверка приватного ключа:**
```powershell
openssl rsa -in ssl\key.pem -check
```

---

## ⚠️ **Важные замечания**

- **Самоподписанные сертификаты** - только для локального тестирования
- **Браузер будет показывать предупреждение** - это нормально для локальной разработки
- **Для продакшена** используйте Let's Encrypt или коммерческие сертификаты
- **Приватный ключ** должен быть защищен (права 600)

---

## 🆘 **Решение проблем**

### **"openssl не является внутренней или внешней командой"**
- Добавьте OpenSSL в PATH
- Перезапустите PowerShell
- Проверьте правильность пути

### **"Permission denied"**
- Запустите PowerShell от имени администратора
- Проверьте права на папку ssl

### **"Error loading config file"**
- Создайте файл конфигурации openssl.conf
- Укажите правильный путь к конфигурации

##  Создание SSL сертификатов вручную:

### 1. Сначала удалите поврежденные файлы:
```powershell
Remove-Item cert.pem, key.pem -Force
```

### 2. Создайте конфигурационный файл:
```powershell
@"
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
"@ | Out-File -FilePath "openssl.conf" -Encoding UTF8
```

### 3. Генерируйте приватный ключ:
```powershell
openssl genrsa -out key.pem 2048
```

### 4. Генерируйте сертификат:
```powershell
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -config openssl.conf
```

### 5. Проверьте созданные файлы:
```powershell
dir
```

### 6. Проверьте содержимое сертификата:
```powershell
openssl x509 -in cert.pem -text -noout
```

Выполните эти команды по порядку. После каждой команды должно появляться сообщение об успешном выполнении. Если возникнут ошибки, покажите их мне!


