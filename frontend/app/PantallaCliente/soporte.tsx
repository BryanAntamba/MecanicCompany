// soporte.tsx
// Pantalla de soporte técnico para clientes
// Permite enviar reportes de problemas o consultas generales

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  BackHandler,
  Platform,
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
import { useCliente } from '@/context/ClienteContext';
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
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { reporteSoporteApi } from '@/utils/api';

// Opciones de tipos de asunto
const tiposAsunto = [
  'Consulta general',
  'Problema técnico',
  'Sugerencia',
  'Reclamo',
  'Comprobante',
  'Otro',
];

export default function SoporteScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    correoCliente,
    nombrePrimerCliente,
    nombreSegundoCliente,
    apellidoPrimerCliente,
    apellidoSegundoCliente,
  } = useCliente();

  // BackHandler: regresa a index (PantallaCliente, solo en móvil)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') return;

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

  // Estados de error (solo campos editables)
  const [errTipoAsunto, setErrTipoAsunto] = useState('');
  const [errDescripcion, setErrDescripcion] = useState('');

  // Estados de los modales
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [exitosoVisible, setExitosoVisible] = useState(false);

  // Estado del dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Estado de carga y mensajes
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        nombre: nombrePrimerCliente || '',
        segundoNombre: nombreSegundoCliente || '',
        apellido: apellidoPrimerCliente || '',
        segundoApellido: apellidoSegundoCliente || '',
        correo: correoCliente || '',
        tipoAsunto: '',
        descripcion: '',
      });
      // Solo limpiar errores de campos editables
      setErrTipoAsunto('');
      setErrDescripcion('');
      setDropdownOpen(false);
      setSuccessMessage('');
    }, [nombrePrimerCliente, nombreSegundoCliente, apellidoPrimerCliente, apellidoSegundoCliente, correoCliente])
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
    // Validar solo los campos editables (tipo de asunto y descripción)
    const eTipoAsunto = validarObligatorio(form.tipoAsunto, 'El tipo de asunto');
    const eDescripcion = validarTextoYNumeros(form.descripcion, 'La descripción');

    setErrTipoAsunto(eTipoAsunto ?? '');
    setErrDescripcion(eDescripcion ?? '');

    // Si hay algún error, no continúa
    if ([eTipoAsunto, eDescripcion].some(Boolean)) return;

    // Todo válido → mostrar modal de confirmación
    setConfirmacionVisible(true);
  };

  // Envío del reporte
  const handleEnviarReporte = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Enviando reporte de soporte...');

      // Llamar a la API
      const response = await reporteSoporteApi.crear({
        nombre: form.nombre,
        segundoNombre: form.segundoNombre || undefined,
        apellido: form.apellido,
        segundoApellido: form.segundoApellido || undefined,
        correo: form.correo,
        tipoAsunto: form.tipoAsunto,
        descripcion: form.descripcion,
      });

      console.log('✅ Reporte enviado exitosamente:', response);

      // Cerrar modal de confirmación
      setConfirmacionVisible(false);

      // Mostrar mensaje de éxito
      setSuccessMessage('¡Reporte enviado correctamente! Te contactaremos pronto.');
      setExitosoVisible(true);

      // Limpiar formulario
      setForm({
        nombre: nombrePrimerCliente || '',
        segundoNombre: nombreSegundoCliente || '',
        apellido: apellidoPrimerCliente || '',
        segundoApellido: apellidoSegundoCliente || '',
        correo: correoCliente || '',
        tipoAsunto: '',
        descripcion: '',
      });
    } catch (err: any) {
      console.error('❌ Error al enviar reporte:', err);
      setSuccessMessage('Error al enviar el reporte. Intenta de nuevo.');
      setExitosoVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCerrarExitoso = () => {
    setExitosoVisible(false);
  };

  return (
    <ResponsiveContainer>
      <View style={styles.page}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          overScrollMode="always"
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
            {/* Sección: TUS DATOS (No Editable) */}
            <View style={{ marginBottom: 20, padding: 12, backgroundColor: '#0F172A', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#3B82F6' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#F1F5F9', marginBottom: 12 }}>Tus Datos</Text>
              
              {/* Campo: Nombre (No Editable) */}
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                placeholder="Ej: Juan"
                placeholderTextColor="#94A3B8"
                value={form.nombre}
                editable={false}
                style={[styles.input, { backgroundColor: '#1E293B', color: '#CBD5E1' }]}
              />

              {/* Campo: Segundo Nombre (No Editable) - Solo si tiene valor */}
              {form.segundoNombre && (
                <>
                  <Text style={styles.fieldLabel}>Segundo Nombre</Text>
                  <TextInput
                    placeholder="Ej: Carlos"
                    placeholderTextColor="#94A3B8"
                    value={form.segundoNombre}
                    editable={false}
                    style={[styles.input, { backgroundColor: '#1E293B', color: '#CBD5E1' }]}
                  />
                </>
              )}

              {/* Campo: Apellido (No Editable) */}
              <Text style={styles.fieldLabel}>Apellido</Text>
              <TextInput
                placeholder="Ej: Pérez"
                placeholderTextColor="#94A3B8"
                value={form.apellido}
                editable={false}
                style={[styles.input, { backgroundColor: '#1E293B', color: '#CBD5E1' }]}
              />

            {/* Campo: Segundo Apellido (No Editable) - Solo si tiene valor */}
            {form.segundoApellido && (
              <>
                <Text style={styles.fieldLabel}>Segundo Apellido</Text>
                <TextInput
                  placeholder="Ej: García"
                  placeholderTextColor="#94A3B8"
                  value={form.segundoApellido}
                  editable={false}
                  style={[styles.input, { backgroundColor: '#1E293B', color: '#CBD5E1' }]}
                />
              </>
            )}

            {/* Campo: Correo Electrónico (No Editable) */}
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <TextInput
              placeholder="Ej: juan.perez@gmail.com"
              placeholderTextColor="#94A3B8"
              value={form.correo}
              editable={false}
              keyboardType="email-address"
              style={[styles.input, { backgroundColor: '#1E293B', color: '#CBD5E1' }]}
            />
            </View>

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
                <View style={styles.buttonContent}>
                  <FontAwesome 
                    name="check-circle" 
                    size={20} 
                    color={pressed ? '#FFFFFF' : '#000000'} 
                    style={styles.buttonIcon}
                  />
                  <Text style={[styles.submitButtonText, pressed && styles.submitButtonTextPressed]}>
                    VERIFICAR ENVÍO
                  </Text>
                </View>
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
        isLoading={isLoading}
      />
      <ReporteExitoso
        visible={exitosoVisible}
        onCerrar={handleCerrarExitoso}
        message={successMessage}
      />
      </View>
    </ResponsiveContainer>
  );
}
