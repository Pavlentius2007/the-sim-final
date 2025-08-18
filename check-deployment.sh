#!/bin/bash

# 🔍 CosmicLanding - Проверка готовности к развертыванию
# Проверяет наличие всех необходимых файлов и настроек

set -e

echo "🔍 Проверка готовности к развертыванию CosmicLanding..."
echo "=================================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Счетчики
total_checks=0
passed_checks=0
warnings=0
errors=0

# Функция проверки
check_item() {
    local description="$1"
    local condition="$2"
    local required="$3"
    
    total_checks=$((total_checks + 1))
    
    if eval "$condition"; then
        print_success "$description"
        passed_checks=$((passed_checks + 1))
    else
        if [ "$required" = "required" ]; then
            print_error "$description"
            errors=$((errors + 1))
        else
            print_warning "$description"
            warnings=$((warnings + 1))
        fi
    fi
}

echo ""
print_status "Проверяем основные файлы..."

# Проверка основных файлов
check_item "Dockerfile присутствует" "[ -f 'Dockerfile' ]" "required"
check_item "docker-compose.prod.yml присутствует" "[ -f 'docker-compose.prod.yml' ]" "required"
check_item "nginx.conf присутствует" "[ -f 'nginx.conf' ]" "required"
check_item "package.json присутствует" "[ -f 'package.json' ]" "required"
check_item "next.config.js присутствует" "[ -f 'next.config.js' ]" "required"

echo ""
print_status "Проверяем скрипты развертывания..."

# Проверка скриптов
check_item "deploy-prod.sh присутствует" "[ -f 'deploy-prod.sh' ]" "required"
check_item "ssl-setup.sh присутствует" "[ -f 'ssl-setup.sh' ]" "required"
check_item "deploy-prod.sh исполняемый" "[ -x 'deploy-prod.sh' ]" "required"
check_item "ssl-setup.sh исполняемый" "[ -x 'ssl-setup.sh' ]" "required"

echo ""
print_status "Проверяем конфигурацию..."

# Проверка конфигурации
check_item "Папка ssl/ существует" "[ -d 'ssl' ]" "optional"
check_item "SSL сертификат присутствует" "[ -f 'ssl/cert.pem' ]" "optional"
check_item "SSL ключ присутствует" "[ -f 'ssl/key.pem' ]" "optional"

echo ""
print_status "Проверяем зависимости..."

# Проверка зависимостей
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        print_success "node_modules установлен"
        passed_checks=$((passed_checks + 1))
    else
        print_warning "node_modules не установлен (будет установлен при сборке)"
        warnings=$((warnings + 1))
    fi
    total_checks=$((total_checks + 1))
fi

echo ""
print_status "Проверяем Docker..."

# Проверка Docker
if command -v docker &> /dev/null; then
    docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "Docker установлен (версия: $docker_version)"
    passed_checks=$((passed_checks + 1))
else
    print_error "Docker не установлен"
    errors=$((errors + 1))
fi
total_checks=$((total_checks + 1))

if command -v docker-compose &> /dev/null; then
    compose_version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "Docker Compose установлен (версия: $compose_version)"
    passed_checks=$((passed_checks + 1))
else
    print_error "Docker Compose не установлен"
    errors=$((errors + 1))
fi
total_checks=$((total_checks + 1))

echo ""
print_status "Проверяем порты..."

# Проверка портов (если возможно)
if command -v netstat &> /dev/null; then
    if netstat -tulpn 2>/dev/null | grep -q ":80 "; then
        print_warning "Порт 80 занят (может помешать развертыванию)"
        warnings=$((warnings + 1))
    else
        print_success "Порт 80 свободен"
        passed_checks=$((passed_checks + 1))
    fi
    
    if netstat -tulpn 2>/dev/null | grep -q ":443 "; then
        print_warning "Порт 443 занят (может помешать развертыванию)"
        warnings=$((warnings + 1))
    else
        print_success "Порт 443 свободен"
        passed_checks=$((passed_checks + 1))
    fi
    total_checks=$((total_checks + 2))
fi

echo ""
echo "=================================================="
print_status "Результаты проверки:"
echo ""

# Выводим результаты
echo "📊 Статистика:"
echo "  Всего проверок: $total_checks"
echo "  Успешно: $passed_checks"
echo "  Предупреждения: $warnings"
echo "  Ошибки: $errors"
echo ""

# Рекомендации
if [ $errors -eq 0 ]; then
    if [ $warnings -eq 0 ]; then
        print_success "🎉 Все проверки пройдены! Можете развертывать приложение."
        echo ""
        echo "🚀 Следующие шаги:"
        echo "  1. Настройте SSL: ./ssl-setup.sh"
        echo "  2. Разверните: ./deploy-prod.sh"
    else
        print_success "✅ Основные проверки пройдены, но есть предупреждения."
        echo ""
        echo "⚠️  Рекомендации:"
        if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
            echo "  - Настройте SSL сертификаты: ./ssl-setup.sh"
        fi
        echo "  - Проверьте занятые порты"
        echo ""
        echo "🚀 Можете продолжить развертывание: ./deploy-prod.sh"
    fi
else
    print_error "❌ Есть критические ошибки. Исправьте их перед развертыванием."
    echo ""
    echo "🔧 Что исправить:"
    if ! command -v docker &> /dev/null; then
        echo "  - Установите Docker"
    fi
    if ! command -v docker-compose &> /dev/null; then
        echo "  - Установите Docker Compose"
    fi
    if [ ! -f "Dockerfile" ]; then
        echo "  - Создайте Dockerfile"
    fi
    echo ""
    echo "📚 См. DEPLOYMENT.md для подробных инструкций."
fi

echo ""
echo "=================================================="
