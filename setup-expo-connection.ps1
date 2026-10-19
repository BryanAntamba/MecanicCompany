# 🔧 Script para conectar Expo Go a tu servidor backend en la misma red
# Uso: .\setup-expo-connection.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Configuración de Conexión Expo Go → Backend MecanicCompany  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─── PASO 1: Obtener IP local ─────────────────────────────────────────────────
Write-Host "📍 Buscando tu IP local en la red..." -ForegroundColor Yellow
$ipconfig = ipconfig | Select-String "IPv4" | Select-String "192.168|10\."
$ips = @()

if ($ipconfig) {
    foreach ($line in $ipconfig) {
        $ip = ($line -split ": ")[1].Trim()
        if ($ip -match '^\d+\.\d+\.\d+\.\d+$') {
            $ips += $ip
            Write-Host "   ✓ IP encontrada: $ip" -ForegroundColor Green
        }
    }
} else {
    Write-Host "   ⚠️  No se encontraron IPs locales. Verifica tu conexión de red." -ForegroundColor Red
    exit 1
}

if ($ips.Count -gt 1) {
    Write-Host ""
    Write-Host "   Múltiples IPs encontradas. Selecciona cuál usar:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $ips.Count; $i++) {
        Write-Host "   [$($i+1)] $($ips[$i])" -ForegroundColor Cyan
    }
    $selection = Read-Host "   Ingresa el número (default: 1)"
    if ([string]::IsNullOrWhiteSpace($selection)) { $selection = 1 }
    $localIp = $ips[[int]$selection - 1]
} else {
    $localIp = $ips[0]
}

Write-Host ""
Write-Host "   ✅ IP seleccionada: $localIp" -ForegroundColor Green

# ─── PASO 2: Verificar que el backend está corriendo ────────────────────────────
Write-Host ""
Write-Host "🔌 Verificando conexión al backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$localIp:3000/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend accesible en http://$localIp:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Backend NO accesible en http://$localIp:3000" -ForegroundColor Red
    Write-Host "   Asegúrate de:" -ForegroundColor Yellow
    Write-Host "      • El backend esté corriendo: npm run dev" -ForegroundColor Yellow
    Write-Host "      • Tu PC esté en la misma red Wi-Fi que el teléfono" -ForegroundColor Yellow
    Write-Host "      • El puerto 3000 no esté bloqueado por firewall" -ForegroundColor Yellow
}

# ─── PASO 3: Crear/Actualizar .env en frontend ─────────────────────────────────
Write-Host ""
Write-Host "📝 Configurando archivo .env en frontend..." -ForegroundColor Yellow

$envPath = ".\frontend\.env"
$envContent = "EXPO_PUBLIC_API_URL=http://$localIp:3000/api"

if (Test-Path $envPath) {
    Write-Host "   Actualizando $envPath" -ForegroundColor Cyan
    $existingContent = Get-Content $envPath -Raw
    if ($existingContent -match "EXPO_PUBLIC_API_URL") {
        $newContent = $existingContent -replace "EXPO_PUBLIC_API_URL=.*", $envContent
    } else {
        $newContent = "$existingContent`n$envContent"
    }
    Set-Content -Path $envPath -Value $newContent -Encoding UTF8
} else {
    Write-Host "   Creando $envPath" -ForegroundColor Cyan
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
}

Write-Host "   ✅ Contenido de .env:" -ForegroundColor Green
Write-Host "      $envContent" -ForegroundColor Cyan

# ─── PASO 4: Instrucciones finales ────────────────────────────────────────────
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ CONFIGURACIÓN COMPLETADA                                  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📱 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  En tu PC (servidor):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2️⃣  En otra terminal (Expo):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Yellow
Write-Host "   npx expo start" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  En tu teléfono:" -ForegroundColor White
Write-Host "   • Abre la app Expo Go" -ForegroundColor Yellow
Write-Host "   • Escanea el QR o ingresa manualmente" -ForegroundColor Yellow
Write-Host "   • Asegúrate de estar en la MISMA RED Wi-Fi" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣  Si aún no funciona:" -ForegroundColor White
Write-Host "   • Verifica que IP: $localIp sea correcta (debe ser 192.168.x.x o 10.x.x.x)" -ForegroundColor Yellow
Write-Host "   • Desactiva firewall temporalmente o abre puerto 3000" -ForegroundColor Yellow
Write-Host "   • Prueba manualmente: abre en navegador del teléfono:" -ForegroundColor Yellow
Write-Host "     http://$localIp:3000/api/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 NOTA: El archivo .env será ignorado en git (seguridad)" -ForegroundColor Magenta
Write-Host ""
