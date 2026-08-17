// soporte.tsx
// Pantalla de soporte técnico para clientes
// Permite enviar reportes de problemas o consultas generales

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import NavbarCliente from '@/components/navbarCliente/navbarCliente';
import ConfirmacionSoporte from './ModalConfirmacionReporte/confirmacionSoporte';
import ReporteExitoso from './ModalConfirmacionReporte/reporteExistoso';
import styles from '@/Styles/pantallaCliente/soporte';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarCorreo,
  validarObligatorio,
  validarTextoYNumeros,
} from '@/utils/validaciones';

// Opciones de tipos de asunto
const tiposAsunto = [
  'Consulta general',
  'Problema técnico',
  'Sugerencia',
  'Reclamo',
  'Facturación',
  'Otro',
];

export default function SoporteScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // BackHandler: regresa a index (PantallaCliente)
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.push('/PantallaCliente' as any);
        return true;
      });
      return () => backHandler.remove();
    }, [router]),
  );

  // Valores animados para la entrada del logotipo
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  // Estados del formulario
  const [form, setForm] = useState({
    nombre: '',
    segundoNombre: '',
    apellido: '',
    segundoApellido: '',
    correo: '',
    tipoAsunto: '',
    descripcion: '',
  });

  // Estados de error
  const [errNombre, setErrNombre] = useState('');
  const [errSegundoNombre, setErrSegundoNombre] = useState('');
  const [errApellido, setErrApellido] = useState('');
  const [errSegundoApellido, setErrSegundoApellido] = useState('');
  const [errCorreo, setErrCorreo] = useState('');
  const [errTipoAsunto, setErrTipoAsunto] = useState('');
  const [errDescripcion, setErrDescripcion] = useState('');

  // Estados de los modales
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [exitosoVisible, setExitosoVisible] = useState(false);

  // Estado del dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dispara la animación del logo al montar el componente
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // Limpiar todos los campos cada vez que la pantalla gana foco (cuando se regresa de otra pantalla)
  useFocusEffect(
    useCallback(() => {
      setForm({
        nombre: '',
        segundoNombre: '',
        apellido: '',
        segundoApellido: '',
        correo: '',
        tipoAsunto: '',
        descripcion: '',
      });
      setErrNombre('');
      setErrSegundoNombre('');
      setErrApellido('');
      setErrSegundoApellido('');
      setErrCorreo('');
      setErrTipoAsunto('');
      setErrDescripcion('');
      setDropdownOpen(false);
    }, [])
  );

  // Navega al index pasando el parámetro scrollTo='cards'
  const handleScrollToAbout = () => {
    router.push({ pathname: '/PantallaCliente' as any, params: { scrollTo: 'cards' } });
  };

  // Navega al inicio del index
  const handleScrollToTop = () => {
    router.push('/PantallaCliente' as any);
  };

  // Validación y apertura del modal de confirmación
  const handleVerificarReporte = () => {
    // Validar cada campo
    const eNombre = validarUnNombre(form.nombre, 'El nombre');
    const eSegundoNombre = validarSegundoNombre(form.segundoNombre, 'El segundo nombre');
    const eApellido = validarUnNombre(form.apellido, 'El apellido');
    const eSegundoApellido = validarSegundoNombre(form.segundoApellido, 'El segundo apellido');
    const eCorreo = validarCorreo(form.correo);
    const eTipoAsunto = validarObligatorio(form.tipoAsunto, 'El tipo de asunto');
    const eDescripcion = validarTextoYNumeros(form.descripcion, 'La descripción');

    setErrNombre(eNombre ?? '');
    setErrSegundoNombre(eSegundoNombre ?? '');
    setErrApellido(eApellido ?? '');
    setErrSegundoApellido(eSegundoApellido ?? '');
    setErrCorreo(eCorreo ?? '');
    setErrTipoAsunto(eTipoAsunto ?? '');
    setErrDescripcion(eDescripcion ?? '');

    // Si hay algún error, no continúa
    if ([eNombre, eSegundoNombre, eApellido, eSegundoApellido, eCorreo, eTipoAsunto, eDescripcion].some(Boolean)) return;

    // Todo válido → mostrar modal de confirmación
    setConfirmacionVisible(true);
  };

  // Envío del reporte
  const handleEnviarReporte = () => {
    // Cerrar modal de confirmación
    setConfirmacionVisible(false);
    
    // Mostrar modal de éxito
    setExitosoVisible(true);
    
    // Limpiar formulario
    setForm({
      nombre: '',
      segundoNombre: '',
      apellido: '',
      segundoApellido: '',
      correo: '',
      tipoAsunto: '',
      descripcion: '',
    });
  };

  const handleCerrarExitoso = () => {
    setExitosoVisible(false);
  };

  return (
    <View style={styles.page}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Navbar sticky del cliente */}
        <NavbarCliente
          onScrollToAbout={handleScrollToAbout}
          onScrollToTop={handleScrollToTop}
        />

        {/* LOGOTIPO ANIMADO */}
        <Animated.View
          style={[
            styles.logoSection,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require('../../assets/images/logotipoTransparente.png')}
            contentFit="contain"
            style={styles.logo}
          />
        </Animated.View>

        {/* TÍTULO Y DESCRIPCIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <Text style={styles.sectionSubtitle}>
            ¿Tienes alguna consulta o problema? Completa el formulario a continuación y nuestro
            equipo de soporte se pondrá en contacto contigo lo antes posible.
          </Text>

          {/* FORMULARIO */}
          <View style={styles.form}>
            {/* Campo: Nombre */}
            <Text style={styles.fieldLabel}>Nombre</Text>
            <TextInput
              placeholder="Ej: Juan"
              placeholderTextColor="#94A3B8"
              value={form.nombre}
              onChangeText={(t) => {
                // Solo permite letras
                const filtered = t.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                setForm((p) => ({ ...p, nombre: filtered }));
                setErrNombre('');
              }}
              style={[styles.input, errNombre ? styles.inputError : null]}
            />
            {errNombre ? <Text style={styles.fieldError}>{errNombre}</Text> : null}

            {/* Campo: Segundo Nombre (Opcional) */}
            <Text style={styles.fieldLabel}>Segundo Nombre (Opcional)</Text>
            <TextInput
              placeholder="Ej: Carlos"
              placeholderTextColor="#94A3B8"
              value={form.segundoNombre}
              onChangeText={(t) => {
                // Solo permite letras
                const filtered = t.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                setForm((p) => ({ ...p, segundoNombre: filtered }));
                setErrSegundoNombre('');
              }}
              style={[styles.input, errSegundoNombre ? styles.inputError : null]}
            />
            {errSegundoNombre ? <Text style={styles.fieldError}>{errSegundoNombre}</Text> : null}

            {/* Campo: Apellido */}
            <Text style={styles.fieldLabel}>Apellido</Text>
            <TextInput
              placeholder="Ej: Pérez"
              placeholderTextColor="#94A3B8"
              value={form.apellido}
              onChangeText={(t) => {
                // Solo permite letras
                const filtered = t.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                setForm((p) => ({ ...p, apellido: filtered }));
                setErrApellido('');
              }}
              style={[styles.input, errApellido ? styles.inputError : null]}
            />
            {errApellido ? <Text style={styles.fieldError}>{errApellido}</Text> : null}

            {/* Campo: Segundo Apellido (Opcional) */}
            <Text style={styles.fieldLabel}>Segundo Apellido (Opcional)</Text>
            <TextInput
              placeholder="Ej: García"
              placeholderTextColor="#94A3B8"
              value={form.segundoApellido}
              onChangeText={(t) => {
                // Solo permite letras
                const filtered = t.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
                setForm((p) => ({ ...p, segundoApellido: filtered }));
                setErrSegundoApellido('');
              }}
              style={[styles.input, errSegundoApellido ? styles.inputError : null]}
            />
            {errSegundoApellido ? <Text style={styles.fieldError}>{errSegundoApellido}</Text> : null}

            {/* Campo: Correo Electrónico */}
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <TextInput
              placeholder="Ej: juan.perez@gmail.com"
              placeholderTextColor="#94A3B8"
              value={form.correo}
              onChangeText={(t) => {
                setForm((p) => ({ ...p, correo: t }));
                setErrCorreo('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errCorreo ? styles.inputError : null]}
            />
            {errCorreo ? <Text style={styles.fieldError}>{errCorreo}</Text> : null}

            {/* Selector: Tipo de Asunto */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.filterLabel}>Tipo de Asunto</Text>
              <Pressable
                style={[styles.dropdown, errTipoAsunto ? styles.inputError : null]}
                onPress={() => setDropdownOpen((v) => !v)}
              >
                <Text style={form.tipoAsunto ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                  {form.tipoAsunto || 'Selecciona el tipo de asunto'}
                </Text>
                <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
              </Pressable>
              {errTipoAsunto ? <Text style={styles.fieldError}>{errTipoAsunto}</Text> : null}

              {/* Lista de opciones del dropdown */}
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {tiposAsunto.map((option, index) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        form.tipoAsunto === option && styles.dropdownItemActive,
                        index === tiposAsunto.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => {
                        setForm((p) => ({ ...p, tipoAsunto: option }));
                        setDropdownOpen(false);
                        setErrTipoAsunto('');
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {form.tipoAsunto === option ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Campo: Descripción */}
            <Text style={styles.fieldLabel}>Descripción</Text>
            <TextInput
              placeholder="Describe tu consulta o problema"
              placeholderTextColor="#94A3B8"
              value={form.descripcion}
              onChangeText={(t) => {
                const filtered = t.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                setForm((p) => ({ ...p, descripcion: filtered }));
                setErrDescripcion('');
              }}
              multiline
              style={[styles.input, styles.textarea, errDescripcion ? styles.inputError : null]}
            />
            {errDescripcion ? <Text style={styles.fieldError}>{errDescripcion}</Text> : null}

            {/* Botón: Verificar Reporte */}
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
              onPress={handleVerificarReporte}
            >
              {({ pressed }) => (
                <Text style={[styles.submitButtonText, pressed && styles.submitButtonTextPressed]}>
                  VERIFICAR ENVÍO
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* FOOTER */}
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
              <>
                <Text style={[
                  styles.scrollTopText,
                  pressed && styles.scrollTopTextPressed
                ]}>
                  REGRESAR ARRIBA
                </Text>
                <FontAwesome 
                  name="arrow-up" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'} 
                  style={styles.scrollTopIcon}
                />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* MODALES */}
      <ConfirmacionSoporte
        visible={confirmacionVisible}
        datos={form}
        onEnviar={handleEnviarReporte}
        onCerrar={() => setConfirmacionVisible(false)}
      />
      <ReporteExitoso
        visible={exitosoVisible}
        onCerrar={handleCerrarExitoso}
      />
    </View>
  );
}
