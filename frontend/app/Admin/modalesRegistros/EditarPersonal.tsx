// EditarPersonal.tsx
// Modal para editar personal existente (Mecánico, Inventario o Financiero)

import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaAdmin/modalesRegistros/editarPersonal';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarTelefono,
  validarTextoYNumeros,
  validarObligatorio,
  validarCorreoGmail,
  validarCorreoMecanic,
  validarContrasena,
  validarConfirmarContrasena,
  validarSoloNumeros,
  validarEspecialidadOServicio,
} from '@/utils/validaciones';
import { BASE_URL } from '@/utils/api';

const ESPECIALIDADES = [
  'Motor',
  'Frenos',
  'Suspensión',
  'Electricidad automotriz',
  'Aire acondicionado',
  'Transmisión',
  'Diagnóstico computarizado',
  'Enderezado y pintura',
  'Mecánica general',
  'Otros',
] as const;

type TipoPersonal = 'Mecánico' | 'Inventario' | 'Financiero' | 'Administrador';

type FormState = {
  nombres: string;
  segundoNombre: string;
  apellidos: string;
  segundoApellido: string;
  edad: string;
  telefono: string;
  correo: string;
  correoEmpresarial: string;
  especialidadCatalogo: string;
  especialidadOtro: string;
  añosExperiencia: string;
  contraseña: string;
  confirmarContraseña: string;
  cuentaActiva: boolean;
  tipoPersonal: TipoPersonal;
};

type FormErrors = {
  nombres: string;
  segundoNombre: string;
  apellidos: string;
  segundoApellido: string;
  edad: string;
  telefono: string;
  correo: string;
  correoEmpresarial: string;
  especialidadCatalogo: string;
  especialidadOtro: string;
  añosExperiencia: string;
  contraseña: string;
  confirmarContraseña: string;
};

interface EditarPersonalProps {
  visible: boolean;
  mecanico: any | null;
  onClose: () => void;
  onSuccess: (mecanico: any) => void;
  token: string;
}

export default function EditarPersonal({
  visible,
  mecanico,
  onClose,
  onSuccess,
  token,
}: EditarPersonalProps) {
  const [form, setForm] = useState<FormState>({
    nombres: '',
    segundoNombre: '',
    apellidos: '',
    segundoApellido: '',
    edad: '',
    telefono: '',
    correo: '',
    correoEmpresarial: '',
    especialidadCatalogo: 'Motor',
    especialidadOtro: '',
    añosExperiencia: '',
    contraseña: '',
    confirmarContraseña: '',
    cuentaActiva: true,
    tipoPersonal: 'Mecánico',
  });

  const [errors, setErrors] = useState<FormErrors>({
    nombres: '',
    segundoNombre: '',
    apellidos: '',
    segundoApellido: '',
    edad: '',
    telefono: '',
    correo: '',
    correoEmpresarial: '',
    especialidadCatalogo: '',
    especialidadOtro: '',
    añosExperiencia: '',
    contraseña: '',
    confirmarContraseña: '',
  });

  const [espDropdown, setEspDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Bloquear capturas de pantalla cuando el modal está visible (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    
    if (visible) {
      const preventCapture = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventCapture();
    }
    // No llamamos allowScreenCaptureAsync() porque la pantalla principal debe mantener el bloqueo
  }, [visible]);

  useEffect(() => {
    if (mecanico) {
      const esCatalogada = (ESPECIALIDADES as readonly string[]).includes(mecanico.especialidad);
      
      // Determinar tipo de personal por tipoPersonal o correo empresarial
      let tipoPersonal: TipoPersonal = 'Mecánico';
      if (mecanico.tipoPersonal) {
        // Si ya tiene tipoPersonal definido, úsalo
        if (mecanico.tipoPersonal === 'Administrador') {
          tipoPersonal = 'Administrador';
        } else if (mecanico.tipoPersonal === 'Inventario') {
          tipoPersonal = 'Inventario';
        } else if (mecanico.tipoPersonal === 'Financiero') {
          tipoPersonal = 'Financiero';
        } else {
          tipoPersonal = 'Mecánico';
        }
      } else if (mecanico.correoEmpresarial) {
        // Fallback: determinar por correo empresarial
        if (mecanico.correoEmpresarial.endsWith('@inventariomecanic.com')) {
          tipoPersonal = 'Inventario';
        } else if (mecanico.correoEmpresarial.endsWith('@finanzasmecanic.com')) {
          tipoPersonal = 'Financiero';
        }
      }
      
      // Extraer solo la parte del usuario del correo empresarial (sin el dominio)
      const usuarioCorreoEmpresarial = mecanico.correoEmpresarial 
        ? mecanico.correoEmpresarial.split('@')[0] 
        : '';
      
      setForm({
        nombres: mecanico.nombres || '',
        segundoNombre: mecanico.segundoNombre || '',
        apellidos: mecanico.apellidos || '',
        segundoApellido: mecanico.segundoApellido || '',
        edad: String(mecanico.edad || ''),
        telefono: mecanico.telefono || '',
        correo: mecanico.correo || '',
        correoEmpresarial: usuarioCorreoEmpresarial,
        especialidadCatalogo: esCatalogada ? mecanico.especialidad : 'Otros',
        especialidadOtro: esCatalogada ? '' : mecanico.especialidad,
        añosExperiencia: String(mecanico.anosExperiencia || mecanico.añosExperiencia || ''),
        contraseña: '',
        confirmarContraseña: '',
        cuentaActiva: mecanico.cuentaActiva ?? true,
        tipoPersonal: mecanico.tipoPersonal || tipoPersonal,
      });
      setFotoUri(mecanico.fotoPerfil ?? null);
    }
  }, [mecanico]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      const asset = result.assets[0];
      const ext = asset.uri.split('.').pop()?.toLowerCase().split('?')[0] ?? 'jpg';
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      setFotoUri(`data:${mime};base64,${asset.base64}`);
    }
  };

  const getPlaceholderCorreo = () => {
    if (form.tipoPersonal === 'Mecánico' || form.tipoPersonal === 'Administrador') return 'juan@mecanic.com';
    if (form.tipoPersonal === 'Inventario') return 'juan@inventariomecanic.com';
    return 'juan@finanzasmecanic.com';
  };

  const getDominioEmpresarial = () => {
    switch (form.tipoPersonal) {
      case 'Mecánico':
      case 'Administrador':
        return '@mecanic.com';
      case 'Inventario':
        return '@inventariomecanic.com';
      case 'Financiero':
        return '@finanzasmecanic.com';
      default:
        return '@mecanic.com';
    }
  };

  const limpiarUsuarioCorreo = (v: string) => {
    // Solo permitir letras, números, guiones y puntos
    // Bloquear: @, espacios y otros caracteres especiales
    return v.replace(/[@\s]/g, '').toLowerCase();
  };

  const validarCorreoEmpresarial = (correo: string): string | null => {
    // Solo validar la parte del usuario (sin dominio), ya que el dominio se agrega automáticamente
    if (!correo.trim()) return 'El correo empresarial es obligatorio.';
    // Solo permitir caracteres válidos en la parte del usuario
    if (!/^[a-zA-Z0-9._%+-]+$/.test(correo.trim().toLowerCase())) {
      return 'El usuario no puede contener @, espacios u otros caracteres especiales.';
    }
    return null;
  };

  const guardar = async () => {
    // Validar que no intente cambiar de rol
    if (mecanico.tipoPersonal && mecanico.tipoPersonal !== form.tipoPersonal) {
      Alert.alert(
        'No permitido',
        'No puede cambiar el rol de un usuario existente. Debe eliminar y crear uno nuevo con el rol deseado.'
      );
      return;
    }

    const errorNombres = validarUnNombre(form.nombres, 'El nombre');
    const errorSegundoNombre = validarSegundoNombre(form.segundoNombre, 'El segundo nombre');
    const errorApellidos = validarUnNombre(form.apellidos, 'El apellido');
    const errorSegundoApellido = validarSegundoNombre(form.segundoApellido, 'El segundo apellido');
    const errorEdad = validarSoloNumeros(form.edad, 'La edad');
    const errorTelefono = validarTelefono(form.telefono);
    const errorCorreo = validarCorreoGmail(form.correo);
    const errorCorreoEmpresarial = validarCorreoEmpresarial(form.correoEmpresarial);
    
    // Solo validar especialidad y años si es Mecánico
    const errorEspecialidadCatalogo = form.tipoPersonal === 'Mecánico'
      ? validarObligatorio(form.especialidadCatalogo, 'La especialidad')
      : null;
    const errorEspecialidadOtro =
      form.tipoPersonal === 'Mecánico' && form.especialidadCatalogo === 'Otros'
        ? validarEspecialidadOServicio(form.especialidadOtro, 'especialidad')
        : null;
    const errorAñosExperiencia = form.tipoPersonal === 'Mecánico'
      ? validarSoloNumeros(form.añosExperiencia, 'Los años de experiencia')
      : null;
    
    const errorContraseña = form.contraseña.trim()
      ? validarContrasena(form.contraseña)
      : null;
    const errorConfirmarContraseña = form.contraseña.trim()
      ? validarConfirmarContrasena(form.contraseña, form.confirmarContraseña)
      : null;

    const edad = parseInt(form.edad, 10);
    const años = form.tipoPersonal === 'Mecánico' ? parseInt(form.añosExperiencia, 10) : 0;

    const errorEdadRango = !Number.isNaN(edad) && (edad < 18 || edad > 80)
      ? 'La edad debe estar entre 18 y 80 años.'
      : null;
    const errorAñosRango = form.tipoPersonal === 'Mecánico' && !Number.isNaN(años) && años < 0
      ? 'Los años de experiencia no pueden ser negativos.'
      : null;

    const nuevosErrores: FormErrors = {
      nombres: errorNombres ?? '',
      segundoNombre: errorSegundoNombre ?? '',
      apellidos: errorApellidos ?? '',
      segundoApellido: errorSegundoApellido ?? '',
      edad: errorEdad ?? errorEdadRango ?? '',
      telefono: errorTelefono ?? '',
      correo: errorCorreo ?? '',
      correoEmpresarial: errorCorreoEmpresarial ?? '',
      especialidadCatalogo: errorEspecialidadCatalogo ?? '',
      especialidadOtro: errorEspecialidadOtro ?? '',
      añosExperiencia: errorAñosExperiencia ?? errorAñosRango ?? '',
      contraseña: errorContraseña ?? '',
      confirmarContraseña: errorConfirmarContraseña ?? '',
    };

    setErrors(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some((value) => value.length > 0);
    if (hayErrores) return;

    setIsLoading(true);

    const especialidad = form.tipoPersonal === 'Mecánico'
      ? (form.especialidadCatalogo === 'Otros'
          ? form.especialidadOtro.trim()
          : form.especialidadCatalogo)
      : form.tipoPersonal;

    // Determinar endpoint según tipoPersonal
    let endpoint = '';
    switch (form.tipoPersonal) {
      case 'Mecánico':
        endpoint = '/mecanicos';
        break;
      case 'Financiero':
        endpoint = '/personal-financiero';
        break;
      case 'Inventario':
        endpoint = '/personal-inventario';
        break;
      case 'Administrador':
        endpoint = '/admin';
        break;
    }

    try {
      // Preparar payload según el tipo de personal
      let payload: any = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono.trim() || null,
      };

      // Agregar campos específicos para Mecánico y Admin
      if (form.tipoPersonal === 'Mecánico') {
        payload.segundoNombre = form.segundoNombre.trim() || null;
        payload.segundoApellido = form.segundoApellido.trim() || null;
        payload.edad = parseInt(form.edad, 10);
        payload.correo = form.correo.trim().toLowerCase();
        payload.correoEmpresarial = (form.correoEmpresarial.trim() + getDominioEmpresarial()).toLowerCase();
        payload.especialidad = especialidad;
        payload.anosExperiencia = parseInt(form.añosExperiencia, 10);
      } else if (form.tipoPersonal === 'Administrador') {
        payload.segundoNombre = form.segundoNombre.trim() || null;
        payload.segundoApellido = form.segundoApellido.trim() || null;
        payload.edad = parseInt(form.edad, 10);
        payload.correo = form.correo.trim().toLowerCase();
        payload.correoEmpresarial = (form.correoEmpresarial.trim() + getDominioEmpresarial()).toLowerCase();
      } else if (form.tipoPersonal === 'Financiero' || form.tipoPersonal === 'Inventario') {
        // Para Financiero e Inventario: incluir edad, correos
        payload.edad = parseInt(form.edad, 10) || null;
        payload.correo = form.correo.trim().toLowerCase();
        payload.correoEmpresarial = (form.correoEmpresarial.trim() + getDominioEmpresarial()).toLowerCase();
      }

      // Incluir contraseña solo si fue ingresada
      if (form.contraseña.trim()) {
        payload.contrasena = form.contraseña.trim();
      }

      // Incluir foto de perfil si fue capturada
      if (fotoUri) {
        payload.fotoPerfil = fotoUri;
      }

      console.log(`[EDITAR] ${form.tipoPersonal} - Enviando a ${endpoint}`, payload);

      const resp = await fetch(`${BASE_URL}${endpoint}/${mecanico.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.message || 'Error al actualizar');
      }

      const personalActualizado = await resp.json();
      console.log(`[EDITAR SUCCESS]`, personalActualizado);

      onSuccess({
        ...personalActualizado,
        tipoPersonal: form.tipoPersonal,
        rol: form.tipoPersonal === 'Administrador' ? 'Administrador' : form.tipoPersonal,
      });
      
      Alert.alert('Éxito', 'Personal actualizado correctamente.');
      onClose();
    } catch (error: any) {
      console.error('[EDITAR ERROR]', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el personal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextBlock}>
              <Text style={styles.modalTitle}>Editar Personal</Text>
              <Text style={styles.modalSubtitle}>
                Actualiza los datos del personal. La contraseña es opcional al editar.
              </Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>Edición</Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              hitSlop={8}
            >
              <FontAwesome name="times" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Selección de Tipo de Personal */}
            <Text style={styles.label}>Tipo de Personal</Text>
            <View style={styles.roleButtonsContainer}>
              <Pressable
                onPress={() => setForm({ ...form, tipoPersonal: 'Mecánico' })}
                style={[
                  styles.roleButton,
                  form.tipoPersonal === 'Mecánico' && styles.roleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    form.tipoPersonal === 'Mecánico' && styles.roleButtonTextActive,
                  ]}
                >
                  Mecánico
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setForm({ ...form, tipoPersonal: 'Inventario' })}
                style={[
                  styles.roleButton,
                  form.tipoPersonal === 'Inventario' && styles.roleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    form.tipoPersonal === 'Inventario' && styles.roleButtonTextActive,
                  ]}
                >
                  Inventario
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setForm({ ...form, tipoPersonal: 'Financiero' })}
                style={[
                  styles.roleButton,
                  form.tipoPersonal === 'Financiero' && styles.roleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    form.tipoPersonal === 'Financiero' && styles.roleButtonTextActive,
                  ]}
                >
                  Financiero
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setForm({ ...form, tipoPersonal: 'Administrador' })}
                style={[
                  styles.roleButton,
                  form.tipoPersonal === 'Administrador' && styles.roleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    form.tipoPersonal === 'Administrador' && styles.roleButtonTextActive,
                  ]}
                >
                  Administrador
                </Text>
              </Pressable>
            </View>

            {/* Foto de perfil */}
            <Pressable onPress={pickImage} style={styles.fotoContainer}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.foto} contentFit="cover" />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <FontAwesome name="camera" size={32} color="#64748B" />
                  <Text style={styles.fotoPlaceholderText}>Agregar foto</Text>
                </View>
              )}
            </Pressable>

            {/* Nombres */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholder="Ingrese el nombre"
              placeholderTextColor="#64748B"
              value={form.nombres}
              onChangeText={(v) => {
                setForm({ ...form, nombres: v });
                setErrors({ ...errors, nombres: '' });
              }}
              style={[styles.input, errors.nombres && styles.inputError]}
            />
            {!!errors.nombres && <Text style={styles.errorText}>{errors.nombres}</Text>}

            {/* Segundo Nombre */}
            <Text style={styles.label}>Segundo Nombre</Text>
            <TextInput
              placeholder="Ingrese el segundo nombre"
              placeholderTextColor="#64748B"
              value={form.segundoNombre}
              onChangeText={(v) => {
                setForm({ ...form, segundoNombre: v });
                setErrors({ ...errors, segundoNombre: '' });
              }}
              style={[styles.input, errors.segundoNombre && styles.inputError]}
            />
            {!!errors.segundoNombre && <Text style={styles.errorText}>{errors.segundoNombre}</Text>}

            {/* Apellidos */}
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              placeholder="Ingrese el apellido"
              placeholderTextColor="#64748B"
              value={form.apellidos}
              onChangeText={(v) => {
                setForm({ ...form, apellidos: v });
                setErrors({ ...errors, apellidos: '' });
              }}
              style={[styles.input, errors.apellidos && styles.inputError]}
            />
            {!!errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}

            {/* Segundo Apellido */}
            <Text style={styles.label}>Segundo Apellido</Text>
            <TextInput
              placeholder="Ingrese el segundo apellido"
              placeholderTextColor="#64748B"
              value={form.segundoApellido}
              onChangeText={(v) => {
                setForm({ ...form, segundoApellido: v });
                setErrors({ ...errors, segundoApellido: '' });
              }}
              style={[styles.input, errors.segundoApellido && styles.inputError]}
            />
            {!!errors.segundoApellido && <Text style={styles.errorText}>{errors.segundoApellido}</Text>}

            {/* Edad */}
            <Text style={styles.label}>Edad</Text>
            <TextInput
              placeholder="Entre 18 y 80 años"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={form.edad}
              onChangeText={(v) => {
                const soloNumeros = v.replace(/[^0-9]/g, '');
                setForm({ ...form, edad: soloNumeros });
                setErrors({ ...errors, edad: '' });
              }}
              style={[styles.input, errors.edad && styles.inputError]}
            />
            {!!errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}

            {/* Teléfono */}
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              placeholder="10 dígitos"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              value={form.telefono}
              onChangeText={(v) => {
                const soloNumeros = v.replace(/[^0-9]/g, '');
                setForm({ ...form, telefono: soloNumeros });
                setErrors({ ...errors, telefono: '' });
              }}
              maxLength={10}
              style={[styles.input, errors.telefono && styles.inputError]}
            />
            {!!errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

            {/* Correo Personal */}
            <Text style={styles.label}>Correo Personal</Text>
            <TextInput
              placeholder="juan@gmail.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.correo}
              onChangeText={(v) => {
                setForm({ ...form, correo: v });
                setErrors({ ...errors, correo: '' });
              }}
              style={[styles.input, errors.correo && styles.inputError]}
            />
            {!!errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}

            {/* Correo Empresarial */}
            <Text style={styles.label}>Correo Empresarial</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <TextInput
                placeholder="usuario"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                value={form.correoEmpresarial}
                onChangeText={(v) => {
                  const usuarioLimpio = limpiarUsuarioCorreo(v);
                  setForm({ ...form, correoEmpresarial: usuarioLimpio });
                  setErrors({ ...errors, correoEmpresarial: '' });
                }}
                style={[styles.input, errors.correoEmpresarial && styles.inputError, { flex: 1, paddingRight: 0 }]}
              />
              <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '500', paddingHorizontal: 8 }}>
                {getDominioEmpresarial()}
              </Text>
            </View>
            {!!errors.correoEmpresarial && <Text style={styles.errorText}>{errors.correoEmpresarial}</Text>}

            {/* Campos específicos para Mecánicos */}
            {form.tipoPersonal === 'Mecánico' && (
              <>
                {/* Especialidad */}
                <Text style={styles.label}>Especialidad</Text>
                <Pressable
                  style={styles.dropdown}
                  onPress={() => {
                    setEspDropdown((v) => !v);
                    setErrors({ ...errors, especialidadCatalogo: '' });
                  }}
                >
                  <Text style={styles.dropdownText}>{form.especialidadCatalogo}</Text>
                  <Text style={styles.dropdownArrow}>{espDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {espDropdown && (
                  <ScrollView 
                    style={styles.dropdownList}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  >
                    {ESPECIALIDADES.map((esp) => (
                      <Pressable
                        key={esp}
                        style={[
                          styles.dropdownItem,
                          form.especialidadCatalogo === esp && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setForm({ ...form, especialidadCatalogo: esp });
                          setEspDropdown(false);
                          setErrors({ ...errors, especialidadCatalogo: '' });
                        }}
                      >
                        <Text style={styles.dropdownItemCheck}>
                          {form.especialidadCatalogo === esp ? '✓ ' : '    '}
                        </Text>
                        <Text style={styles.dropdownItemText}>{esp}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                {/* Otra especialidad */}
                {form.especialidadCatalogo === 'Otros' && (
                  <>
                    <Text style={styles.label}>Especifica la especialidad</Text>
                    <TextInput
                      placeholder="Describe la especialidad"
                      placeholderTextColor="#64748B"
                      value={form.especialidadOtro}
                      onChangeText={(v) => {
                        setForm({ ...form, especialidadOtro: v });
                        setErrors({ ...errors, especialidadOtro: '' });
                      }}
                      style={[styles.input, errors.especialidadOtro && styles.inputError]}
                    />
                    {!!errors.especialidadOtro && <Text style={styles.errorText}>{errors.especialidadOtro}</Text>}
                  </>
                )}

                {/* Años de experiencia */}
                <Text style={styles.label}>Años de Experiencia</Text>
                <TextInput
                  placeholder="5"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={form.añosExperiencia}
                  onChangeText={(v) => {
                    const soloNumeros = v.replace(/[^0-9]/g, '');
                    setForm({ ...form, añosExperiencia: soloNumeros });
                    setErrors({ ...errors, añosExperiencia: '' });
                  }}
                  style={[styles.input, errors.añosExperiencia && styles.inputError]}
                />
                {!!errors.añosExperiencia && <Text style={styles.errorText}>{errors.añosExperiencia}</Text>}
              </>
            )}

            {/* Contraseña */}
            <Text style={styles.label}>Nueva Contraseña (opcional)</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={form.contraseña}
                onChangeText={(v) => {
                  setForm({ ...form, contraseña: v });
                  setErrors({ ...errors, contraseña: '' });
                }}
                style={[styles.passwordInput, errors.contraseña && styles.inputError]}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={18} color="#64748B" />
              </Pressable>
            </View>
            {!!errors.contraseña && <Text style={styles.errorText}>{errors.contraseña}</Text>}

            {/* Confirmar Contraseña */}
            <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#64748B"
                secureTextEntry={!showConfirmPassword}
                value={form.confirmarContraseña}
                onChangeText={(v) => {
                  setForm({ ...form, confirmarContraseña: v });
                  setErrors({ ...errors, confirmarContraseña: '' });
                }}
                style={[styles.passwordInput, errors.confirmarContraseña && styles.inputError]}
              />
              <Pressable onPress={() => setShowConfirmPassword((v) => !v)} style={styles.eyeBtn}>
                <FontAwesome name={showConfirmPassword ? 'eye' : 'eye-slash'} size={18} color="#64748B" />
              </Pressable>
            </View>
            {!!errors.confirmarContraseña && <Text style={styles.errorText}>{errors.confirmarContraseña}</Text>}

            {/* Botón Guardar */}
            <Pressable
              onPress={guardar}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.saveBtn, 
                (pressed || isLoading) && styles.saveBtnPressed,
                isLoading && { opacity: 0.6 }
              ]}
            >
              {({ pressed }) => (
                <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                  {isLoading ? (
                    <>
                      <Text style={[styles.saveBtnText, { marginRight: 8 }]}>
                        GUARDANDO...
                      </Text>
                    </>
                  ) : (
                    <>
                      <FontAwesome 
                        name="save" 
                        size={18} 
                        color={pressed ? '#FFFFFF' : '#000000'}
                      />
                      <View style={{ width: 10 }} />
                      <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                        ACTUALIZAR PERSONAL
                      </Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
