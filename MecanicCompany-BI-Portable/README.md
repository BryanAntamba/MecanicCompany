# 📊 MecanicCompany - Dashboard BI (Portable)

Esta carpeta contiene **TODO** lo necesario para instalar el dashboard de Business Intelligence en otra computadora.

---

## 📦 ¿Qué hay aquí?

✅ **docker-compose.yml** - Configuración de Metabase  
✅ **metabase-backup.tar.gz** - Backup completo (dashboards, usuarios, configuraciones)  
✅ **EXPORTAR_METABASE_OTRA_PC.md** - Instrucciones detalladas paso a paso  
✅ **crear-usuario-readonly.sql** - Script de seguridad para PostgreSQL  

---

## 🚀 INSTALACIÓN RÁPIDA (5 minutos)

### **Requisito:** Docker Desktop instalado
📥 Descargar: https://www.docker.com/products/docker-desktop

### **Paso 1:** Copiar esta carpeta completa a la otra PC

### **Paso 2:** Abrir PowerShell en esta carpeta

### **Paso 3:** Ejecutar estos comandos:

```powershell
# Crear volumen de datos
docker volume create metabase-data

# Restaurar backup
docker run --rm -v metabase-data:/data -v ${PWD}:/backup alpine tar xzf /backup/metabase-backup.tar.gz -C /data

# Iniciar Metabase
docker-compose up -d
```

### **Paso 4:** Esperar 1-2 minutos y abrir navegador

```
http://localhost:3001
```

---

## ✅ ¡Listo!

Deberías ver Metabase con:
- ✅ Tus usuarios configurados
- ✅ Tus dashboards listos
- ✅ Todas las configuraciones guardadas

---

## ⚙️ Configurar PostgreSQL

Metabase necesita conectarse a tu base de datos PostgreSQL.

**En Metabase:**
1. Admin → Databases
2. Editar conexión existente
3. Ajustar **Host** según dónde esté PostgreSQL:
   - Misma PC: `host.docker.internal` (Windows/Mac) o `localhost`
   - Otra PC en red: `192.168.X.X` (IP de esa PC)
   - Puerto: `5432` (por defecto)

---

## 📚 Documentación completa

Ver archivo: **EXPORTAR_METABASE_OTRA_PC.md**

---

## ⚠️ Problemas comunes

**Puerto 3001 ocupado:**
```powershell
# Cambiar en docker-compose.yml:
# "3002:3000" en lugar de "3001:3000"
```

**No conecta a PostgreSQL:**
- Verificar que PostgreSQL esté corriendo
- Ajustar host según ubicación de la BD
- Verificar usuario y contraseña

**Ver logs:**
```powershell
docker logs metabase-mecaniccompany -f
```

---

## 🔄 Comandos útiles

```powershell
# Ver estado
docker ps

# Detener
docker-compose stop

# Iniciar
docker-compose start

# Reiniciar
docker-compose restart

# Ver logs
docker logs metabase-mecaniccompany -f
```

---

**Proyecto:** MecanicCompany Business Intelligence  
**Fecha:** Julio 2026  
**Tecnologías:** Metabase + Docker + PostgreSQL
