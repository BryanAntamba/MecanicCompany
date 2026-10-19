# 🎨 GUÍA DE DISEÑO PROFESIONAL - DASHBOARD BI MECANICCOMPANY

## 🎯 CONCEPTO DE DISEÑO: "TALLER MODERNO PROFESIONAL"

### Paleta de Colores Profesional

```
COLORES PRINCIPALES (Industria Automotriz):
┌─────────────────────────────────────────────────────┐
│ 🔧 AZUL MECÁNICO (Primary)                          │
│    #1E3A8A (Azul oscuro profesional)                │
│    Uso: Headers, KPIs principales, botones          │
├─────────────────────────────────────────────────────┤
│ ⚙️ GRIS METAL (Secondary)                           │
│    #475569 (Gris acero)                             │
│    Uso: Texto secundario, bordes, fondos           │
├─────────────────────────────────────────────────────┤
│ 🟢 VERDE ACTIVO (Success)                           │
│    #16A34A (Verde éxito)                            │
│    Uso: KPIs positivos, completados, disponibles   │
├─────────────────────────────────────────────────────┤
│ 🟡 AMARILLO PRECAUCIÓN (Warning)                    │
│    #F59E0B (Amarillo alerta)                        │
│    Uso: En proceso, pendientes, advertencias       │
├─────────────────────────────────────────────────────┤
│ 🔴 ROJO CRÍTICO (Danger)                            │
│    #DC2626 (Rojo urgente)                           │
│    Uso: KPIs negativos, errores, crítico           │
├─────────────────────────────────────────────────────┤
│ ⚪ BLANCO LIMPIO (Background)                       │
│    #FFFFFF (Blanco puro)                            │
│    Uso: Fondo principal, cards                     │
├─────────────────────────────────────────────────────┤
│ ⬛ GRIS OSCURO (Dark Mode - Opcional)               │
│    #1F2937 (Gris carbón)                            │
│    Uso: Modo oscuro, fondos alternativos           │
└─────────────────────────────────────────────────────┘

GRADIENTES:
├─ Azul: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)
├─ Éxito: linear-gradient(135deg, #16A34A 0%, #22C55E 100%)
└─ Metal: linear-gradient(135deg, #475569 0%, #64748B 100%)
```

---

## 📐 DISEÑO DE DASHBOARDS

### **DASHBOARD 1: VISIÓN GENERAL** 📊

```
┌────────────────────────────────────────────────────────────────┐
│  🔧 MECANICCOMPANY - VISIÓN GENERAL OPERACIONAL               │
│  📅 Junio 2026  |  👤 Admin  |  🔄 Actualizado hace 2 min     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────┐│
│  │ 💰 INGRESOS  │ │ 🔧 SERVICIOS │ │ 🎫 TICKET    │ │ ✅ CONV│
│  │   $52,340    │ │      45      │ │   $1,163     │ │  78%  ││
│  │   +12% ↑     │ │   +5 vs ant  │ │   +$50 ↑     │ │  +3%  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────┘│
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📈 INGRESOS POR MES (Últimos 12 meses)                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 60K ┤                                            ●────●   │ │
│  │ 50K ┤                          ●────●────●──●──●         │ │
│  │ 40K ┤        ●────●────●──●──●                           │ │
│  │ 30K ┤   ●──●                                             │ │
│  │ 20K ┤  ●                                                  │ │
│  │     └─────────────────────────────────────────────────   │ │
│  │      J  F  M  A  M  J  J  A  S  O  N  D                 │ │
│  │      2025 ────────────────── 2026                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│  🖱️ Click en cualquier punto para ver desglose por día       │
│                                                                │
├─────────────────────────────────┬──────────────────────────────┤
│                                 │                              │
│  👷 TOP 5 MECÁNICOS             │  🔧 TIPOS DE SERVICIO       │
│  ┌───────────────────────────┐  │  ┌────────────────────────┐ │
│  │ Juan Pérez    ████████ 12K│  │  │   🔩 Preventivo  35%   │ │
│  │ María López   ██████   10K│  │  │   ⚙️ Motor       25%   │ │
│  │ Carlos Gómez  █████     9K│  │  │   ⚡ Eléctrico   20%   │ │
│  │ Ana Torres    ████      8K│  │  │   🚗 Carrocería  12%   │ │
│  │ Luis Martín   ███       7K│  │  │   🔧 Otros        8%   │ │
│  └───────────────────────────┘  │  └────────────────────────┘ │
│                                 │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

**Elementos de Diseño:**
- ✅ **Logo**: Llave inglesa + engranaje en header
- ✅ **Iconos**: FontAwesome o Material Icons
- ✅ **KPI Cards**: Sombra suave, bordes redondeados
- ✅ **Gráficos**: Colores de la paleta corporativa
- ✅ **Hover**: Tooltips con detalles al pasar mouse
- ✅ **Responsive**: Adaptable a diferentes pantallas

---

### **DASHBOARD 2: PRODUCTIVIDAD DE MECÁNICOS** 👷

```
┌────────────────────────────────────────────────────────────────┐
│  👷 PRODUCTIVIDAD DE MECÁNICOS - JUNIO 2026                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📊 RANKING DE MECÁNICOS (Últimos 30 días)                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ #  MECÁNICO       SERVICIOS  INGRESOS   PROMEDIO  STATUS │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ 🥇 Juan Pérez         45     $12,500    2.3 hrs   🟢     │ │
│  │ 🥈 María López        38     $10,200    2.8 hrs   🟢     │ │
│  │ 🥉 Carlos Gómez       32      $8,900    3.1 hrs   🟢     │ │
│  │ 4  Ana Torres         28      $7,600    2.5 hrs   🟢     │ │
│  │ 5  Luis Martín        25      $6,800    3.4 hrs   🟡     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
├─────────────────────────────────┬──────────────────────────────┤
│                                 │                              │
│  📈 SERVICIOS POR MES           │  ⚡ EFICIENCIA              │
│  ┌───────────────────────────┐  │  ┌────────────────────────┐ │
│  │    [Barras apiladas]      │  │  │  María●                │ │
│  │    Colores por mecánico   │  │  │      ●Ana              │ │
│  │    Con drill down         │  │  │  Juan●   ●Carlos      │ │
│  └───────────────────────────┘  │  │      Luis●            │ │
│                                 │  │  [Scatter: Tiempo/$$]  │ │
│                                 │  └────────────────────────┘ │
├─────────────────────────────────┴──────────────────────────────┤
│                                                                │
│  🗓️ DISPONIBILIDAD SEMANAL (Heatmap)                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │        LUN  MAR  MIÉ  JUE  VIE  SÁB                      │ │
│  │ Juan   ███  ███  ███  ███  ███  ██  (Muy ocupado)        │ │
│  │ María  ███  ██   ███  ██   ███  ███ (Muy ocupado)        │ │
│  │ Carlos ██   ███  ██   ███  ██   ██  (Ocupado)            │ │
│  │ Ana    ██   ██   ███  ██   ███  █   (Medio)              │ │
│  │ Luis   █    ██   ██   ██   ██   ███ (Variable)           │ │
│  └──────────────────────────────────────────────────────────┘ │
│  🎨 Color: Verde oscuro = 5+ servicios, Amarillo = 2-4, etc. │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- 🏆 **Medallas**: Para top 3 mecánicos
- 🟢🟡🔴 **Status**: Visual del estado
- 📊 **Barras apiladas**: Colores corporativos
- 🎨 **Heatmap**: Gradiente verde (alto) → amarillo → rojo (bajo)

---

### **DASHBOARD 3: ANÁLISIS FINANCIERO** 💰

```
┌────────────────────────────────────────────────────────────────┐
│  💰 ANÁLISIS FINANCIERO - JUNIO 2026                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────┐│
│  │ 💵 MANO OBRA │ │ 🔩 REPUESTOS │ │ 📈 CREC. MoM │ │ 🎯 META│
│  │   $34,021    │ │   $18,319    │ │     +12%     │ │  95%  ││
│  │   65% total  │ │   35% total  │ │   vs mayo    │ │  🟢   ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────┘│
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📊 EMBUDO DE CONVERSIÓN                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Solicitudes Recibidas    100 ████████████████████ 100% │ │
│  │  Solicitudes Asignadas     85 ████████████████     85%  │ │
│  │  En Proceso                75 ██████████████       75%  │ │
│  │  Completadas               70 █████████████        70%  │ │
│  │                                                           │ │
│  │  ⚠️ Pérdida 15%: Falta de mecánicos disponibles         │ │
│  │  ⚠️ Pérdida 10%: Clientes cancelan                      │ │
│  │  ⚠️ Pérdida 5%: Servicios en curso                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
├─────────────────────────────────┬──────────────────────────────┤
│                                 │                              │
│  📈 INGRESOS POR TIPO SERVICIO  │  💸 COSTOS VS TIEMPO        │
│  ┌───────────────────────────┐  │  ┌────────────────────────┐ │
│  │ Preventivo    ████████ 18K│  │  │ [Línea dual]           │ │
│  │ Motor         ██████   13K│  │  │ Azul: Mano obra        │ │
│  │ Eléctrico     █████    10K│  │  │ Naranja: Repuestos     │ │
│  │ Carrocería    ███       6K│  │  │ Últimos 12 meses       │ │
│  │ Otros         ██        4K│  │  └────────────────────────┘ │
│  └───────────────────────────┘  │                              │
│  🖱️ Click para drill down      │                              │
│                                 │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

**Elementos:**
- 📊 **Embudo**: Barras horizontales con degradado
- ⚠️ **Alertas**: Insights de pérdidas
- 📈 **Dual axis**: Dos líneas con leyenda clara
- 🎯 **Metas**: Indicador visual de cumplimiento

---

### **DASHBOARD 4: CLIENTES Y VEHÍCULOS** 🚗

```
┌────────────────────────────────────────────────────────────────┐
│  🚗 ANÁLISIS DE CLIENTES Y VEHÍCULOS                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🏆 TOP 10 MARCAS MÁS ATENDIDAS                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🚗 Toyota      ████████████████████████████████  45     │ │
│  │  🚙 Chevrolet   ████████████████████████          38     │ │
│  │  🚘 Honda       ████████████████████              32     │ │
│  │  🚗 Mazda       ████████████████                  25     │ │
│  │  🚙 Nissan      ██████████████                    22     │ │
│  │  🚘 Ford        ████████████                      18     │ │
│  │  🚗 Hyundai     ██████████                        15     │ │
│  │  🚙 Kia         ████████                          12     │ │
│  │  🚘 Volkswagen  ██████                            10     │ │
│  │  🚗 Renault     ████                               8     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
├─────────────────────────────────┬──────────────────────────────┤
│                                 │                              │
│  👥 CLIENTES RECURRENTES        │  📅 DEMANDA SEMANAL         │
│  ┌───────────────────────────┐  │  ┌────────────────────────┐ │
│  │ CLIENTE      SERV  GASTO  │  │  │ Lun ████ 12 solicitudes│ │
│  ├───────────────────────────┤  │  │ Mar █████ 15           │ │
│  │ ⭐Pedro Ruiz   8   $9,200│  │  │ Mié ██████ 18          │ │
│  │ ⭐Laura Gómez  7   $8,100│  │  │ Jue ████ 12            │ │
│  │ ⭐Juan Silva   6   $7,300│  │  │ Vie ███████ 20 (PICO)  │ │
│  │ Ana Pérez      5   $5,800│  │  │ Sáb █████ 16           │ │
│  │ Carlos López   5   $5,200│  │  └────────────────────────┘ │
│  └───────────────────────────┘  │  📊 Patrón: Viernes alto   │
│  ⭐ = VIP (5+ servicios)        │                              │
│                                 │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

**Elementos:**
- 🚗 **Iconos de autos**: Por marca
- ⭐ **Badges VIP**: Para clientes frecuentes
- 📊 **Barras con iconos**: Representación visual
- 📅 **Heatmap temporal**: Para identificar patrones

---

## 🎨 ELEMENTOS VISUALES PROFESIONALES

### **Tipografía:**
```
Headers: 'Inter', 'Segoe UI', sans-serif (Bold)
Body: 'Inter', 'Roboto', sans-serif (Regular)
Números: 'Roboto Mono', monospace (para KPIs)
Tamaño base: 14px
```

### **Espaciado:**
```
Padding cards: 20px
Margen entre secciones: 24px
Bordes redondeados: 8px
Sombras: 0 2px 8px rgba(0,0,0,0.1)
```

### **Iconografía:**
```
Biblioteca: Font Awesome 6
Tamaño: 24px (KPIs), 16px (inline)
Colores: Según contexto (verde=positivo, rojo=negativo)
```

### **Animaciones:**
```
Hover en cards: transform: scale(1.02)
Transiciones: 0.2s ease-in-out
Loading: Spinner con logo de engranaje
```

---

## 📱 RESPONSIVE DESIGN

### **Desktop (1920px):**
- 4 KPIs en fila horizontal
- Gráficos grandes, 2 columnas
- Sidebar con filtros

### **Laptop (1366px):**
- 4 KPIs en fila (más pequeños)
- Gráficos en 2 columnas
- Filtros colapsables

### **Tablet (768px):**
- 2 KPIs por fila
- Gráficos full width
- Menú hamburguesa

---

## 🎯 ACCESIBILIDAD

- ✅ **Contraste**: WCAG AA (4.5:1 mínimo)
- ✅ **Texto alternativo**: En todos los gráficos
- ✅ **Navegación por teclado**: Tab order lógico
- ✅ **Screen readers**: Labels descriptivos

---

## 🔧 PERSONALIZACIÓN EN METABASE

### **Logo Corporativo:**
1. Subir logo: Admin → Settings → Appearance
2. Formato: PNG transparente, 200x60px
3. Ubicación: Header superior izquierda

### **Colores Personalizados:**
```json
{
  "primary": "#1E3A8A",
  "secondary": "#475569",
  "success": "#16A34A",
  "warning": "#F59E0B",
  "danger": "#DC2626",
  "background": "#FFFFFF",
  "text": "#1F2937"
}
```

### **Fuentes:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
```

---

## 📊 EJEMPLO DE DASHBOARD COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔧 MECANICCOMPANY BI        📅 06 Jul 2026  👤 Admin  🔔 3     │
├─────────────────────────────────────────────────────────────────┤
│ 📊 Visión General | 👷 Productividad | 💰 Financiero | 🚗 Clientes│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [CONTENIDO DEL DASHBOARD SEGÚN LA PESTAÑA SELECCIONADA]      │
│                                                                 │
│  Filtros: 📅 Últimos 30 días  👷 Todos  🔧 Todos servicios    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Footer: Última actualización: 14:35 | Datos: 1,234 registros  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE DISEÑO

- [x] Paleta de colores definida
- [x] Tipografía seleccionada
- [x] Iconografía consistente
- [x] Grid system establecido
- [x] Responsive breakpoints
- [x] Accesibilidad WCAG AA
- [x] Estados hover/active
- [x] Animaciones sutiles
- [x] Loading states
- [x] Error states

---

**🎨 Este diseño combina:**
- ✅ Profesionalismo (colores corporativos)
- ✅ Industria (iconografía mecánica)
- ✅ Usabilidad (jerarquía visual clara)
- ✅ Modernidad (diseño limpio y espacioso)
