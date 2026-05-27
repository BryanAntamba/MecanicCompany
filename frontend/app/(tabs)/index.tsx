// Componente Image optimizado de expo-image: soporta caché, placeholders y formatos modernos
import { Image } from 'expo-image';

// expo-asset: resuelve la URI local de assets del bundle
import { Asset } from 'expo-asset';

// expo-file-system: copia archivos a directorios accesibles del dispositivo
import * as FileSystem from 'expo-file-system/legacy';

// expo-sharing: abre el diálogo nativo para compartir/abrir archivos locales
import * as Sharing from 'expo-sharing';

// react-native-maps: mapa nativo embebido directamente en la app
import MapView, { Marker } from 'react-native-maps';

// expo-av: reproducción de video en la app
import { Video, ResizeMode } from 'expo-av';

// FontAwesome para íconos vectoriales
import { FontAwesome } from '@expo/vector-icons';

// Linking para abrir Google Maps externo
import { Linking } from 'react-native';

// Hooks de React:
// - useEffect: ejecuta efectos secundarios (timers, animaciones) después del render
// - useRef: referencia mutable a un elemento del DOM o un valor persistente sin re-render
// - useState: maneja el estado local del componente
import { useEffect, useRef, useState } from 'react';

// useLocalSearchParams: lee parámetros de la URL de la ruta actual (ej: scrollTo=about)
import { useLocalSearchParams } from 'expo-router';

// Componentes y APIs de React Native:
import {
  Alert,                   // Muestra diálogos/alertas nativas del sistema operativo
  Animated,                // API para crear animaciones fluidas con valores animados
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
import styles from '@/Styles';

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
} from '@/utils/validaciones';

// API de backend
import { authApi, solicitudesApi } from '@/utils/api';

// Componente reutilizable de la barra de navegación del cliente
import NavbarCliente from '@/components/nadvarCliente/nadvarCliente';

// Ancho fijo de cada tarjeta del carrusel "Nosotros"
const CARD_WIDTH = 260;
// Margen derecho entre tarjetas
const CARD_MARGIN = 16;
// Ancho total que ocupa cada "slot" en el carrusel
const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Tarjetas de la sección Nosotros con texto ampliado
const aboutCards = [
  {
    title: 'Nosotros',
    text: 'Mecanic Company nació con la idea de modernizar el mantenimiento automotriz. Somos un equipo apasionado por la tecnología y los vehículos, comprometidos en ofrecer una plataforma ágil donde clientes y mecánicos se conectan de forma directa, transparente y segura. Creemos que tu vehículo merece el mejor cuidado.',
  },
  {
    title: 'Misión',
    text: 'Nuestra misión es ofrecer un servicio moderno, confiable y accesible que conecte a los clientes con soluciones automotrices profesionales. Facilitamos cada paso del proceso, desde la solicitud hasta el seguimiento del servicio, garantizando calidad, puntualidad y total transparencia en cada intervención.',
  },
  {
    title: 'Visión',
    text: 'Aspiramos a ser la aplicación líder en gestión de mantenimiento vehicular en la región, reconocida por nuestra innovación constante, la confianza que generamos en nuestros usuarios y la excelencia de nuestro servicio. Queremos que cada conductor tenga acceso a un mecánico de confianza en la palma de su mano.',
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
  const [carouselWidth, setCarouselWidth] = useState(Dimensions.get('window').width);

  // Estado: ancho actual del área hero (se actualiza con onLayout para soporte responsive)
  const [heroWidth, setHeroWidth] = useState(Dimensions.get('window').width);

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
  // Estado: controla si el modal del calendario está visible
  const [calendarVisible, setCalendarVisible] = useState(false);
  // Estado: controla si el dropdown de hora está abierto
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  // ─── Estados del modal de verificación de correo del cliente ──────────────
  // visible: muestra/oculta el modal de verificación
  const [verifyVisible, setVerifyVisible]     = useState(false);
  // code: código de 6 dígitos ingresado por el usuario
  const [verifyCode, setVerifyCode]           = useState('');
  // sending: true mientras se envía el código al correo
  const [verifySending, setVerifySending]     = useState(false);
  // loading: true mientras se verifica el código
  const [verifyLoading, setVerifyLoading]     = useState(false);
  // error: mensaje de error dentro del modal
  const [verifyError, setVerifyError]         = useState('');
  // resend cooldown: segundos restantes para poder reenviar (0 = habilitado)
  const [resendCooldown, setResendCooldown]   = useState(0);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Estado y animación del modal de éxito ───────────────────────────────
  const [successVisible, setSuccessVisible]   = useState(false);
  const successScale   = useRef(new Animated.Value(0.7)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const showSuccess = () => {
    setSuccessVisible(true);
    successScale.setValue(0.7);
    successOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(successScale,   { toValue: 1,   useNativeDriver: true, friction: 6 }),
      Animated.timing(successOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const hideSuccess = () => {
    Animated.timing(successOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(
      () => setSuccessVisible(false)
    );
  };

  // Ref al ScrollView principal de la página (para hacer scroll programático a secciones)
  const scrollRef = useRef<ScrollView>(null);

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

  // Valor animado que rastrea el scroll X del carrusel de tarjetas "Nosotros"
  // Inicia en ITEM_WIDTH para que la tarjeta central (Misión, índice 1) quede activa al inicio
  const aboutScrollX = useRef(new Animated.Value(ITEM_WIDTH)).current;

  // Valor animado para la animación de entrada del logo (opacidad + escala)
  // Inicia en 0 (invisible) y se anima a 1 cuando la sección entra en pantalla
  const logoAnim = useRef(new Animated.Value(0)).current;

  // Ref al Animated.ScrollView del carrusel "Nosotros" para scroll programático con las flechas
  const aboutSliderRef = useRef<any>(null);

  // Valores animados para la imagen HammerSobreSaliendo
  // Entra desde la izquierda (translateX negativo) hacia el lado derecho, de invisible a visible
  const hammerOpacity = useRef(new Animated.Value(0)).current;
  const hammerTranslateX = useRef(new Animated.Value(400)).current; // desde el lado derecho
  const hammerTriggered = useRef(false);

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
    const W = Dimensions.get('window').width;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;

      if (currentIndex >= vehicleImages.length - 1) {
        // Avanza al penúltimo slide con animación
        vehicleSliderRef.current?.scrollTo({ x: currentIndex * W, animated: true });
        setVehicleActive(currentIndex % 2);

        // Después de la animación, resetea silenciosamente al primer slide equivalente
        setTimeout(() => {
          currentIndex = currentIndex % 2;
          vehicleSliderRef.current?.scrollTo({ x: currentIndex * W, animated: false });
        }, 700);
      } else {
        vehicleSliderRef.current?.scrollTo({ x: currentIndex * W, animated: true });
        setVehicleActive(currentIndex % 2);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  // Genera opciones de hora de 07:00 a 22:00 cada 30 minutos
  const timeOptions: string[] = (() => {
    const opts: string[] = [];
    for (let h = 7; h <= 22; h++) {
      opts.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 22) opts.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return opts;
  })();

  // Navega el carrusel "Nosotros" al índice indicado con animación suave
  const scrollAboutTo = (index: number) => {
    // Limita el índice entre 0 y el último elemento
    const clamped = Math.max(0, Math.min(index, aboutCards.length - 1));
    setAboutIndex(clamped);
    // Hace scroll programático al offset exacto de esa tarjeta
    aboutSliderRef.current?.scrollTo({ x: clamped * ITEM_WIDTH, animated: true });
  };

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

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', brand: '', model: '', year: '', plate: '', mileage: '', service: '', otherService: '', details: '' });
    setAppointmentDate(null);
    setAppointmentTime(null);
    setServiceDropdownOpen(false);
    setErrName(''); setErrPhone(''); setErrEmail(''); setErrBrand('');
    setErrModel(''); setErrYear(''); setErrPlate(''); setErrMileage('');
    setErrService(''); setErrOther(''); setErrDetails(''); setErrDate(''); setErrTime('');
  };

  const onSend = async () => {
    // Valida cada campo y guarda el error en su estado individual
    const eName = validarCuatroPalabras(form.name, 'El nombre completo');
    const ePhone = validarTelefono(form.phone);
    const eEmail = validarCorreoGmail(form.email);
    const eBrand = validarSoloTexto(form.brand, 'La marca');
    const eModel = validarTextoYNumeros(form.model, 'El modelo');
    const eYear = validarAño(form.year);
    const ePlate = validarPlaca(form.plate);
    const eMileage = validarSoloNumeros(form.mileage, 'El kilometraje');
    const eService = validarObligatorio(form.service, 'El tipo de servicio');
    const eOther = form.service === 'Otro' ? validarTextoYNumeros(form.otherService, 'La descripción del servicio') : null;
    const eDetails = validarTextoYNumeros(form.details, 'La descripción del problema');
    const eDate = !appointmentDate ? 'La fecha de la cita es obligatoria.' : null;
    const eTime = !appointmentTime ? 'La hora de la cita es obligatoria.' : null;

    setErrName(eName ?? '');
    setErrPhone(ePhone ?? '');
    setErrEmail(eEmail ?? '');
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

    // Si hay algún error, no continúa
    if ([eName, ePhone, eEmail, eBrand, eModel, eYear, ePlate, eMileage,
      eService, eOther, eDetails, eDate, eTime].some(Boolean)) return;

    // Todo válido → envía código de verificación al correo del cliente
    setVerifySending(true);
    setVerifyError('');
    setVerifyCode('');
    try {
      await authApi.enviarCodigoCliente(form.email.trim().toLowerCase());
      setVerifyVisible(true);
      // Inicia cooldown de 30 segundos al abrir el modal
      setResendCooldown(30);
      if (resendTimer.current) clearInterval(resendTimer.current);
      resendTimer.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(resendTimer.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'No se pudo enviar el código. Intenta de nuevo.');
    } finally {
      setVerifySending(false);
    }
  };

  // Se llama cuando el usuario ingresa el código en el modal de verificación
  const onVerify = async () => {
    if (verifyCode.trim().length !== 6) {
      setVerifyError('Ingresa el código de 6 dígitos enviado a tu correo.');
      return;
    }
    setVerifyLoading(true);
    setVerifyError('');
    try {
      await authApi.verificarCodigoCliente(form.email.trim().toLowerCase(), verifyCode.trim());

      // Código válido → envía la solicitud al backend
      await solicitudesApi.crear({
        nombreCliente:       form.name.trim(),
        telefono:            form.phone.trim(),
        correoCliente:       form.email.trim().toLowerCase(),
        marca:               form.brand.trim(),
        modelo:              form.model.trim(),
        anio:                parseInt(form.year, 10),
        placa:               form.plate.trim().toUpperCase(),
        kilometraje:         parseInt(form.mileage, 10),
        tipoServicio:        form.service === 'Otro' ? form.otherService.trim() : form.service,
        descripcionProblema: form.details.trim(),
        fechaCita:           appointmentDate
          ? new Date(`${appointmentDate.toISOString().split('T')[0]}T${appointmentTime}:00`).toISOString()
          : new Date().toISOString(),
        horaCita:            appointmentTime ?? undefined,
      });

      setVerifyVisible(false);
      resetForm();
      showSuccess();
    } catch (err: any) {
      setVerifyError(err?.message ?? 'Código incorrecto o expirado. Intenta de nuevo.');
    } finally {
      setVerifyLoading(false);
    }
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

  // Abre el manual PDF local usando expo-asset + expo-file-system + expo-sharing
  // Flujo: resuelve URI del bundle → copia a directorio de caché → abre con app del sistema
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

      // 2. Copia el archivo al directorio de caché del dispositivo con nombre legible
      const destUri = FileSystem.cacheDirectory + 'Mecanic-ManualFormulario.pdf';
      await FileSystem.copyAsync({ from: asset.localUri, to: destUri });

      // 3. Verifica si el dispositivo puede compartir archivos
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Error', 'Tu dispositivo no soporta abrir archivos externos.');
        return;
      }

      // 4. Abre el diálogo nativo para abrir/compartir el PDF
      await Sharing.shareAsync(destUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Manual de Formulario — Mecanic Company',
        UTI: 'com.adobe.pdf', // iOS
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudo abrir el manual PDF.');
    }
  };

  //Render de componente
  return (
    // Contenedor raíz que ocupa toda la pantalla (style: flex:1, fondo negro)
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

              {/* Botón estático centrado */}
              <Pressable
                style={({ pressed }) => [
                  styles.heroCitaButton,
                  pressed && styles.heroCitaButtonPressed,
                ]}
                onPress={() => scrollRef.current?.scrollTo({ y: formPosition, animated: true })}
              >
                {({ pressed }) => (
                  <Text style={[styles.heroCitaButtonText, pressed && styles.heroCitaButtonTextPressed]}>
                    SOLICITA TU CITA
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Indicadores de puntos eliminados */}
          </View>

          {/* ── SECCIÓN VIDEO DE FONDO ──
            Pegado al carrusel (sin marginTop), video más alto y más oscuro.
            logotipoTransparente con animación de aparición + Subtitulo1.png grande debajo. */}
          <View style={styles.videoBgSection}>

            {/* Video de fondo en loop, silenciado, sin controles */}
            <Video
              source={require('../../assets/videos/videoplayback.webm')}
              style={styles.videoBg}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted
              shouldPlay
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
          <View style={styles.vehicleCarousel}>
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
                      width: Dimensions.get('window').width, // Cada slide ocupa el ancho completo de la pantalla
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
              onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)} // Guarda el ancho real
              style={styles.aboutCarouselWrapper}
            >
              {/* IIFE (función autoejecutable) para calcular variables locales antes del return */}
              {(() => {
                // Calcula el padding lateral para centrar la tarjeta activa en el contenedor.
                // (ancho del contenedor - ancho de la tarjeta) / 2 = espacio a cada lado
                const sidePadding = (carouselWidth - CARD_WIDTH) / 2;

                // Genera los offsets exactos de snap para cada tarjeta.
                // snapToOffsets trabaja sobre el contentOffset real del scroll (sin padding).
                const snapOffsets = aboutCards.map((_, i) => i * ITEM_WIDTH);

                // El contentContainerStyle se calcula aquí porque sidePadding es dinámico
                // (depende del ancho real del contenedor, no puede ir en StyleSheet.create)
                const carouselContentStyle = { paddingHorizontal: sidePadding, paddingVertical: 20 };

                return (
                  // Animated.ScrollView para poder vincular el scroll a aboutScrollX
                  // y calcular la escala de cada tarjeta en tiempo real
                  <Animated.ScrollView
                    ref={aboutSliderRef}                    // Ref para scroll programático con las flechas
                    horizontal                              // Scroll horizontal
                    showsHorizontalScrollIndicator={false}  // Oculta la barra de scroll
                    snapToOffsets={snapOffsets}             // Snap exacto a cada tarjeta
                    decelerationRate="fast"                 // Frenado rápido para snap preciso
                    contentContainerStyle={carouselContentStyle} // Padding dinámico para centrar
                    contentOffset={{ x: ITEM_WIDTH, y: 0 }} // Inicia en la tarjeta central (Misión, índice 1)
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: aboutScrollX } } }], // Vincula scroll a aboutScrollX
                      { useNativeDriver: true }, // Driver nativo para máximo rendimiento
                    )}
                    // Se ejecuta cuando el usuario termina de deslizar manualmente
                    onMomentumScrollEnd={(e) => {
                      // Calcula el índice de la tarjeta visible dividiendo el offset por el ancho de cada slot
                      const i = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                      setAboutIndex(i); // Actualiza el índice activo para sincronizar las flechas
                    }}
                    scrollEventThrottle={16} // Frecuencia de eventos de scroll (~60fps)
                  >
                    {/* Itera sobre las tarjetas para renderizar cada una con animación de escala */}
                    {aboutCards.map((card, index) => {
                      // Interpola la escala de esta tarjeta basándose en la posición del scroll.
                      // Cuando la tarjeta está centrada (offset = index * ITEM_WIDTH) → escala 1.0
                      // Cuando está a un slot de distancia → escala 0.85 (más pequeña)
                      const scale = aboutScrollX.interpolate({
                        inputRange: [
                          (index - 1) * ITEM_WIDTH, // Posición cuando la tarjeta anterior está centrada
                          index * ITEM_WIDTH,        // Posición cuando ESTA tarjeta está centrada → máximo
                          (index + 1) * ITEM_WIDTH,  // Posición cuando la tarjeta siguiente está centrada
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
                transform: [{ translateX: hammerTranslateX }], // Desplazamiento horizontal (400 → 0)
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

        {/* FORMULARIO DE SOLICITUD
            onLayout captura la posición Y del formulario para que el botón
            "SOLICITA TU CITA" del carrusel hero haga scroll directo aquí. */}
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

            {/* SEPARADOR: Datos personales*/}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Datos personales</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo: Nombre completo del cliente */}
            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor="#94A3B8"
              value={form.name}
              onChangeText={(t) => { setForm((p) => ({ ...p, name: t })); setErrName(''); }}
              style={[styles.input, errName ? styles.inputError : null]}
            />
            {errName ? <Text style={styles.fieldError}>{errName}</Text> : null}

            {/* Campo: Teléfono — teclado numérico optimizado para teléfonos */}
            <TextInput
              placeholder="Teléfono"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => { setForm((p) => ({ ...p, phone: t })); setErrPhone(''); }}
              style={[styles.input, errPhone ? styles.inputError : null]}
            />
            {errPhone ? <Text style={styles.fieldError}>{errPhone}</Text> : null}

            {/* Campo: Correo electrónico — teclado con @ visible */}
            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(t) => { setForm((p) => ({ ...p, email: t })); setErrEmail(''); }}
              style={[styles.input, errEmail ? styles.inputError : null]}
            />
            {errEmail ? <Text style={styles.fieldError}>{errEmail}</Text> : null}

            {/* SEPARADOR: Información del vehículo */}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Información del Vehículo</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo: Marca del vehículo */}
            <TextInput
              placeholder="Marca"
              placeholderTextColor="#94A3B8"
              value={form.brand}
              onChangeText={(t) => { setForm((p) => ({ ...p, brand: t })); setErrBrand(''); }}
              style={[styles.input, errBrand ? styles.inputError : null]}
            />
            {errBrand ? <Text style={styles.fieldError}>{errBrand}</Text> : null}

            {/* Fila: Modelo + Año en la misma línea */}
            <View style={styles.formRow}>
              <View style={styles.inputHalf}>
                <TextInput
                  placeholder="Modelo"
                  placeholderTextColor="#94A3B8"
                  value={form.model}
                  onChangeText={(t) => { setForm((p) => ({ ...p, model: t })); setErrModel(''); }}
                  style={[styles.input, errModel ? styles.inputError : null]}
                />
                {errModel ? <Text style={styles.fieldError}>{errModel}</Text> : null}
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  placeholder="Año"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
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
                <TextInput
                  placeholder="Placa"
                  placeholderTextColor="#94A3B8"
                  value={form.plate}
                  onChangeText={(t) => { setForm((p) => ({ ...p, plate: t })); setErrPlate(''); }}
                  style={[styles.input, errPlate ? styles.inputError : null]}
                />
                {errPlate ? <Text style={styles.fieldError}>{errPlate}</Text> : null}
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  placeholder="Kilometraje"
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
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Tipo de Servicio</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Botón del dropdown de tipo de servicio */}
            <Pressable
              style={[styles.dropdown, errService ? styles.inputError : null]}
              onPress={() => setServiceDropdownOpen((v) => !v)}
            >
              <Text style={form.service ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {form.service || 'Selecciona un tipo de servicio'}
              </Text>
              <Text style={styles.dropdownArrow}>{serviceDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {errService ? <Text style={styles.fieldError}>{errService}</Text> : null}

            {/* Lista de opciones del dropdown — solo visible cuando serviceDropdownOpen === true */}
            {serviceDropdownOpen && (
              <View style={styles.dropdownList}>
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
                    }}
                  >
                    {/* Checkmark ✓ si esta opción está seleccionada, espacios si no */}
                    <Text style={styles.dropdownItemCheck}>
                      {form.service === option ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Campo extra: solo visible cuando el servicio seleccionado es "Otro" */}
            {form.service === 'Otro' && (
              <>
                <TextInput
                  placeholder="Describe brevemente el tipo de servicio"
                  placeholderTextColor="#94A3B8"
                  value={form.otherService}
                  onChangeText={(t) => { setForm((p) => ({ ...p, otherService: t })); setErrOther(''); }}
                  style={[styles.input, errOther ? styles.inputError : null]}
                />
                {errOther ? <Text style={styles.fieldError}>{errOther}</Text> : null}
              </>
            )}

            {/* SEPARADOR: Descripción del problema*/}
            <View style={styles.formDivider}>
              <View style={styles.formDividerLine} />
              <Text style={styles.formDividerText}>Descripción del problema</Text>
              <View style={styles.formDividerLine} />
            </View>

            {/* Campo multilínea para describir el problema del vehículo */}
            <TextInput
              placeholder="Describe el problema o síntoma que presenta tu vehículo..."
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
                      const isPast = day < today;                                           // Día pasado
                      const isSelected = appointmentDate?.toDateString() === day.toDateString(); // Seleccionado
                      const isToday = day.toDateString() === today.toDateString();            // Hoy
                      return (
                        <Pressable
                          key={i}
                          style={[
                            styles.calendarCell,
                            isToday && styles.calendarCellToday,    // Borde azul si es hoy
                            isSelected && styles.calendarCellSelected, // Fondo azul si seleccionado
                            isPast && styles.calendarCellPast,     // Opacidad reducida si pasado
                          ]}
                          // Selecciona el día y cierra el modal (solo si no es pasado)
                          onPress={() => { if (!isPast) { setAppointmentDate(day); setCalendarVisible(false); } }}
                          disabled={isPast} // Deshabilita los días pasados
                        >
                          <Text style={[
                            styles.calendarCellText,
                            isToday && styles.calendarCellTodayText,
                            isSelected && styles.calendarCellSelectedText,
                            isPast && styles.calendarCellPastText,
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
                <ScrollView
                  style={styles.timeScrollList}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                >
                  {timeOptions.map((t) => (
                    <Pressable
                      key={t}
                      style={[styles.dropdownItem, appointmentTime === t && styles.dropdownItemActive]}
                      onPress={() => { setAppointmentTime(t); setTimeDropdownOpen(false); }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {appointmentTime === t ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{t}</Text>
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
                verifySending && { opacity: 0.6 },
              ]}
              onPress={onSend}
              disabled={verifySending}
            >
              {({ pressed }) => (
                <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                  {verifySending ? 'Enviando código...' : 'ENVIAR SOLICITUD'}
                </Text>
              )}
            </Pressable>

            {/* Enlace para descargar el manual PDF */}
            <Text style={styles.manualText}>¿No sabes cómo llenar el formulario?</Text>
            <Pressable onPress={openManualPDF}>
              <Text style={styles.manualLink}>Descargar manual PDF</Text>
            </Pressable>

          </View>
        </View>

        {/* ECCIÓN UBICACIÓN*/}
        <View style={styles.section}>

          {/* Título centrado */}
          <Text style={styles.locationTitle}>UBICACION MECANICA</Text>

          {/* Dirección centrada */}
          <Text style={styles.locationAddress}>
            SM Quality Tires{'\n'}
            Av. Río Coca y Isla Pinzón E10-100{'\n'}
            Quito, Ecuador
          </Text>

          {/* Mapa manipulable: scrollEnabled y zoomEnabled activos */}
          <MapView
            style={styles.mapWebView}
            initialRegion={{
              latitude: -0.1632772,
              longitude: -78.4766773,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomControlEnabled={true}
          >
            <Marker
              coordinate={{ latitude: -0.1632772, longitude: -78.4766773 }}
              title="SM Quality Tires"
              description="Av. Río Coca y Isla Pinzón E10-100, Quito"
            />
          </MapView>

          {/* Botón Abrir Google Maps */}
          <Pressable
            style={({ pressed }) => [
              styles.mapsButton,
              pressed && styles.mapsButtonPressed,
            ]}
            onPress={() =>
              Linking.openURL(
                'https://www.google.com/maps/dir//SM+QUALITY+TIRES,+Av.+R%C3%ADo+Coca+y+Isla+Pinz%C3%B3n+E10-100,+170138+Quito/@-0.1632772,-78.4766773,15z'
              )
            }
          >
            {({ pressed }) => (
              <View style={styles.mapsButtonContent}>
                {/* Ícono de ubicación de FontAwesome como representación de Google Maps */}
                <FontAwesome
                  name="map-marker"
                  size={20}
                  color={pressed ? '#000000' : '#FFFFFF'}
                  style={styles.mapsButtonIcon}
                />
                <Text style={[styles.mapsButtonText, pressed && styles.mapsButtonTextPressed]}>
                  Abrir Google Maps
                </Text>
              </View>
            )}
          </Pressable>

        </View>

      </ScrollView>

      {/* ─── Modal: éxito al enviar solicitud ─────────────────────────────── */}
      <Modal visible={successVisible} transparent animationType="none">
        <Animated.View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center', alignItems: 'center', padding: 32,
          opacity: successOpacity,
        }}>
          <Animated.View style={{
            backgroundColor: '#ffffff', borderRadius: 20, padding: 36,
            width: '100%', maxWidth: 360, alignItems: 'center',
            transform: [{ scale: successScale }],
            shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18, shadowRadius: 20, elevation: 12,
          }}>
            {/* Ícono de check */}
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: '#111111', justifyContent: 'center',
              alignItems: 'center', marginBottom: 20,
            }}>
              <FontAwesome name="check" size={32} color="#ffffff" />
            </View>

            <Text style={{
              fontSize: 22, fontWeight: '800', color: '#111111',
              marginBottom: 10, textAlign: 'center', letterSpacing: 0.3,
            }}>
              ¡Solicitud enviada!
            </Text>

            <Text style={{
              fontSize: 14, color: '#555555', textAlign: 'center',
              lineHeight: 22, marginBottom: 28,
            }}>
              Tu solicitud fue registrada correctamente.{`\n`}
              Pronto nos pondremos en contacto contigo.
            </Text>

            {/* Separador */}
            <View style={{ width: '100%', height: 1, backgroundColor: '#eeeeee', marginBottom: 20 }} />

            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#333333' : '#111111',
                borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48,
              })}
              onPress={hideSuccess}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 }}>
                Aceptar
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* ─── Modal: verificación de correo del cliente ───────────────────── */}
      <Modal
        visible={verifyVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVerifyVisible(false)}
      >
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center', alignItems: 'center', padding: 24,
        }}>
          <View style={{
            backgroundColor: '#1E293B', borderRadius: 16, padding: 28,
            width: '100%', maxWidth: 380,
          }}>
            <Text style={{ color: '#F1F5F9', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
              Verifica tu correo
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, marginBottom: 20, lineHeight: 20 }}>
              Enviamos un código de 6 dígitos a{'\n'}
              <Text style={{ color: '#60A5FA', fontWeight: '600' }}>{form.email}</Text>
              {'\n'}Ingresa el código para confirmar tu solicitud.
            </Text>

            <TextInput
              style={{
                backgroundColor: '#0F172A', color: '#F1F5F9',
                borderWidth: 1, borderColor: verifyError ? '#EF4444' : '#334155',
                borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12,
                fontSize: 22, letterSpacing: 8, textAlign: 'center', marginBottom: 8,
              }}
              placeholder="000000"
              placeholderTextColor="#475569"
              keyboardType="number-pad"
              maxLength={6}
              value={verifyCode}
              onChangeText={(t) => { setVerifyCode(t); setVerifyError(''); }}
            />
            {verifyError ? (
              <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{verifyError}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#1D4ED8' : '#3B82F6',
                borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8,
                opacity: verifyLoading ? 0.6 : 1,
              })}
              onPress={onVerify}
              disabled={verifyLoading}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>
                {verifyLoading ? 'Verificando...' : 'Confirmar y enviar'}
              </Text>
            </Pressable>

            <Pressable
              style={{ marginTop: 14, alignItems: 'center' }}
              onPress={() => setVerifyVisible(false)}
            >
              <Text style={{ color: '#64748B', fontSize: 14 }}>Cancelar</Text>
            </Pressable>

            {/* ── Reenviar código ── */}
            <Pressable
              style={{ marginTop: 10, alignItems: 'center', opacity: resendCooldown > 0 ? 0.4 : 1 }}
              disabled={resendCooldown > 0}
              onPress={async () => {
                setVerifyError('');
                setVerifyCode('');
                try {
                  await authApi.enviarCodigoCliente(form.email.trim().toLowerCase());
                  setResendCooldown(30);
                  if (resendTimer.current) clearInterval(resendTimer.current);
                  resendTimer.current = setInterval(() => {
                    setResendCooldown((prev) => {
                      if (prev <= 1) { clearInterval(resendTimer.current!); return 0; }
                      return prev - 1;
                    });
                  }, 1000);
                } catch {
                  setVerifyError('No se pudo reenviar el código. Intenta de nuevo.');
                }
              }}
            >
              <Text style={{ color: '#60A5FA', fontSize: 13 }}>
                {resendCooldown > 0
                  ? `Reenviar código (${resendCooldown}s)`
                  : 'Reenviar código'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}
