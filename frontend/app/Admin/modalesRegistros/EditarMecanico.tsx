// EditarMecanico.tsx
// Modal para editar mecánico existente

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
import styles from '@/Styles/pantallaAdmin/modalesRegistros/editarMecanico';
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

interface EditarMecanicoProps {
  visible: boolean;
  mecanico: any | null;
  onClose: () => void;
  onSuccess: (mecanico: any) => void;
  token: string;
}

export default function EditarMecanico({
  visible,
  mecanico,
  onClose,
  onSuccess,
  token,
}: EditarMecanicoProps) {
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

  // Bloquear capturas de pantalla cuando el modal está visible
  useEffect(() => {
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
      setForm({
        nombres: mecanico.nombres || '',
        segundoNombre: mecanico.segundoNombre || '',
        apellidos: mecanico.apellidos || '',
        segundoApellido: mecanico.segundoApellido || '',
        edad: String(mecanico.edad || ''),
        telefono: mecanico.telefono || '',
        correo: mecanico.correo || '',
        correoEmpresarial: mecanico.correoEmpresarial || '',
        especialidadCatalogo: esCatalogada ? mecanico.especialidad : 'Otros',
        especialidadOtro: esCatalogada ? '' : mecanico.especialidad,
        añosExperiencia: String(mecanico.anosExperiencia || mecanico.añosExperiencia || ''),
        contraseña: '',
        confirmarContraseña: '',
        cuentaActiva: mecanico.cuentaActiva ?? true,
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

  const guardar = async () => {
    const errorNombres = validarUnNombre(form.nombres, 'El nombre');
    const errorSegundoNombre = validarSegundoNombre(form.segundoNombre, 'El segundo nombre');
    const errorApellidos = validarUnNombre(form.apellidos, 'El apellido');
    const errorSegundoApellido = validarSegundoNombre(form.segundoApellido, 'El segundo apellido');
    const errorEdad = validarSoloNumeros(form.edad, 'La edad');
    const errorTelefono = validarTelefono(form.telefono);
    const errorCorreo = validarCorreoGmail(form.correo);
    const errorCorreoEmpresarial = validarCorreoMecanic(form.correoEmpresarial);
    const errorEspecialidadCatalogo = validarObligatorio(form.especialidadCatalogo, 'La especialidad');
    const errorEspecialidadOtro =
      form.especialidadCatalogo === 'Otros'
        ? validarEspecialidadOServicio(form.especialidadOtro, 'especialidad')
        : null;
    const errorAñosExperiencia = validarSoloNumeros(form.añosExperiencia, 'Los años de experiencia');
    const errorContraseña = form.contraseña.trim()
      ? validarContrasena(form.contraseña)
      : null;
    const errorConfirmarContraseña = form.contraseña.trim()
      ? validarConfirmarContrasena(form.contraseña, form.confirmarContraseña)
      : null;

    const edad = parseInt(form.edad, 10);
    const años = parseInt(form.añosExperiencia, 10);

    const errorEdadRango = !Number.isNaN(edad) && (edad < 18 || edad > 80)
      ? 'La edad debe estar entre 18 y 80 años.'
      : null;
    const errorAñosRango = !Number.isNaN(años) && años < 0
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

    const especialidad = form.especialidadCatalogo === 'Otros'
      ? form.especialidadOtro.trim()
      : form.especialidadCatalogo;

    const body: Record<string, unknown> = {
      nombres: form.nombres.trim(),
      segundoNombre: form.segundoNombre.trim() || null,
      apellidos: form.apellidos.trim(),
      segundoApellido: form.segundoApellido.trim() || null,
      edad,
      telefono: form.telefono.trim(),
      correo: form.correo.trim(),
      correoEmpresarial: form.correoEmpresarial.trim().toLowerCase(),
      especialidad,
      anosExperiencia: años,
      cuentaActiva: true,
      fotoPerfil: fotoUri ?? null,
    };

    if (form.contraseña.trim()) body.contrasena = form.contraseña.trim();

    try {
      const resp = await fetch(`${BASE_URL}/mecanicos/${mecanico.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error((await resp.json()).message ?? 'Error al actualizar');
      const actualizado = await resp.json();
      onSuccess(actualizado);
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar el mecánico.');
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
              <Text style={styles.modalTitle}>Editar Mecánico</Text>
              <Text style={styles.modalSubtitle}>
                Actualiza los datos del mecánico. La contraseña es opcional al editar.
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
            <TextInput
              placeholder="juan@mecanic.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.correoEmpresarial}
              onChangeText={(v) => {
                setForm({ ...form, correoEmpresarial: v });
                setErrors({ ...errors, correoEmpresarial: '' });
              }}
              style={[styles.input, errors.correoEmpresarial && styles.inputError]}
            />
            {!!errors.correoEmpresarial && <Text style={styles.errorText}>{errors.correoEmpresarial}</Text>}

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
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                  ACTUALIZAR MECÁNICO
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
