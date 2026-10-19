// Componente Image optimizado de expo-image: soporta caché, placeholders y formatos modernos
import { Image } from 'expo-image';

// expo-asset: resuelve la URI local de assets del bundle
import { Asset } from 'expo-asset';

// FileSystem y Sharing: versiones compatibles con web
import * as FileSystem from '@/utils/fileSystem';
import * as Sharing from '@/utils/sharing';

// MapView: mapa compatible con web y móvil
import MapView, { Marker } from '@/components/MapView';

// Video player: compatible con web y móvil
import { Video, ResizeMode } from '@/utils/video';

// FontAwesome para íconos vectoriales
import { FontAwesome } from '@expo/vector-icons';

// Linking para abrir Google Maps externo
import { Linking, Platform } from 'react-native';

// Hooks de React:
// - useEffect: ejecuta efectos secundarios (timers, animaciones) después del render
// - useRef: referencia mutable a un elemento del DOM o un valor persistente sin re-render
// - useState: maneja el estado local del componente
// - useCallback: memoriza funciones para evitar recrearlas en cada render
import { useEffect, useRef, useState, useCallback } from 'react';

// Context del cliente para verificar sesión
import { useCliente } from '@/context/ClienteContext';

// Context de autenticación para logout
import { useAuth } from '@/context/AuthContext';

// useLocalSearchParams: lee parámetros de la URL de la ruta actual (ej: scrollTo=about)
// useFocusEffect: ejecuta código cada vez que la pantalla gana foco (útil para limpiar estado)
import { useLocalSearchParams, useFocusEffect } from 'expo-router';

// Componentes y APIs de React Native:
import {
  Alert,                   // Muestra diálogos/alertas nativas del sistema operativo
  Animated,                // API para crear animaciones fluidas con valores animados
  BackHandler,             // Maneja el botón de retroceso del dispositivo
  Dimensions,              // Permite obtener las dimensiones de la pantalla del dispositivo
  Modal,                   // Componente para mostrar contenido sobre toda la pantalla
  NativeScrollEvent,       // Tipo TypeScript: evento nativo de scroll
  NativeSyntheticEvent,    // Tipo TypeScript: envuelve eventos nativos de React Native
  Pressable,               // Componente táctil que detecta pulsaciones (reemplaza TouchableOpacity)
  ScrollView,              // Vista con scroll vertical u horizontal
  Text,                    // Componente para mostrar texto
  TextInput,               // Campo de entrada de texto para formularios
  View,                    // Contenedor genérico (equivalente a un <div> en web)
} from 'react-native';

// Nota: Animated sigue importado porque se usa en el carrusel hero

// Importa el objeto de estilos centralizado desde la carpeta Styles
// El alias '@/' apunta a la raíz del proyecto (configurado en tsconfig.json)
import styles from '@/Styles/pantallaCliente';

// Importa las funciones de validación reutilizables
import {
  validarDosPalabras,
  validarCuatroPalabras,
  validarSoloTexto,
  validarTelefono,
  validarCorreoGmail,
  validarTextoYNumeros,
  validarSoloNumeros,
  validarAño,
  validarPlaca,
  validarObligatorio,
  validarEspecialidadOServicio,
} from '@/utils/validaciones';

// API de backend
import { authApi, solicitudesApi } from '@/utils/api';

// Sistema de provincias y mecánicas de Ecuador
import { PROVINCIAS_ECUADOR, obtenerMecanicasPorProvincia, obtenerMecanicaPorId, type ProvinciaEcuador } from '@/utils/provinciasEcuador';

// Funciones de disponibilidad de citas
import { obtenerDisponibilidadDia, obtenerHorasOcupadasPorFecha, obtenerEstadoDisponibilidadHora, obtenerNivelDisponibilidadDia } from '@/utils/datosSimulados';

// Componente reutilizable de la barra de navegación del cliente
import NavbarCliente from '@/components/navbarCliente/navbarCliente';

// Componente footer del cliente
// import FooterCliente from '@/components/footerCliente/footerCliente'; // Ya no se necesita

// ResponsiveContainer para diseño responsive
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

// Modales del flujo de solicitud
import VerificacionFormulario from './ModalFormularioSolicitud/verificacionFormulario';
import ConfirmacionSolicitud from './ModalFormularioSolicitud/confirmacionSolicitud';

// Ancho fijo de cada tarjeta del carrusel "Nosotros"
// En web es más grande para mejor visualización
// Función para calcular dinámicamente según pantalla
const getCardWidth = (windowWidth: number): number => {
  if (Platform.OS !== 'web') return 260;
  if (windowWidth <= 480) return 240;
  if (windowWidth <= 640) return 260;
  if (windowWidth >= 1440) return 420;
  if (windowWidth >= 1024) return 380;
  if (windowWidth >= 768) return 360;
  return 340;
};

const CARD_WIDTH = Platform.OS === 'web' ? 340 : 260;
// Margen derecho entre tarjetas
const CARD_MARGIN = 16;
// Ancho total que ocupa cada "slot" en el carrusel
const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Tarjetas de la sección Nosotros con texto ampliado
const aboutCards = [
  {
    title: 'Nosotros',
    text: 'Somos una plataforma digital innovadora que facilitamos la solicitud de mantenimiento vehicular desde tu móvil, con seguimiento en tiempo real de tu servicio. Nuestra app te permite agendar citas, elegir ubicación, recibir reportes detallados y facturas electrónicas directamente en tu correo.',
  },
  {
    title: 'Misión',
    text: 'Revolucionar el mantenimiento automotriz mediante tecnología accesible y transparente. Conectamos clientes con mecánicos profesionales a través de una app intuitiva que permite solicitar servicios que se desea, hacer seguimiento en tiempo real, y recibir reportes completos con costos de repuestos utilizados.',
  },
  {
    title: 'Visión',
    text: 'Ser la aplicación líder en gestión vehicular, donde cada conductor pueda solicitar mantenimiento con un solo toque, rastrear el estado de su vehículo en tiempo real, recibir reportes profesionales con factura digital, y acceder a un historial completo de servicios solicitados en el seguimiento vehicular. Tu mecánico de confianza, siempre disponible en tu móvil.',
  },
];

// Array con las rutas de las imágenes del carrusel hero
// require() carga los assets en tiempo de compilación (bundle)
const slideImages = [
  require('../../assets/images/fondo1.png'), // Imagen del slide 1
  require('../../assets/images/fondo2.png'), // Imagen del slide 2
  require('../../assets/images/fondo3.png'), // Imagen del slide 3
];

// Array de mensajes correspondientes a cada slide del carrusel
// El índice de cada mensaje coincide con el índice de su imagen en slideImages
const slideMessages = [
  'Bienvenido a Mecanic Company',          // Mensaje del slide 1
  'Solicita tu servicio ahora', // Mensaje del slide 2
  'Tu vehículo en manos expertas',         // Mensaje del slide 3
];

/**
 * Componente principal de la pantalla de inicio.
 * Es exportado como default para que Expo Router lo use como ruta raíz de la pestaña.
 */
export default function HomeScreen() {
  
  // Obtener estado de sesión del cliente
  const { estaLogueado, correoCliente, nombreCliente, telefonoCliente } = useCliente();
  const { logout } = useAuth();

  // Estado: índice del slide activo en el carrusel (0 = primero)
  const [activeSlide, setActiveSlide] = useState(0);

  // Estado: posición Y de la sección "Nosotros", usada para hacer scroll hasta ella
  const [aboutPosition, setAboutPosition] = useState(0);

  // Estado: posición Y del formulario para scroll directo desde el botón del hero
  const [formPosition, setFormPosition] = useState(0);

  // Estado y animación para el logo del video de fondo
  const [videoBgPosition, setVideoBgPosition] = useState(0);
  const videoBgLogoOpacity = useRef(new Animated.Value(0)).current;
  const videoBgLogoScale = useRef(new Animated.Value(0.6)).current;
  const videoBgLogoTriggered = useRef(false);

  const triggerVideoBgLogo = () => {
    if (videoBgLogoTriggered.current) return;
    videoBgLogoTriggered.current = true;
    Animated.parallel([
      Animated.timing(videoBgLogoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(videoBgLogoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  // Estado: posición Y exacta de las cards del carrusel (justo debajo del logo y vehículos)
  const [cardsPosition, setCardsPosition] = useState(0);

  // Estado: índice activo del carrusel de tarjetas "Nosotros" (inicia en 1 = Misión, la central)
  const [aboutIndex, setAboutIndex] = useState(1);

  // Estado: ancho real del contenedor del carrusel "Nosotros" (para calcular padding de centrado)
  const [carouselWidth, setCarouselWidth] = useState(() => {
    return Dimensions.get('window').width;
  });

  // Estado: ancho actual del área hero (se actualiza con onLayout para soporte responsive)
  const [heroWidth, setHeroWidth] = useState(() => {
    return Dimensions.get('window').width;
  });

  // Estado: ancho de la ventana para el carrusel de vehículos
  const [windowWidth, setWindowWidth] = useState(() => {
    return Dimensions.get('window').width;
  });

  // Estado: controla si el video debe estar trabado (pausado en un frame)
  // En web escritorio (>768px) el video se traba, en responsive y móvil se reproduce normal
  const [isVideoFrozen, setIsVideoFrozen] = useState(() => {
    if (Platform.OS !== 'web') return false;
    return Dimensions.get('window').width > 768;
  });

  // Ref al Video de fondo para controlar su reproducción
  const videoRef = useRef<any>(null);

  // Estado: fuerza actualización del carrusel cuando cambia el tamaño en web
  const [carouselKey, setCarouselKey] = useState(0);

  // Listener para actualizar anchos cuando cambia el tamaño de ventana
  useEffect(() => {
    const updateDimensions = () => {
      const width = Dimensions.get('window').width;
      setCarouselWidth(width);
      setHeroWidth(width);
      setWindowWidth(width);
      
      // Actualizar estado del video: trabado en escritorio (>768px), normal en responsive/móvil
      if (Platform.OS === 'web') {
        setIsVideoFrozen(width > 768);
        // Forzar actualización del carrusel en web cuando cambia el tamaño
        setCarouselKey(prev => prev + 1);
      }
    };

    // Escuchar cambios de dimensiones
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => subscription?.remove();
  }, []);

  // Efecto para resetear el scroll del carrusel de vehículos cuando cambia windowWidth
  useEffect(() => {
    if (Platform.OS === 'web' && vehicleSliderRef.current && windowWidth > 0) {
      // Resetear al primer slide cuando cambia el tamaño
      const timer = setTimeout(() => {
        vehicleSliderRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [windowWidth]);

  // Efecto para controlar la reproducción del video según el tamaño de pantalla
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current) {
      const timer = setTimeout(() => {
        if (isVideoFrozen) {
          // Pausar el video en escritorio y posicionarlo en el primer frame
          videoRef.current.pauseAsync?.().then(() => {
            videoRef.current.setPositionAsync?.(0);
          });
        } else {
          // Reproducir el video en responsive/móvil
          videoRef.current.playAsync?.();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVideoFrozen]);

  // Opciones del selector de tipo de servicio
  const serviceOptions = [
    'Cambio de aceite',
    'Frenos',
    'Suspensión',
    'Motor',
    'Electricidad',
    'Aire acondicionado',
    'Revisión general',
    'Otro',
  ];

  // Estado: objeto con todos los campos del formulario de solicitud
  const [form, setForm] = useState({
    name: '',         // Nombre completo del cliente
    phone: '',        // Teléfono de contacto
    email: '',        // Correo electrónico
    brand: '',        // Marca del vehículo
    model: '',        // Modelo del vehículo
    year: '',         // Año del vehículo
    plate: '',        // Placa del vehículo
    mileage: '',      // Kilometraje del vehículo
    service: '',      // Tipo de servicio seleccionado
    otherService: '', // Descripción si el servicio es "Otro"
    details: '',      // Descripción del problema
  });

  // Estado: controla si el dropdown de tipo de servicio está abierto
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // Estados de error del formulario — uno por campo
  const [errName, setErrName] = useState('');
  const [errPhone, setErrPhone] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errBrand, setErrBrand] = useState('');
  const [errModel, setErrModel] = useState('');
  const [errYear, setErrYear] = useState('');
  const [errPlate, setErrPlate] = useState('');
  const [errMileage, setErrMileage] = useState('');
  const [errService, setErrService] = useState('');
  const [errOther, setErrOther] = useState('');
  const [errDetails, setErrDetails] = useState('');
  const [errDate, setErrDate] = useState('');
  const [errTime, setErrTime] = useState('');

  // Estado: fecha seleccionada para la cita
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  // Estado: hora seleccionada para la cita
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  // Estado: motivo de emergencia (solo para domingos)
  const [motivoEmergencia, setMotivoEmergencia] = useState('');
  // Estado: error de validación del motivo de emergencia
  const [errMotivoEmergencia, setErrMotivoEmergencia] = useState('');
  // Estado: controla si el modal del calendario está visible
  const [calendarVisible, setCalendarVisible] = useState(false);
  // Estado: controla si el dropdown de hora está abierto
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  // Estado: ubicación de mecánica seleccionada
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  // Estado: controla si el dropdown de ubicación está abierto
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  // Estado: error de validación de ubicación
  const [errLocation, setErrLocation] = useState('');

  // Estado: provincia seleccionada
  const [selectedProvincia, setSelectedProvincia] = useState<ProvinciaEcuador | ''>('');
  // Estado: controla si el dropdown de provincia está abierto
  const [provinciaDropdownOpen, setProvinciaDropdownOpen] = useState(false);
  // Estado: error de validación de provincia
  const [errProvincia, setErrProvincia] = useState('');

  // ─── Estados de los nuevos modales de solicitud ──────────────────────────
  const [verificacionVisible, setVerificacionVisible] = useState(false);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);

  // Ref al ScrollView principal de la página (para hacer scroll programático a secciones)
  const scrollRef = useRef<ScrollView>(null);

  // Dispara la animación del logo del video al montar — la sección es visible sin hacer scroll
  useEffect(() => {
    const t = setTimeout(() => triggerVideoBgLogo(), 300);
    return () => clearTimeout(t);
  }, []);

  // Manejo del botón de retroceso: cierra la app y logout (solo en móvil)
  // En web, bloquear retroceso en index para no volver a auth después de logout o cambio contraseña
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') {
        // Bloquear retroceso en web desde la pantalla principal
        const handlePopState = (e: PopStateEvent) => {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        };
        
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        logout();
        BackHandler.exitApp();
        return true;
      });
      return () => backHandler.remove();
    }, [logout]),
  );

  // Lee parámetros de la ruta — Contactanos pasa scrollTo='about' para navegar a Nosotros
  const { scrollTo } = useLocalSearchParams<{ scrollTo?: string }>();

  // Cuando se recibe scrollTo='about' o 'cards' hace scroll a las cards del carrusel Nosotros
  useEffect(() => {
    if ((scrollTo === 'about' || scrollTo === 'cards') && cardsPosition > 0) {
      const t = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: cardsPosition, animated: true });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [scrollTo, cardsPosition]);

  // Controla si la animación del logo ya fue disparada (para que solo ocurra una vez)
  const logoAnimTriggered = useRef(false);

  // Dispara la animación de entrada del logo: fade-in + scale de 0.5 a 1.0
  const triggerLogoAnim = () => {
    if (logoAnimTriggered.current) return; // Solo se ejecuta una vez
    logoAnimTriggered.current = true;
    Animated.parallel([
      // Animación de opacidad: 0 → 1 en 600ms
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Manejador del scroll principal: detecta cuando las secciones entran en pantalla
  const onMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const screenHeight = Dimensions.get('window').height;

    // Anima el logo cuando la sección nosotros entra en pantalla
    if (scrollY + screenHeight > aboutPosition + 80) {
      triggerLogoAnim();
    }
    // Anima el logo del video cuando entra en pantalla
    if (scrollY + screenHeight > 200) {
      triggerVideoBgLogo();
    }
    // Anima el hammer cuando el usuario ha bajado suficiente para verlo
    if (aboutPosition > 0 && scrollY + screenHeight > aboutPosition + 600) {
      triggerHammerAnim();
    }
  };

  // Ref al ScrollView horizontal del carrusel (para avanzar slides programáticamente)
  const sliderRef = useRef<ScrollView>(null);

  // Valor animado que rastrea la posición X del scroll del carrusel (0 en el slide 1)
  const scrollX = useRef(new Animated.Value(0)).current;

  // heroTextOpacity ya no se usa — los títulos usan interpolación de scrollX directamente

  // Los títulos usan interpolación directa de scrollX — sin estado ni animaciones separadas

  // Calcula el CARD_WIDTH actual según el ancho de pantalla
  const currentCardWidth = Platform.OS === 'web' ? getCardWidth(windowWidth) : CARD_WIDTH;
  const CURRENT_ITEM_WIDTH = currentCardWidth + CARD_MARGIN;

  // Valor animado que rastrea el scroll X del carrusel de tarjetas "Nosotros"
  // Inicia en ITEM_WIDTH para que la tarjeta central (Misión, índice 1) quede activa al inicio
  const aboutScrollX = useRef(new Animated.Value(ITEM_WIDTH)).current;

  // useEffect para actualizar aboutScrollX cuando cambia el tamaño de pantalla
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Actualiza aboutScrollX para mantener el índice actual centrado
      aboutScrollX.setValue(aboutIndex * CURRENT_ITEM_WIDTH);
    }
  }, [CURRENT_ITEM_WIDTH]);

  // Valor animado para la animación de entrada del logo (opacidad + escala)
  // Inicia en 0 (invisible) y se anima a 1 cuando la sección entra en pantalla
  const logoAnim = useRef(new Animated.Value(0)).current;

  // Ref al Animated.ScrollView del carrusel "Nosotros" para scroll programático con las flechas
  const aboutSliderRef = useRef<any>(null);

  // useEffect para centrar el carrusel de tarjetas en "Misión" al iniciar
  useEffect(() => {
    if (aboutSliderRef.current) {
      // Pequeño delay para asegurar que el layout esté listo
      const timer = setTimeout(() => {
        // Solo hacer scroll inicial si no se ha cambiado el índice manualmente
        if (aboutIndex === 1) {
          aboutSliderRef.current?.scrollTo({ x: CURRENT_ITEM_WIDTH, y: 0, animated: false });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [CURRENT_ITEM_WIDTH]);

  // useEffect para recentrar el carrusel cuando cambia el tamaño de pantalla
  useEffect(() => {
    if (Platform.OS === 'web' && aboutSliderRef.current) {
      // Delay más largo para que el key force el re-mount completo
      const timer = setTimeout(() => {
        // Recalcula la posición del scroll según el índice actual y nuevo tamaño
        const newScrollX = aboutIndex * CURRENT_ITEM_WIDTH;
        aboutSliderRef.current?.scrollTo({ x: newScrollX, y: 0, animated: false });
        // Actualiza el valor animado también para mantener sincronía
        aboutScrollX.setValue(newScrollX);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [carouselKey, CURRENT_ITEM_WIDTH]);

  // Valores animados para la imagen HammerSobreSaliendo
  // Entra desde la derecha (translateX positivo alto) hacia el borde derecho (0), de invisible a visible
  const hammerOpacity = useRef(new Animated.Value(0)).current;
  const hammerTranslateX = useRef(new Animated.Value(Platform.OS === 'web' ? 800 : 400)).current;
  const hammerTriggered = useRef(false);

  // Reinicia la posición del hammer cuando cambia el tamaño de pantalla
  useEffect(() => {
    if (Platform.OS === 'web' && !hammerTriggered.current) {
      let initialX = 500;
      if (windowWidth <= 640) initialX = 400;
      else if (windowWidth >= 1440) initialX = 800;
      else if (windowWidth >= 1024) initialX = 700;
      else if (windowWidth >= 768) initialX = 600;
      hammerTranslateX.setValue(initialX);
    }
  }, [windowWidth]);

  // Posición Y de la imagen del hammer (para detectar cuándo entra en pantalla)
  const [hammerPosition, setHammerPosition] = useState(0);

  // Dispara la animación del hammer cuando entra en pantalla
  const triggerHammerAnim = () => {
    if (hammerTriggered.current) return;
    hammerTriggered.current = true;
    Animated.parallel([
      Animated.timing(hammerOpacity, {
        toValue: 1,
        duration: 1800,      // Lento: 1.8 segundos
        useNativeDriver: true,
      }),
      Animated.timing(hammerTranslateX, {
        toValue: 0,
        duration: 1800,      // Lento: 1.8 segundos
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Ref al ScrollView del carrusel de vehículos para avanzar slides programáticamente
  const vehicleSliderRef = useRef<ScrollView>(null);
  // Índice activo del carrusel de vehículos
  const [vehicleActive, setVehicleActive] = useState(0);

  // Imágenes del carrusel de vehículos duplicadas para simular loop infinito:
  // [destrozado, buenEstado, destrozado, buenEstado] — al llegar al final
  // se resetea silenciosamente al inicio sin que el usuario lo note
  const vehicleImages = [
    require('../../assets/images/vehiculoDestrosado.png'),
    require('../../assets/images/VehiculoBuenEstado.png'),
    require('../../assets/images/vehiculoDestrosado.png'),
    require('../../assets/images/VehiculoBuenEstado.png'),
  ];

  // Efecto: avanza el carrusel de vehículos cada 10 segundos siempre hacia adelante
  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;

      // Usar windowWidth para el scroll del carrusel de vehículos
      if (currentIndex >= vehicleImages.length - 1) {
        // Avanza al penúltimo slide con animación
        vehicleSliderRef.current?.scrollTo({ x: currentIndex * windowWidth, animated: true });
        setVehicleActive(currentIndex % 2);

        // Después de la animación, resetea silenciosamente al primer slide equivalente
        setTimeout(() => {
          currentIndex = currentIndex % 2;
          vehicleSliderRef.current?.scrollTo({ x: currentIndex * windowWidth, animated: false });
        }, 700);
      } else {
        vehicleSliderRef.current?.scrollTo({ x: currentIndex * windowWidth, animated: true });
        setVehicleActive(currentIndex % 2);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [windowWidth]); // Dependencia: windowWidth

  // Formatea una fecha como "lun, 12 ene 2026"
  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  // Estado: mes/año que se está mostrando en el calendario (navegar entre meses)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1); // Primer día del mes actual
  });

  // Genera la cuadrícula de días del mes visible en el calendario
  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay(); // 0=Dom, 1=Lun...
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Rellena con null los días vacíos antes del día 1
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  // Genera opciones de hora dinámicamente basado en el día seleccionado
  const timeOptions: string[] = (() => {
    const opts: string[] = [];
    
    if (!appointmentDate) {
      // Si no hay fecha seleccionada, mostrar horario completo entre semana (7:00 - 20:00)
      for (let h = 7; h <= 20; h++) {
        opts.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < 20) opts.push(`${h.toString().padStart(2, '0')}:30`);
      }
      return opts;
    }
    
    const dayOfWeek = appointmentDate.getDay(); // 0 = Domingo, 6 = Sábado
    
    if (dayOfWeek === 6) {
      // Sábado: solo hasta 12:00
      for (let h = 7; h <= 12; h++) {
        opts.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < 12) opts.push(`${h.toString().padStart(2, '0')}:30`);
      }
    } else if (dayOfWeek === 0) {
      // Domingo: solo hasta 12:00
      for (let h = 7; h <= 12; h++) {
        opts.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < 12) opts.push(`${h.toString().padStart(2, '0')}:30`);
      }
    } else {
      // Entre semana (Lunes a Viernes): hasta 20:00
      for (let h = 7; h <= 20; h++) {
        opts.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < 20) opts.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Ahora NO filtramos, mostramos todas las horas con colores
    return opts;
  })();

  // Obtener el estado de disponibilidad para cada hora
  const getHoraDisponibilidad = (hora: string) => {
    if (!appointmentDate) return { disponible: true, nivel: 'verde' as const, reservas: 0 };
    return obtenerEstadoDisponibilidadHora(appointmentDate, hora);
  };

  // Navega el carrusel "Nosotros" al índice indicado con animación suave
  const scrollAboutTo = (index: number) => {
    // Limita el índice entre 0 y el último elemento
    const clamped = Math.max(0, Math.min(index, aboutCards.length - 1));
    setAboutIndex(clamped);
    // Hace scroll programático al offset exacto de esa tarjeta usando el ancho actual
    aboutSliderRef.current?.scrollTo({ x: clamped * CURRENT_ITEM_WIDTH, animated: true });
  };

  // Efecto para validar y limpiar la hora seleccionada si cambia la fecha
  useEffect(() => {
    if (appointmentDate && appointmentTime) {
      const horasOcupadas = obtenerHorasOcupadasPorFecha(appointmentDate);
      if (horasOcupadas.includes(appointmentTime)) {
        setAppointmentTime(null);
        setErrTime('La hora seleccionada ya no está disponible para esta fecha.');
      }
    }
  }, [appointmentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => {
        const next = (current + 1) % slideImages.length;
        sliderRef.current?.scrollTo({ x: next * heroWidth, animated: true });
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [heroWidth]);

  // Limpiar validaciones y campos cada vez que la pantalla gana foco (cuando se regresa de otra pantalla)
  useFocusEffect(
    useCallback(() => {
      // Limpiar todos los campos del formulario pero mantener nombre, correo y teléfono del cliente
      setForm({ 
        name: nombreCliente || '', 
        phone: telefonoCliente || '', 
        email: correoCliente || '', 
        brand: '', 
        model: '', 
        year: '', 
        plate: '', 
        mileage: '', 
        service: '', 
        otherService: '', 
        details: '' 
      });
      setAppointmentDate(null);
      setAppointmentTime(null);
      setSelectedLocation(null);
      setSelectedProvincia('');
      setServiceDropdownOpen(false);
      setLocationDropdownOpen(false);
      setProvinciaDropdownOpen(false);
      
      // Limpiar todas las validaciones
      setErrBrand(''); setErrModel(''); setErrYear(''); setErrPlate(''); setErrMileage('');
      setErrService(''); setErrOther(''); setErrDetails(''); setErrDate(''); setErrTime(''); 
      setErrProvincia(''); setErrLocation(''); setMotivoEmergencia(''); setErrMotivoEmergencia('');
    }, [nombreCliente, correoCliente, telefonoCliente])
  );

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', brand: '', model: '', year: '', plate: '', mileage: '', service: '', otherService: '', details: '' });
    setAppointmentDate(null);
    setAppointmentTime(null);
    setSelectedLocation(null);
    setSelectedProvincia('');
    setMotivoEmergencia('');
    setServiceDropdownOpen(false);
    setLocationDropdownOpen(false);
    setProvinciaDropdownOpen(false);
    setErrBrand(''); setErrModel(''); setErrYear(''); setErrPlate(''); setErrMileage('');
    setErrService(''); setErrOther(''); setErrDetails(''); setErrDate(''); setErrTime(''); 
    setErrProvincia(''); setErrLocation(''); setErrMotivoEmergencia('');
  };

  const onSend = async () => {
    // Valida cada campo y guarda el error en su estado individual
    const eBrand = validarSoloTexto(form.brand, 'La marca');
    const eModel = validarTextoYNumeros(form.model, 'El modelo');
    const eYear = validarAño(form.year);
    const ePlate = validarPlaca(form.plate);
    const eMileage = validarSoloNumeros(form.mileage, 'El kilometraje');
    const eService = validarObligatorio(form.service, 'El tipo de servicio');
    const eOther = form.service === 'Otro' ? validarEspecialidadOServicio(form.otherService, 'servicio') : null;
    const eDetails = validarTextoYNumeros(form.details, 'La descripción del problema');
    const eDate = !appointmentDate ? 'La fecha de la cita es obligatoria.' : null;
    const eTime = !appointmentTime ? 'La hora de la cita es obligatoria.' : null;
    const eProvincia = !selectedProvincia ? 'La provincia es obligatoria.' : null;
    const eLocation = !selectedLocation ? 'La ubicación de la mecánica es obligatoria.' : null;
    
    // Validar motivo de emergencia solo si es domingo
    const isDomingo = appointmentDate && appointmentDate.getDay() === 0;
    const eMotivoEmergencia = isDomingo && !motivoEmergencia.trim() 
      ? 'El motivo de emergencia es obligatorio para reservas en domingo.' 
      : null;

    setErrBrand(eBrand ?? '');
    setErrModel(eModel ?? '');
    setErrYear(eYear ?? '');
    setErrPlate(ePlate ?? '');
    setErrMileage(eMileage ?? '');
    setErrService(eService ?? '');
    setErrOther(eOther ?? '');
    setErrDetails(eDetails ?? '');
    setErrDate(eDate ?? '');
    setErrTime(eTime ?? '');
    setErrMotivoEmergencia(eMotivoEmergencia ?? '');
    setErrProvincia(eProvincia ?? '');
    setErrLocation(eLocation ?? '');

    // Si hay algún error, no continúa
    const errores = [eBrand, eModel, eYear, ePlate, eMileage, eService, eOther, eDetails, eDate, eTime, eProvincia, eLocation, eMotivoEmergencia].filter(Boolean);
    if (errores.length > 0) {
      // Scroll hacia arriba para que vea los errores en rojo
      scrollRef.current?.scrollTo({ y: formPosition - 100, animated: true });
      return;
    }

    // Todo válido → abre modal de verificación
    setVerificacionVisible(true);
  };

  // Se llama cuando el usuario confirma la solicitud desde el modal de verificación
  const onConfirmarSolicitud = async () => {
    console.log('🔵 onConfirmarSolicitud - Iniciando...');
    
    // Primero cerramos el modal de verificación
    setVerificacionVisible(false);
    console.log('🔵 Modal verificación cerrado');
    
    try {
      // Obtener datos de la ubicación seleccionada
      const mecanicaSeleccionada = obtenerMecanicaPorId(selectedLocation || '');
      console.log('🔵 Mecánica seleccionada:', mecanicaSeleccionada);

      // Envía la solicitud al backend
      console.log('🔵 Enviando solicitud al backend...');
      await solicitudesApi.crear({
        nombreCliente:       nombreCliente || '',
        telefono:            form.phone.trim(),
        correoCliente:       correoCliente?.trim().toLowerCase() || '',
        marca:               form.brand.trim(),
        modelo:              form.model.trim(),
        anio:                parseInt(form.year, 10),
        placa:               form.plate.trim().toUpperCase(),
        kilometraje:         parseInt(form.mileage, 10),
        tipoServicio:        form.service === 'Otro' ? form.otherService.trim() : form.service,
        otroServicio:        form.service === 'Otro' ? form.otherService.trim() : '',
        descripcionProblema: form.details.trim(),
        fechaCita:           appointmentDate
          ? new Date(`${appointmentDate.toISOString().split('T')[0]}T${appointmentTime}:00`).toISOString()
          : new Date().toISOString(),
        horaCita:            appointmentTime ?? '',
        provincia:           selectedProvincia || '',
        ubicacionMecanicaId: selectedLocation || '',
        ubicacionMecanicaNombre: mecanicaSeleccionada?.nombre || '',
        ubicacionMecanicaDireccion: mecanicaSeleccionada?.direccion || '',
      });

      console.log('✅ Solicitud enviada exitosamente');
      // Abre modal de confirmación
      setConfirmacionVisible(true);
      console.log('🔵 Modal confirmación abierto');
    } catch (err: any) {
      // Analizar el tipo de error ANTES de loguear
      const errorMessage = err?.message || 'Error desconocido';
      const errorStatus = err?.status || 500;
      
      if (errorStatus === 403 && errorMessage.includes('no ha sido verificado')) {
        // El código expiró o ya fue usado - NO mostrar en consola
        console.warn('⚠️ Código de verificación expirado');
        Alert.alert(
          'Código de Verificación Expirado',
          'Tu código de verificación expiró o ya fue usado. Por favor solicita un nuevo código e intenta nuevamente.',
          [{ text: 'Entendido' }]
        );
      } else {
        // Otros errores - sí mostrar en consola
        console.error('❌ Error al enviar solicitud:', err);
        Alert.alert(
          'Error al Enviar Solicitud',
          `No se pudo enviar tu solicitud: ${errorMessage}. Por favor verifica tu conexión e intenta nuevamente.`,
          [{ text: 'Entendido' }]
        );
      }
    }
  };

  // Se llama cuando el usuario cierra el modal de confirmación
  const onCerrarConfirmacion = () => {
    setConfirmacionVisible(false);
    resetForm();
  };

  // Navega (hace scroll) hasta las cards del carrusel "Nosotros"
  const scrollToAbout = () => {
    scrollRef.current?.scrollTo({ y: cardsPosition, animated: true });
  };

  // Manejador del fin del scroll manual del carrusel
  const onSlideScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / heroWidth);
    setActiveSlide(index);
  };

  // Descarga y abre el manual PDF local directamente
  // Flujo: resuelve URI del bundle → copia a directorio de caché → abre con visor PDF del sistema
  const openManualPDF = async () => {
    try {
      // 1. Carga el asset y obtiene su URI local dentro del bundle
      const asset = await Asset.fromModule(
        require('../../assets/pdf/Mecanic-ManualFormulario.pdf')
      ).downloadAsync();

      if (!asset.localUri) {
        Alert.alert('Error', 'No se pudo cargar el archivo PDF.');
        return;
      }

      // 2. Copia el archivo al directorio de caché del dispositivo
      // @ts-ignore - FileSystem es solo para móvil
      const destUri = FileSystem.cacheDirectory + 'Mecanic-ManualFormulario.pdf';
      
      // @ts-ignore - FileSystem es solo para móvil
      await FileSystem.copyAsync({ from: asset.localUri, to: destUri });

      // 3. Verifica si el dispositivo puede abrir archivos
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Error', 'Tu dispositivo no soporta abrir archivos externos.');
        return;
      }

      // 4. Abre el PDF directamente con el visor predeterminado (sin diálogo de compartir)
      // En Android, esto abrirá el visor PDF predeterminado directamente
      await Sharing.shareAsync(destUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Abrir Manual PDF',
        UTI: 'com.adobe.pdf',
      });

    } catch (error: any) {
      console.error('Error al abrir PDF:', error);
      Alert.alert('Error', `No se pudo abrir el manual PDF: ${error?.message || 'Error desconocido'}`);
    }
  };

  //Render de componente
  return (
    <ResponsiveContainer>
      {/* Contenedor raíz que ocupa toda la pantalla (style: flex:1, fondo negro) */}
      <View style={styles.page}>

      {/* ScrollView principal con navbar sticky en índice 0 */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={onMainScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        stickyHeaderIndices={[0]}
      >

        {/* Navbar sticky — índice 0 del ScrollView */}
        <NavbarCliente
          onScrollToAbout={scrollToAbout}
          onScrollToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        />

        {/* Carrusel hero + video en un solo bloque para que no aparezca franja negra entre ambos */}
        <View style={styles.heroVideoBlock}>
          {/*Seccion de carrucel*/}
          <View style={styles.hero} onLayout={(event) => setHeroWidth(event.nativeEvent.layout.width)}>

            {/* ScrollView horizontal animado */}
            <Animated.ScrollView
              ref={sliderRef as any}
              style={styles.heroSlider}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onSlideScrollEnd}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
              )}
              scrollEventThrottle={16}
            >
              {slideImages.map((image, index) => {
                const opacity = scrollX.interpolate({
                  inputRange: [
                    (index - 1) * heroWidth,
                    index * heroWidth,
                    (index + 1) * heroWidth,
                  ],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View key={index} style={[styles.heroSlide, { width: heroWidth, opacity }]}>
                    <Image
                      source={image}
                      contentFit="cover"
                      style={styles.heroImage}
                    />
                  </Animated.View>
                );
              })}
            </Animated.ScrollView>

            {/* Capa oscura sobre todas las imágenes */}
            <View style={styles.heroOverlay} />

            {/* Texto y botón — overlay único fuera del ScrollView, no se repite */}
            <View style={styles.heroTextOverlay}>
              {/* Cada título tiene su propia opacidad interpolada desde scrollX,
                igual que las imágenes — se desvanece exactamente al mismo tiempo */}
              <View style={styles.heroTitleContainer}>
                {slideMessages.map((msg, index) => {
                  const titleOpacity = scrollX.interpolate({
                    inputRange: [
                      (index - 1) * heroWidth,
                      index * heroWidth,
                      (index + 1) * heroWidth,
                    ],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                  });
                  return (
                    <Animated.Text
                      key={index}
                      style={[
                        styles.heroText,
                        styles.heroTitleAbsolute,
                        { opacity: titleOpacity },
                      ]}
                    >
                      {msg}
                    </Animated.Text>
                  );
                })}
              </View>

              {/* Subtítulo estático — no cambia ni parpadea */}
              <Text style={styles.heroCaption}>
                Tu vehículo en manos expertas y listo para tus próximos viajes.
              </Text>

              {/* Botón estático centrado - Visible solo si está logueado */}
              {estaLogueado && (
                <Pressable
                  style={({ pressed }) => [
                    styles.heroCitaButton,
                    pressed && styles.heroCitaButtonPressed,
                  ]}
                  onPress={() => scrollRef.current?.scrollTo({ y: formPosition, animated: true })}
                >
                  {({ pressed }) => (
                    <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome 
                        name="calendar-check-o" 
                        size={18} 
                        color={pressed ? '#FFFFFF' : '#000000'}
                      />
                      <View style={{ width: 10 }} />
                      <Text style={[styles.heroCitaButtonText, pressed && styles.heroCitaButtonTextPressed]}>
                        SOLICITA TU CITA
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}
            </View>

            {/* Indicadores de puntos eliminados */}
          </View>

          {/* ── SECCIÓN VIDEO DE FONDO ──
            Pegado al carrusel (sin marginTop), video más alto y más oscuro.
            logotipoTransparente con animación de aparición + Subtitulo1.png grande debajo. */}
          <View style={styles.videoBgSection}>

            {/* Video de fondo en loop, silenciado, sin controles */}
            <Video
              ref={videoRef}
              source={require('../../assets/videos/videoplayback.webm')}
              style={styles.videoBg}
              resizeMode={ResizeMode.COVER}
              isLooping={!isVideoFrozen} // Solo loop si no está trabado
              isMuted
              shouldPlay={Platform.OS !== 'web' || !isVideoFrozen} // Reproducir solo en móvil o web responsive
            />

            {/* Capa oscura más intensa sobre el video */}
            <View style={styles.videoBgOverlay} />

            {/* Contenido encima del video */}
            <View
              style={styles.videoBgContent}
              onLayout={(e) => {
                // Captura posición para disparar animación al hacer scroll
                setVideoBgPosition(e.nativeEvent.layout.y);
              }}
            >
              {/* logotipoTransparente con animación fade+scale al entrar en pantalla */}
              <Animated.View style={{
                opacity: videoBgLogoOpacity,
                transform: [{ scale: videoBgLogoScale }],
              }}>
                <Image
                  source={require('../../assets/images/logotipoTransparente.png')}
                  contentFit="contain"
                  style={styles.videoBgIcon}
                />
              </Animated.View>

              {/* Frase inspiracional debajo del logo — sin comillas */}
              <Text style={styles.videoBgPhrase}>
                Tu vehículo merece el mejor cuidado.{'\n'}Nosotros lo hacemos posible.
              </Text>
            </View>
          </View>
        </View>

        {/*Seccion nosotros*/}
        <View
          style={styles.sectionNosotros}
          onLayout={(event) => setAboutPosition(event.nativeEvent.layout.y)}
        >
          {/* Subtitulo1.png reemplaza al logo de logotipo.jpeg */}
          <Image
            source={require('../../assets/images/Subtitulo1.png')}
            contentFit="contain"
            style={styles.aboutSubtituloImg}
          />

          {/* ── CARRUSEL DE VEHÍCULOS ──
              Muestra VehiculoDestrosado y VehiculoBuenEstado alternando cada 10 segundos.
              Truco de espejo: scaleX(-1) en el ScrollView invierte la dirección de scroll,
              haciendo que los slides entren desde la derecha (giro a la derecha).
              scaleX(-1) en cada View hijo compensa el espejo para que las imágenes
              no se vean reflejadas horizontalmente. */}
          <View 
            style={styles.vehicleCarousel}
            onLayout={(e) => {
              // Captura el ancho real del contenedor para los slides
              if (Platform.OS === 'web') {
                setWindowWidth(e.nativeEvent.layout.width);
              }
            }}
          >
            {/* ScrollView horizontal con paginación exacta por slide */}
            <ScrollView
              ref={vehicleSliderRef}              // Ref para controlar el scroll programáticamente
              horizontal                           // Scroll en dirección horizontal
              pagingEnabled                        // Snap: se detiene exactamente en cada slide
              showsHorizontalScrollIndicator={false} // Oculta la barra de scroll
              scrollEnabled={false}               // El usuario no puede deslizar manualmente
              style={{ transform: [{ scaleX: -1 }] }} // Invierte la dirección del scroll (efecto espejo)
            >
              {/* Itera sobre el array de imágenes para crear un slide por cada una */}
              {vehicleImages.map((img, i) => (
                <View
                  key={i}
                  style={[
                    styles.vehicleSlide,
                    {
                      width: windowWidth, // Usa el ancho de ventana completo
                      transform: [{ scaleX: -1 }],           // Compensa el espejo del ScrollView padre
                    },
                  ]}
                >
                  {/* Imagen del vehículo centrada dentro del slide */}
                  <Image
                    source={img}              // Fuente de la imagen (VehiculoDestrosado o VehiculoBuenEstado)
                    contentFit="contain"      // No recorta la imagen, la ajusta dentro del espacio
                    style={styles.vehicleImage}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ── CARRUSEL DE CARDS (Nosotros / Misión / Visión) ──
              Fila horizontal: flecha izquierda + carrusel animado + flecha derecha.
              onLayout captura la posición Y exacta para que el menú "Nosotros"
              haga scroll directo a las cards (no al inicio de la sección). */}
          <View
            style={styles.aboutCarouselRow}
            onLayout={(e) => {
              // La posición Y de este View es relativa a su padre (sectionNosotros).
              // Sumamos aboutPosition (posición absoluta de la sección) para obtener
              // la posición absoluta dentro del ScrollView principal de la página.
              setCardsPosition(aboutPosition + e.nativeEvent.layout.y);
            }}
          >

            {/* Flecha izquierda: retrocede al slide anterior.
                Se oculta (opacity 0) cuando ya estamos en la primera tarjeta (índice 0).
                disabled evita que sea presionable aunque sea invisible. */}
            <Pressable
              onPress={() => scrollAboutTo(aboutIndex - 1)} // Navega al índice anterior
              style={[styles.aboutArrow, aboutIndex === 0 && styles.aboutArrowHidden]} // Oculta si es la primera
              disabled={aboutIndex === 0} // Deshabilita el toque en la primera tarjeta
            >
              <Text style={styles.aboutArrowText}>‹</Text>
            </Pressable>

            {/* Contenedor del carrusel animado.
                onLayout captura el ancho real para calcular el padding de centrado dinámico. */}
            <View 
              style={styles.aboutCarouselWrapper}
              onLayout={(e) => {
                // Captura el ancho real del contenedor
                const containerWidth = e.nativeEvent.layout.width;
                setCarouselWidth(containerWidth);
              }}
            >
              {/* IIFE (función autoejecutable) para calcular variables locales antes del return */}
              {(() => {
                // Genera los offsets exactos de snap para cada tarjeta usando el ancho actual.
                const snapOffsets = aboutCards.map((_, i) => i * CURRENT_ITEM_WIDTH);

                // Calcula el padding para centrar la tarjeta en el contenedor
                // (ancho del contenedor - ancho de la tarjeta) / 2 = padding a cada lado
                // En web responsive y móvil, centra la tarjeta visible
                const paddingValue = Math.max(0, (carouselWidth - currentCardWidth) / 2);

                return (
                  // Animated.ScrollView para poder vincular el scroll a aboutScrollX
                  // y calcular la escala de cada tarjeta en tiempo real
                  <Animated.ScrollView
                    key={Platform.OS === 'web' ? `carousel-${carouselKey}` : undefined} // Key solo en web para forzar re-render
                    ref={aboutSliderRef}                    // Ref para scroll programático con las flechas
                    horizontal                              // Scroll horizontal
                    showsHorizontalScrollIndicator={false}  // Oculta la barra de scroll
                    snapToOffsets={snapOffsets}             // Snap exacto a cada tarjeta
                    snapToInterval={Platform.OS !== 'web' ? CURRENT_ITEM_WIDTH : undefined} // Snap suave en móvil
                    decelerationRate="fast"                 // Frenado rápido para snap preciso
                    scrollEnabled={true}                    // Permite scroll manual
                    contentContainerStyle={{ 
                      paddingHorizontal: paddingValue,
                      alignItems: 'center',
                    }}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: aboutScrollX } } }], // Vincula scroll a aboutScrollX
                      { useNativeDriver: true }, // Driver nativo para máximo rendimiento
                    )}
                    // Se ejecuta cuando el usuario termina de deslizar manualmente
                    onMomentumScrollEnd={(e) => {
                      // Calcula el índice de la tarjeta visible dividiendo el offset por el ancho actual de cada slot
                      const i = Math.round(e.nativeEvent.contentOffset.x / CURRENT_ITEM_WIDTH);
                      setAboutIndex(i); // Actualiza el índice activo para sincronizar las flechas
                    }}
                    scrollEventThrottle={16} // Frecuencia de eventos de scroll (~60fps)
                  >
                    {/* Itera sobre las tarjetas para renderizar cada una con animación de escala */}
                    {aboutCards.map((card, index) => {
                      // Interpola la escala de esta tarjeta basándose en la posición del scroll.
                      // Cuando la tarjeta está centrada (offset = index * CURRENT_ITEM_WIDTH) → escala 1.0
                      // Cuando está a un slot de distancia → escala 0.85 (más pequeña)
                      const scale = aboutScrollX.interpolate({
                        inputRange: [
                          (index - 1) * CURRENT_ITEM_WIDTH, // Posición cuando la tarjeta anterior está centrada
                          index * CURRENT_ITEM_WIDTH,        // Posición cuando ESTA tarjeta está centrada → máximo
                          (index + 1) * CURRENT_ITEM_WIDTH,  // Posición cuando la tarjeta siguiente está centrada
                        ],
                        outputRange: [0.85, 1.0, 0.85], // Escala: pequeña → grande → pequeña
                        extrapolate: 'clamp',            // No extrapola fuera del rango definido
                      });

                      return (
                        // Animated.View aplica la escala calculada a toda la tarjeta
                        <Animated.View
                          key={index}
                          style={[
                            styles.aboutCard,
                            {
                              marginRight: CARD_MARGIN,      // Separación entre tarjetas
                              transform: [{ scale }],        // Escala animada en tiempo real
                            },
                          ]}
                        >
                          {/* Título de la tarjeta (Nosotros / Misión / Visión) */}
                          <Text style={styles.aboutCardTitle}>{card.title}</Text>
                          {/* Texto descriptivo de la tarjeta */}
                          <Text style={styles.aboutCardText}>{card.text}</Text>
                        </Animated.View>
                      );
                    })}
                  </Animated.ScrollView>
                );
              })()}
            </View>

            {/* Flecha derecha: avanza al siguiente slide.
                Se oculta cuando ya estamos en la última tarjeta. */}
            <Pressable
              onPress={() => scrollAboutTo(aboutIndex + 1)} // Navega al índice siguiente
              style={[styles.aboutArrow, aboutIndex === aboutCards.length - 1 && styles.aboutArrowHidden]}
              disabled={aboutIndex === aboutCards.length - 1} // Deshabilita en la última tarjeta
            >
              <Text style={styles.aboutArrowText}>›</Text>
            </Pressable>
          </View>

          {/* HAMMER ANIMADO
              Imagen decorativa que aparece debajo de las cards.
              Entra desde la derecha (translateX positivo → 0) mientras aparece (opacity 0 → 1).
              Al terminar la animación queda pegada al lado derecho (alignSelf: 'flex-end'). */}
          <Animated.View
            style={[
              styles.hammerContainer,
              {
                opacity: hammerOpacity,                    // Controla la visibilidad (0 → 1)
                transform: [{ translateX: hammerTranslateX }], // Desplazamiento horizontal (800 web / 400 móvil → 0)
              },
            ]}
            onLayout={(e) => {
              // Captura la posición Y absoluta del hammer dentro del ScrollView principal.
              // Se suma aboutPosition porque el layout.y es relativo a sectionNosotros.
              setHammerPosition(aboutPosition + e.nativeEvent.layout.y);
            }}
          >
            {/* Imagen del martillo/herramienta decorativa */}
            <Image
              source={require('../../assets/images/HammerSobreSaliendo.png')}
              contentFit="contain" // No recorta la imagen
              style={styles.hammerImage}
            />
          </Animated.View>
        </View>

        {/* FORMULARIO DE SOLICITUD - Visible solo si está logueado */}
        {estaLogueado && (
          <View
            style={styles.section}
            onLayout={(e) => setFormPosition(e.nativeEvent.layout.y)} // Guarda la posición Y absoluta
          >

          {/* Título centrado del formulario */}
          <Text style={styles.formTitle}>Formulario de Solicitud</Text>

          {/* Descripción breve que orienta al usuario sobre qué hacer */}
          <Text style={styles.formSubtitle}>
            Completa los datos a continuación para que un mecánico pueda atender tu vehículo
            de forma rápida y precisa.
          </Text>

          {/* Contenedor del formulario con padding y separación */}
          <View style={styles.form}>

            {/* SEPARADOR: Datos del Cliente */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Tus Datos</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo: Nombre del Cliente (No editable) */}
            <Text style={styles.fieldLabel}>Nombre Completo</Text>
            <TextInput
              placeholder="Tu nombre"
              placeholderTextColor="#94A3B8"
              editable={false}
              value={nombreCliente || ''}
              style={styles.input}
            />

            {/* Campo: Correo del Cliente (No editable) */}
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <TextInput
              placeholder="Tu correo"
              placeholderTextColor="#94A3B8"
              editable={false}
              value={correoCliente || ''}
              style={styles.input}
            />

            {/* Campo: Teléfono del Cliente (No editable) */}
            <Text style={styles.fieldLabel}>Teléfono</Text>
            <TextInput
              placeholder="Ej: 0987654321"
              placeholderTextColor="#94A3B8"
              editable={false}
              value={form.phone}
              style={styles.input}
            />

            {/* SEPARADOR: Información del vehículo */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Información del Vehículo</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo: Marca del vehículo */}
            <Text style={styles.fieldLabel}>Marca del Vehículo</Text>
            <TextInput
              placeholder="Ej: Toyota, Chevrolet, Mazda"
              placeholderTextColor="#94A3B8"
              value={form.brand}
              onChangeText={(t) => { setForm((p) => ({ ...p, brand: t })); setErrBrand(''); }}
              style={[styles.input, errBrand ? styles.inputError : null]}
            />
            {errBrand ? <Text style={styles.fieldError}>{errBrand}</Text> : null}

            {/* Fila: Modelo + Año en la misma línea */}
            <View style={styles.formRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.fieldLabel}>Modelo</Text>
                <TextInput
                  placeholder="Ej: Corolla"
                  placeholderTextColor="#94A3B8"
                  value={form.model}
                  onChangeText={(t) => { setForm((p) => ({ ...p, model: t })); setErrModel(''); }}
                  style={[styles.input, errModel ? styles.inputError : null]}
                />
                {errModel ? <Text style={styles.fieldError}>{errModel}</Text> : null}
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.fieldLabel}>Año</Text>
                <TextInput
                  placeholder="Ej: 2015"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={4}
                  value={form.year}
                  onChangeText={(t) => { setForm((p) => ({ ...p, year: t })); setErrYear(''); }}
                  style={[styles.input, errYear ? styles.inputError : null]}
                />
                {errYear ? <Text style={styles.fieldError}>{errYear}</Text> : null}
              </View>
            </View>

            {/* Fila: Placa + Kilometraje en la misma línea */}
            <View style={styles.formRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.fieldLabel}>Placa</Text>
                <TextInput
                  placeholder="Ej: EPC4613"
                  placeholderTextColor="#94A3B8"
                  value={form.plate}
                  onChangeText={(t) => { setForm((p) => ({ ...p, plate: t })); setErrPlate(''); }}
                  style={[styles.input, errPlate ? styles.inputError : null]}
                />
                {errPlate ? <Text style={styles.fieldError}>{errPlate}</Text> : null}
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.fieldLabel}>Kilometraje</Text>
                <TextInput
                  placeholder="Ej: 50000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={form.mileage}
                  onChangeText={(t) => { setForm((p) => ({ ...p, mileage: t })); setErrMileage(''); }}
                  style={[styles.input, errMileage ? styles.inputError : null]}
                />
                {errMileage ? <Text style={styles.fieldError}>{errMileage}</Text> : null}
              </View>
            </View>

            {/* SEPARADOR: Tipo de servicio */}
            <View style={[styles.formDivider, { marginTop: 16 }]}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Tipo de Servicio</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Botón del dropdown de tipo de servicio */}
            <Text style={styles.fieldLabel}>Tipo de Servicio</Text>
            <Pressable
              style={[styles.dropdown, errService ? styles.inputError : null]}
              onPress={() => setServiceDropdownOpen((v) => !v)}
            >
              <Text style={form.service ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {form.service || 'Selecciona un tipo de servicio'}
              </Text>
              <Text style={styles.dropdownArrow}>{serviceDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {errService ? <Text style={[styles.fieldError, { marginTop: 4 }]}>{errService}</Text> : null}

            {/* Lista de opciones del dropdown — solo visible cuando serviceDropdownOpen === true */}
            {serviceDropdownOpen && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {/* Itera sobre las opciones de servicio para crear un item por cada una */}
                {serviceOptions.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.dropdownItem,
                      form.service === option && styles.dropdownItemActive, // Resalta la seleccionada
                    ]}
                    onPress={() => {
                      // Actualiza el servicio y limpia el campo "Otro" al seleccionar
                      setForm((p) => ({ ...p, service: option, otherService: '' }));
                      setServiceDropdownOpen(false); // Cierra el dropdown al seleccionar
                      setErrService(''); // Limpia el error al seleccionar servicio
                    }}
                  >
                    {/* Checkmark ✓ si esta opción está seleccionada, espacios si no */}
                    <Text style={styles.dropdownItemCheck}>
                      {form.service === option ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Campo extra: solo visible cuando el servicio seleccionado es "Otro" */}
            {form.service === 'Otro' && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.fieldLabel}>Descripción del Servicio</Text>
                <TextInput
                  placeholder="Describe brevemente el tipo de servicio"
                  placeholderTextColor="#94A3B8"
                  value={form.otherService}
                  onChangeText={(t) => { setForm((p) => ({ ...p, otherService: t })); setErrOther(''); }}
                  style={[styles.input, errOther ? styles.inputError : null]}
                />
                {errOther ? <Text style={styles.fieldError}>{errOther}</Text> : null}
              </View>
            )}

            {/* SEPARADOR: Descripción del problema*/}
            <View style={[styles.formDivider, { marginTop: 16 }]}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Descripción del problema</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo multilínea para describir el problema del vehículo */}
            <Text style={styles.fieldLabel}>Descripción del Problema</Text>
            <TextInput
              placeholder="Ej: El motor hace un ruido extraño al arrancar"
              placeholderTextColor="#94A3B8"
              value={form.details}
              onChangeText={(t) => {
                // Solo permite letras, números, espacios y tildes/ñ
                const filtered = t.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                setForm((p) => ({ ...p, details: filtered }));
                setErrDetails(validarTextoYNumeros(filtered, 'La descripción del problema') ?? '');
              }}
              multiline                                    // Permite saltos de línea
              style={[styles.input, styles.textarea, errDetails ? styles.inputError : null]}
            />
            {errDetails ? <Text style={styles.errorText}>{errDetails}</Text> : null}

            {/*SEPARADOR: Fecha de la cita */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Fecha de la cita</Text>
              <View style={styles.formDividerLine} />
            </View>

            <Text style={styles.fieldDescription}>
              Horarios disponibles: Lunes a Viernes hasta las 20:00h. Sábados y Domingos solo hasta las 12:00h (mediodía). 
              Los domingos requieren motivo de emergencia.
            </Text>

            <Text style={styles.fieldLabel}>Fecha de la Cita</Text>

            {/* Botón que abre el modal del calendario al presionar */}
            <Pressable style={[styles.dropdown, errDate ? styles.inputError : null]} onPress={() => setCalendarVisible(true)}>
              {/* Muestra la fecha formateada si hay selección, o el placeholder */}
              <Text style={appointmentDate ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {appointmentDate ? formatDate(appointmentDate) : 'Seleccionar fecha'}
              </Text>
              {/* Ícono de calendario de FontAwesome */}
              <FontAwesome name="calendar" size={16} color="#64748B" />
            </Pressable>
            {errDate ? <Text style={styles.errorText}>{errDate}</Text> : null}

            {/*MODAL CALENDARIO
                Se muestra sobre toda la pantalla con fondo semitransparente.
                Tocar el fondo cierra el modal. Tocar dentro del calendario no lo cierra. */}
            <Modal
              visible={calendarVisible}       // Visible cuando calendarVisible === true
              transparent                      // Fondo semitransparente
              animationType="fade"             // Aparece con transición de opacidad
              onRequestClose={() => setCalendarVisible(false)} // Cierra con botón atrás en Android
            >
              {/* Fondo semitransparente: al presionar cierra el modal */}
              <Pressable style={styles.modalOverlay} onPress={() => setCalendarVisible(false)}>
                {/* Contenedor del calendario.
                    e.stopPropagation() evita que el toque dentro cierre el modal */}
                <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>

                  {/* Cabecera del calendario: flechas de navegación + mes/año */}
                  <View style={styles.calendarHeader}>
                    {/* Flecha izquierda: retrocede un mes */}
                    <Pressable
                      onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      style={styles.calendarNavBtn}
                    >
                      <Text style={styles.calendarNavText}>‹</Text>
                    </Pressable>
                    {/* Etiqueta del mes y año actual en mayúsculas (ej: "MAYO 2026") */}
                    <Text style={styles.calendarMonthLabel}>
                      {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </Text>
                    {/* Flecha derecha: avanza un mes */}
                    <Pressable
                      onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      style={styles.calendarNavBtn}
                    >
                      <Text style={styles.calendarNavText}>›</Text>
                    </Pressable>
                  </View>

                  {/* Fila de etiquetas de días de la semana (Do, Lu, Ma...) */}
                  <View style={styles.calendarWeekRow}>
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
                      <Text key={d} style={styles.calendarWeekLabel}>{d}</Text>
                    ))}
                  </View>

                  {/* Cuadrícula de días del mes */}
                  <View style={styles.calendarGrid}>
                    {buildCalendarDays(calendarMonth).map((day, i) => {
                      // Celda vacía para alinear el primer día de la semana correctamente
                      if (!day) return <View key={`b-${i}`} style={styles.calendarCell} />;
                      // Obtiene la fecha de hoy sin hora para comparaciones correctas
                      const today = new Date(); today.setHours(0, 0, 0, 0);
                      // Calcula fecha máxima permitida (31 de diciembre del año actual)
                      const añoActual = today.getFullYear();
                      const maxDate = new Date(añoActual, 11, 31); // 11 = diciembre, 31 = último día
                      maxDate.setHours(23, 59, 59, 999); // Final del día
                      const isPast = day < today;                                           // Día pasado
                      const isTooFarFuture = day > maxDate;                                 // Después del 31/dic del año actual
                      
                      // Obtener disponibilidad del día completo (según total de reservas)
                      let nivelDia: 'verde' | 'naranja' | 'rojo' | 'bloqueado' | null = null;
                      if (!isPast && !isTooFarFuture) {
                        // Aplicar colores a TODOS los días (lunes-domingo)
                        nivelDia = obtenerNivelDisponibilidadDia(day);
                      }
                      
                      const isDayBlocked = nivelDia === 'bloqueado';
                      const isDisabled = isPast || isTooFarFuture || isDayBlocked;
                      
                      const isSelected = appointmentDate?.toDateString() === day.toDateString(); // Seleccionado
                      const isToday = day.toDateString() === today.toDateString();            // Hoy
                      
                      return (
                        <Pressable
                          key={i}
                          style={[
                            styles.calendarCell,
                            isToday && styles.calendarCellToday,    // Borde azul si es hoy
                            isSelected && styles.calendarCellSelected, // Fondo azul si seleccionado
                            isDisabled && styles.calendarCellPast,     // Opacidad reducida si deshabilitado
                            !isDisabled && !isSelected && nivelDia === 'verde' && styles.calendarCellDisponible, // Verde
                            !isDisabled && !isSelected && nivelDia === 'naranja' && styles.calendarCellMedio, // Naranja
                            !isDisabled && !isSelected && nivelDia === 'rojo' && styles.calendarCellBajo, // Rojo
                            isDayBlocked && styles.calendarCellLleno, // Gris/bloqueado
                          ]}
                          // Selecciona el día y cierra el modal (solo si está dentro del rango permitido)
                          onPress={() => { 
                            if (!isDisabled) { 
                              setAppointmentDate(day); 
                              setCalendarVisible(false); 
                              setErrDate(''); // Limpia el error al seleccionar fecha
                            } 
                          }}
                          disabled={isDisabled} // Deshabilita los días fuera de rango
                        >
                          <Text style={[
                            styles.calendarCellText,
                            isToday && styles.calendarCellTodayText,
                            isSelected && styles.calendarCellSelectedText,
                            isDisabled && styles.calendarCellPastText,
                          ]}>
                            {day.getDate()} {/* Número del día del mes */}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Botón para cerrar el modal sin seleccionar fecha */}
                  <Pressable style={styles.calendarCloseBtn} onPress={() => setCalendarVisible(false)}>
                    <Text style={styles.calendarCloseBtnText}>Cerrar</Text>
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>

            {/* SEPARADOR: Hora de la cita */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Hora de la cita</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Dropdown de hora */}
            <Text style={styles.fieldLabel}>Hora de la Cita</Text>
            <Pressable
              style={[styles.dropdown, errTime ? styles.inputError : null]}
              onPress={() => setTimeDropdownOpen((v) => !v)}
            >
              <Text style={appointmentTime ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {appointmentTime ?? 'Seleccionar hora'}
              </Text>
              <Text style={styles.dropdownArrow}>{timeDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {errTime ? <Text style={styles.errorText}>{errTime}</Text> : null}

            {/* Lista desplegable de horas */}
            {timeDropdownOpen && (
              <View style={styles.dropdownList}>
                {timeOptions.length === 0 ? (
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#EF4444', fontSize: 14, textAlign: 'center' }}>
                      No hay horas disponibles para esta fecha.{'\n'}
                      Todas las horas están reservadas.
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.timeScrollList}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                  >
                    {timeOptions.map((t) => {
                      const estado = getHoraDisponibilidad(t);
                      const isOcupada = estado.reservas >= 1; // Bloquear si hay al menos 1 reserva
                      
                      return (
                        <Pressable
                          key={t}
                          style={[
                            styles.dropdownItem,
                            appointmentTime === t && styles.dropdownItemActive,
                            isOcupada && { opacity: 0.5, backgroundColor: '#F3F4F6' }
                          ]}
                          onPress={() => {
                            if (!isOcupada) {
                              setAppointmentTime(t);
                              setTimeDropdownOpen(false);
                              setErrTime('');
                            }
                          }}
                          disabled={isOcupada}
                        >
                          <Text style={styles.dropdownItemCheck}>
                            {appointmentTime === t ? '✓ ' : '    '}
                          </Text>
                          <Text style={[
                            styles.dropdownItemText,
                            isOcupada && { textDecorationLine: 'line-through', color: '#9CA3AF' }
                          ]}>
                            {t}
                            {isOcupada && ' (Ocupada)'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Campo de Motivo de Emergencia (solo para domingos) */}
            {appointmentDate && appointmentDate.getDay() === 0 && (
              <>
                <Text style={[styles.fieldDescription, { marginBottom: 8, color: '#EF4444', fontWeight: '600' }]}>
                  IMPORTANTE: Los domingos NO son días laborables. Solo se aceptan reservas de emergencia. 
                  Describa claramente por qué necesita el servicio en domingo y confirme que comprende que se trata de una atención excepcional.
                </Text>
                <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Motivo de Emergencia (Obligatorio)</Text>
                <TextInput
                  placeholder="Ej: Mi vehículo no enciende y necesito usarlo urgentemente para..."
                  placeholderTextColor="#94A3B8"
                  value={motivoEmergencia}
                  onChangeText={(text) => {
                    // Solo permite letras, números, espacios y puntuación básica
                    const filtered = text.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,;:()¿?¡!-]/g, '');
                    setMotivoEmergencia(filtered);
                    setErrMotivoEmergencia('');
                  }}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  style={[styles.input, styles.textarea, errMotivoEmergencia ? styles.inputError : null, { height: 100 }]}
                />
                <Text style={[styles.fieldDescription, { marginTop: 4, textAlign: 'right' }]}>
                  {motivoEmergencia.length}/300 caracteres
                </Text>
                {errMotivoEmergencia ? <Text style={styles.errorText}>{errMotivoEmergencia}</Text> : null}
              </>
            )}

            {/* SEPARADOR: Ubicación de la cita */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Ubicación de la cita</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Selector de Provincia */}
            <Text style={styles.fieldLabel}>Provincia de la Visita</Text>
            <Pressable
              style={[styles.dropdown, errProvincia ? styles.inputError : null]}
              onPress={() => setProvinciaDropdownOpen((v) => !v)}
            >
              <Text style={selectedProvincia ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {selectedProvincia || 'Seleccionar provincia'}
              </Text>
              <Text style={styles.dropdownArrow}>{provinciaDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {errProvincia ? <Text style={styles.errorText}>{errProvincia}</Text> : null}

            {/* Lista desplegable de provincias */}
            {provinciaDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView
                  style={styles.timeScrollList}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                >
                  {PROVINCIAS_ECUADOR.map((prov) => (
                    <Pressable
                      key={prov}
                      style={[styles.dropdownItem, selectedProvincia === prov && styles.dropdownItemActive]}
                      onPress={() => { 
                        setSelectedProvincia(prov); 
                        setSelectedLocation(null); // Resetear ubicación al cambiar provincia
                        setProvinciaDropdownOpen(false);
                        setErrProvincia('');
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {selectedProvincia === prov ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{prov}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Dropdown de ubicación (dinámico según provincia seleccionada) */}
            <Text style={styles.fieldLabel}>
              {selectedProvincia ? `Ubicación de Mecánicas de ${selectedProvincia}` : 'Ubicación de la Mecánica'}
            </Text>
            <Pressable
              style={[styles.dropdown, errLocation ? styles.inputError : null]}
              onPress={() => {
                if (!selectedProvincia) {
                  Alert.alert('Atención', 'Primero selecciona una provincia');
                  return;
                }
                setLocationDropdownOpen((v) => !v);
              }}
            >
              <Text style={selectedLocation ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {selectedLocation 
                  ? obtenerMecanicaPorId(selectedLocation)?.nombre 
                  : 'Seleccionar ubicación'}
              </Text>
              <Text style={styles.dropdownArrow}>{locationDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {errLocation ? <Text style={styles.errorText}>{errLocation}</Text> : null}

            {/* Lista desplegable de ubicaciones (filtrada por provincia) */}
            {locationDropdownOpen && selectedProvincia && (
              <View style={styles.dropdownList}>
                <ScrollView
                  style={styles.timeScrollList}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                >
                  {obtenerMecanicasPorProvincia(selectedProvincia).map((mecanica) => (
                    <Pressable
                      key={mecanica.id}
                      style={[styles.dropdownItem, selectedLocation === mecanica.id && styles.dropdownItemActive]}
                      onPress={() => { 
                        setSelectedLocation(mecanica.id); 
                        setLocationDropdownOpen(false);
                        setErrLocation('');
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {selectedLocation === mecanica.id ? '✓ ' : '    '}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dropdownItemText}>{mecanica.nombre}</Text>
                        <Text style={styles.locationAddress}>{mecanica.direccion}</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Botón de envío — azul en reposo, blanco al presionar */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                { marginTop: 24 } // Espacio adicional para el mensaje de error de ubicación
              ]}
              onPress={onSend}
            >
              {({ pressed }) => (
                <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                  <FontAwesome 
                    name="send" 
                    size={18} 
                    color={pressed ? (Platform.OS === 'web' ? '#E0E7FF' : '#FFFFFF') : (Platform.OS === 'web' ? '#FFFFFF' : '#000000')}
                  />
                  <View style={{ width: 10 }} />
                  <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                    ENVIAR SOLICITUD
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Enlace para descargar el manual PDF */}
            <Text style={styles.manualText}>¿No sabes cómo llenar el formulario?</Text>
            <Pressable onPress={openManualPDF}>
              <Text style={styles.manualLink}>Descargar manual PDF</Text>
            </Pressable>

          </View>

          {/* SECCIÓN GOOGLE MAPS */}
          <View style={styles.mapSection}>
            <Text style={styles.mapTitle}>Nuestra Ubicación</Text>
            <Text style={styles.mapSubtitle}>
              {selectedLocation 
                ? obtenerMecanicaPorId(selectedLocation)?.direccion 
                : 'Selecciona una ubicación para ver el mapa'}
            </Text>
            
            {/* MapView - Muestra la ubicación seleccionada */}
            {selectedLocation && obtenerMecanicaPorId(selectedLocation) && (
              <>
                <MapView
                  style={styles.mapView}
                  initialRegion={{
                    latitude: obtenerMecanicaPorId(selectedLocation)!.latitud,
                    longitude: obtenerMecanicaPorId(selectedLocation)!.longitud,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  region={{
                    latitude: obtenerMecanicaPorId(selectedLocation)!.latitud,
                    longitude: obtenerMecanicaPorId(selectedLocation)!.longitud,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: obtenerMecanicaPorId(selectedLocation)!.latitud,
                      longitude: obtenerMecanicaPorId(selectedLocation)!.longitud,
                    }}
                    title={obtenerMecanicaPorId(selectedLocation)!.nombre}
                    description={obtenerMecanicaPorId(selectedLocation)!.direccion}
                  />
                </MapView>
                
                {/* Botón para abrir Google Maps con la ubicación seleccionada */}
                <Pressable
                  style={({ pressed }) => [styles.mapsButton, pressed && styles.mapsButtonPressed]}
                  onPress={() => {
                    const mecanica = obtenerMecanicaPorId(selectedLocation);
                    if (mecanica) {
                      const url = `https://www.google.com/maps/dir//${mecanica.latitud},${mecanica.longitud}`;
                      Linking.openURL(url);
                    }
                  }}
                >
                  {({ pressed }) => (
                    <View style={[styles.mapsButtonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome
                        name="map-marker"
                        size={18}
                        color={pressed ? '#FFFFFF' : '#000000'}
                      />
                      <View style={{ width: 10 }} />
                      <Text style={[styles.mapsButtonText, pressed && styles.mapsButtonTextPressed]}>
                        ABRIR EN GOOGLE MAPS
                      </Text>
                    </View>
                  )}
                </Pressable>
              </>
            )}
          </View>
          
          </View>
        )}
        
        {/* Footer del cliente */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Mecanic Company. Todos los derechos reservados.{'\n'}
            Proporcionamos servicios automotrices de calidad con mecánicos certificados.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.scrollTopButton,
              pressed && styles.scrollTopButtonPressed,
            ]}
            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[
                  styles.scrollTopText,
                  pressed && styles.scrollTopTextPressed
                ]}>
                  REGRESAR ARRIBA
                </Text>
                <View style={{ width: 8 }} />
                <FontAwesome 
                  name="arrow-up" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'}
                />
              </View>
            )}
          </Pressable>
        </View>

      </ScrollView>

      {/* ─── Modales del flujo de solicitud ─────────────────────────────────── */}
      <VerificacionFormulario
        visible={verificacionVisible}
        datos={{
          nombre: nombreCliente || '',
          correo: correoCliente || '',
          telefono: form.phone,
          marca: form.brand,
          modelo: form.model,
          año: form.year,
          placa: form.plate.toUpperCase(),
          kilometraje: form.mileage,
          servicio: form.service,
          otroServicio: form.otherService,
          descripcion: form.details,
          fecha: appointmentDate ? formatDate(appointmentDate) : '',
          hora: appointmentTime || '',
          provincia: selectedProvincia || '',
          ubicacion: obtenerMecanicaPorId(selectedLocation || '')?.nombre || '',
          motivoEmergencia: motivoEmergencia || undefined,
          esDomingo: appointmentDate?.getDay() === 0,
        }}
        onConfirmar={onConfirmarSolicitud}
        onCancelar={() => setVerificacionVisible(false)}
      />

      <ConfirmacionSolicitud
        visible={confirmacionVisible}
        ubicacion={obtenerMecanicaPorId(selectedLocation || '')?.nombre || ''}
        fecha={appointmentDate ? formatDate(appointmentDate) : ''}
        hora={appointmentTime || ''}
        onCerrar={onCerrarConfirmacion}
      />

      </View>
    </ResponsiveContainer>
  );
}
