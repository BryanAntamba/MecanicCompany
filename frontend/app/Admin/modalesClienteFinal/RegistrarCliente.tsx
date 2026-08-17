// RegistrarCliente.tsx
// Modal para registrar nuevo usuario/cliente

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
import styles from '@/Styles/pantallaAdmin/modalesClienteFinal/registrarCliente';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarTelefono,
  validarCorreoGmail,
  validarContrasena,
  validarConfirmarContrasena,
} from '@/utils/validaciones';
import { BASE_URL } from '@/utils/api';
import { agregarUsuario } from '@/utils/datosSimulados';

type FormState = {
  nombres: string;
  segundoNombre: string;
  apellidos: string;
  segundoApellido: string;
  fechaNacimiento: string; // DD/MM/AAAA
  telefono: string;
  correo: string;
  contraseña: string;
  confirmarContraseña: string;
};

type FormErrors = {
  nombres: string;
  segundoNombre: string;
  apellidos: string;
  segundoApellido: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  contraseña: string;
  confirmarContraseña: string;
};

interface RegistrarClienteProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (cliente: any) => void;
  token: string;
}

export default function RegistrarCliente({
  visible,
  onClose,
  onSuccess,
  token,
}: RegistrarClienteProps) {
  const [form, setForm] = useState<FormState>({
    nombres: '',
    segundoNombre: '',
    apellidos: '',
    segundoApellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    nombres: '',
    segundoNombre: '',
    apellidos: '',
    segundoApellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
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
        fechaNacimiento: '',
        telefono: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
      });
      setErrors({
        nombres: '',
        segundoNombre: '',
        apellidos: '',
        segundoApellido: '',
        fechaNacimiento: '',
        telefono: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
      });
    }
  }, [visible]);

  // Formatear fecha DD/MM/AAAA
  const handleFechaChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2); // DD
      if (cleaned.length >= 3) {
        formatted += '/' + cleaned.substring(2, 4); // MM
      }
      if (cleaned.length >= 5) {
        formatted += '/' + cleaned.substring(4, 8); // AAAA
      }
    }
    
    setForm({ ...form, fechaNacimiento: formatted });
    setErrors({ ...errors, fechaNacimiento: '' });
  };

  // Validar fecha y edad 18+
  const validarFechaYEdad = (fechaTexto: string): string | null => {
    if (!fechaTexto || fechaTexto.length !== 10) {
      return 'Ingrese la fecha de nacimiento en formato DD/MM/AAAA.';
    }

    const [dia, mes, anio] = fechaTexto.split('/').map(Number);
    
    if (!dia || !mes || !anio || dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 1900) {
      return 'Fecha inválida.';
    }

    const fecha = new Date(anio, mes - 1, dia);
    if (fecha.getDate() !== dia || fecha.getMonth() !== mes - 1) {
      return 'Fecha inválida.';
    }

    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mesActual = hoy.getMonth() - fecha.getMonth();
    const diaActual = hoy.getDate() - fecha.getDate();
    
    let edadExacta = edad;
    if (mesActual < 0 || (mesActual === 0 && diaActual < 0)) {
      edadExacta--;
    }
    
    if (edadExacta < 18) {
      return 'El usuario debe ser mayor de 18 años.';
    }
    
    if (edadExacta > 120) {
      return 'La fecha de nacimiento no es válida.';
    }

    return null;
  };

  const guardar = async () => {
    const errorNombres = validarUnNombre(form.nombres, 'El nombre');
    const errorSegundoNombre = validarSegundoNombre(form.segundoNombre, 'El segundo nombre');
    const errorApellidos = validarUnNombre(form.apellidos, 'El apellido');
    const errorSegundoApellido = validarSegundoNombre(form.segundoApellido, 'El segundo apellido');
    const errorFecha = validarFechaYEdad(form.fechaNacimiento);
    const errorTelefono = validarTelefono(form.telefono);
    const errorCorreo = validarCorreoGmail(form.correo);
    const errorContraseña = validarContrasena(form.contraseña);
    const errorConfirmarContraseña = validarConfirmarContrasena(form.contraseña, form.confirmarContraseña);

    const nuevosErrores: FormErrors = {
      nombres: errorNombres ?? '',
      segundoNombre: errorSegundoNombre ?? '',
      apellidos: errorApellidos ?? '',
      segundoApellido: errorSegundoApellido ?? '',
      fechaNacimiento: errorFecha ?? '',
      telefono: errorTelefono ?? '',
      correo: errorCorreo ?? '',
      contraseña: errorContraseña ?? '',
      confirmarContraseña: errorConfirmarContraseña ?? '',
    };

    setErrors(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some((value) => value.length > 0);
    if (hayErrores) return;

    // Convertir fecha DD/MM/AAAA a Date
    const [dia, mes, anio] = form.fechaNacimiento.split('/').map(Number);
    const fechaDate = new Date(anio, mes - 1, dia);

    // Construir nombre completo
    const nombreCompleto = [
      form.nombres.trim(),
      form.segundoNombre.trim(),
      form.apellidos.trim(),
      form.segundoApellido.trim(),
    ]
      .filter(Boolean)
      .join(' ');

    // Agregar a datos simulados
    const nuevoUsuario = {
      nombre: form.nombres.trim(),
      segundoNombre: form.segundoNombre.trim() || undefined,
      apellido: form.apellidos.trim(),
      segundoApellido: form.segundoApellido.trim() || undefined,
      fechaNacimiento: fechaDate,
      telefono: form.telefono.trim(),
      correo: form.correo.trim().toLowerCase(),
      contrasena: form.contraseña.trim(),
    };

    agregarUsuario(nuevoUsuario);

    // Crear cliente para retornar
    const clienteCreado = {
      id: `cliente-${Date.now()}`,
      nombreCompleto,
      correo: form.correo.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      fechaNacimiento: fechaDate,
      estadoConexion: 'DESCONECTADO' as const,
      cuentaActiva: true,
      createdAt: new Date().toISOString(),
    };

    onSuccess(clienteCreado);
    onClose();
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
              <Text style={styles.modalTitle}>Registrar Usuario</Text>
              <Text style={styles.modalSubtitle}>
                Añade un nuevo cliente al sistema. Completa todos los campos obligatorios.
              </Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>Nuevo usuario</Text>
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

            {/* Fecha de Nacimiento */}
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={form.fechaNacimiento}
              onChangeText={handleFechaChange}
              maxLength={10}
              style={[styles.input, errors.fechaNacimiento && styles.inputError]}
            />
            {!!errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}

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

            {/* Correo */}
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              placeholder="usuario@gmail.com"
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

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
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
                  GUARDAR USUARIO
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
