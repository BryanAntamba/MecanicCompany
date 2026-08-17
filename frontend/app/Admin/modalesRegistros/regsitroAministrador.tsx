// registroAdministrador.tsx
// Modal para registro de nuevo administrador

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
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaAdmin/modalesRegistros/registroAministrador';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarTelefono,
  validarCorreoGmail,
  validarCorreoMecanic,
  validarContrasena,
  validarConfirmarContrasena,
  validarSoloNumeros,
} from '@/utils/validaciones';
import { BASE_URL } from '@/utils/api';

type FormState = {
  nombres: string;
  segundoNombre: string;
  apellidos: string;
  segundoApellido: string;
  edad: string;
  telefono: string;
  correo: string;
  correoEmpresarial: string;
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
  contraseña: string;
  confirmarContraseña: string;
};

interface RegistroAdministradorProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (admin: any) => void;
  token: string;
}

export default function RegistroAdministrador({
  visible,
  onClose,
  onSuccess,
  token,
}: RegistroAdministradorProps) {
  const [form, setForm] = useState<FormState>({
    nombres: '',
    segundoNombre: '',
    apellidos: '',
    segundoApellido: '',
    edad: '',
    telefono: '',
    correo: '',
    correoEmpresarial: '',
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
    contraseña: '',
    confirmarContraseña: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Limpiar formulario al abrir/cerrar modal
  useEffect(() => {
    if (visible) {
      setForm({
        nombres: '',
        segundoNombre: '',
        apellidos: '',
        segundoApellido: '',
        edad: '',
        telefono: '',
        correo: '',
        correoEmpresarial: '',
        contraseña: '',
        confirmarContraseña: '',
        cuentaActiva: true,
      });
      setErrors({
        nombres: '',
        segundoNombre: '',
        apellidos: '',
        segundoApellido: '',
        edad: '',
        telefono: '',
        correo: '',
        correoEmpresarial: '',
        contraseña: '',
        confirmarContraseña: '',
      });
    }
  }, [visible]);

  const guardar = async () => {
    const errorNombres = validarUnNombre(form.nombres, 'El nombre');
    const errorSegundoNombre = validarSegundoNombre(form.segundoNombre, 'El segundo nombre');
    const errorApellidos = validarUnNombre(form.apellidos, 'El apellido');
    const errorSegundoApellido = validarSegundoNombre(form.segundoApellido, 'El segundo apellido');
    const errorEdad = validarSoloNumeros(form.edad, 'La edad');
    const errorTelefono = validarTelefono(form.telefono);
    const errorCorreo = validarCorreoGmail(form.correo);
    const errorCorreoEmpresarial = validarCorreoMecanic(form.correoEmpresarial);
    const errorContraseña = validarContrasena(form.contraseña);
    const errorConfirmarContraseña = validarConfirmarContrasena(form.contraseña, form.confirmarContraseña);

    const edad = parseInt(form.edad, 10);

    const errorEdadRango = !Number.isNaN(edad) && (edad < 18 || edad > 80)
      ? 'La edad debe estar entre 18 y 80 años.'
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
      contraseña: errorContraseña ?? '',
      confirmarContraseña: errorConfirmarContraseña ?? '',
    };

    setErrors(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some((value) => value.length > 0);
    if (hayErrores) return;

    const body: Record<string, unknown> = {
      nombres: form.nombres.trim(),
      segundoNombre: form.segundoNombre.trim() || null,
      apellidos: form.apellidos.trim(),
      segundoApellido: form.segundoApellido.trim() || null,
      edad,
      telefono: form.telefono.trim(),
      correo: form.correo.trim(),
      correoEmpresarial: form.correoEmpresarial.trim().toLowerCase(),
      cuentaActiva: true,
      contrasena: form.contraseña.trim(),
    };

    try {
      const resp = await fetch(`${BASE_URL}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error((await resp.json()).message ?? 'Error al crear');
      const nuevo = await resp.json();
      onSuccess(nuevo);
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo guardar el administrador.');
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
              <Text style={styles.modalTitle}>Registrar Administrador</Text>
              <Text style={styles.modalSubtitle}>
                Añade un nuevo administrador al sistema. Completa todos los campos obligatorios.
              </Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>Nuevo ingreso</Text>
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
              placeholder="admin@gmail.com"
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
              placeholder="admin@mecanic.com"
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

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Ingrese la contraseña"
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
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirme la contraseña"
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
                  GUARDAR ADMINISTRADOR
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
