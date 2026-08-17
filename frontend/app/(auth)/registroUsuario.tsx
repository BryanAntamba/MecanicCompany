import React, { useState, useRef, useEffect } from 'react';
import {
  ImageBackground, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, Text, TextInput, View, Image, Modal, BackHandler
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
import registroStyles from '@/Styles/auth/RegistroUsuario';
import confirmacionStyles from '@/Styles/auth/modalAuth/confirmacionRegistro';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarFechaNacimiento,
  validarTelefono,
  validarCorreoGmail,
  validarContrasena,
  validarConfirmarContrasena,
} from '@/utils/validaciones';
import { agregarUsuario, correoYaRegistrado } from '@/utils/datosSimulados';
// import ConfirmacionRegistro from './modalAuth/confirmacionRegistro';

export default function RegistroUsuarioScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [fechaTexto, setFechaTexto] = useState(''); // Texto de fecha para mostrar
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  // Estados de visibilidad de contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de errores
  const [errNombre, setErrNombre] = useState('');
  const [errSegundoNombre, setErrSegundoNombre] = useState('');
  const [errApellido, setErrApellido] = useState('');
  const [errSegundoApellido, setErrSegundoApellido] = useState('');
  const [errFecha, setErrFecha] = useState('');
  const [errTelefono, setErrTelefono] = useState('');
  const [errCorreo, setErrCorreo] = useState('');
  const [errContrasena, setErrContrasena] = useState('');
  const [errConfirmar, setErrConfirmar] = useState('');
  const [errGeneral, setErrGeneral] = useState('');

  // Estado de carga y modal
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Manejo del botón de retroceso: va de regreso al login
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/(auth)/login' as any);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Maneja el cambio de fecha
  const onDateChange = (_event: any, selectedDate?: Date) => {
    // setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
      
      // Validar inmediatamente si es mayor de 18
      const hoy = new Date();
      const edad = hoy.getFullYear() - selectedDate.getFullYear();
      const mes = hoy.getMonth() - selectedDate.getMonth();
      const dia = hoy.getDate() - selectedDate.getDate();
      
      // Calcular edad exacta
      let edadExacta = edad;
      if (mes < 0 || (mes === 0 && dia < 0)) {
        edadExacta--;
      }
      
      if (edadExacta < 18) {
        setErrFecha('Debes ser mayor de 18 años para registrarte.');
      } else {
        setErrFecha('');
      }
      
      setErrGeneral('');
    }
  };

  // Formatea la fecha para mostrar
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formatea la fecha mientras se escribe (DD/MM/AAAA)
  const handleFechaChange = (text: string) => {
    // Solo permitir números y barras
    const cleaned = text.replace(/[^0-9]/g, '');
    
    let formatted = '';
    
    // Formatear automáticamente DD/MM/AAAA
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2); // DD
      if (cleaned.length >= 3) {
        formatted += '/' + cleaned.substring(2, 4); // MM
      }
      if (cleaned.length >= 5) {
        formatted += '/' + cleaned.substring(4, 8); // AAAA
      }
    }
    
    setFechaTexto(formatted);
    
    // Si la fecha está completa (10 caracteres), validar y convertir a Date
    if (formatted.length === 10) {
      const [dia, mes, anio] = formatted.split('/').map(Number);
      
      // Validar que sea una fecha válida
      if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && anio >= 1900) {
        const fecha = new Date(anio, mes - 1, dia);
        
        // Verificar que la fecha sea válida (por ejemplo, 31/02 no es válido)
        if (fecha.getDate() === dia && fecha.getMonth() === mes - 1) {
          setFechaNacimiento(fecha);
          
          // Validar edad inmediatamente
          const hoy = new Date();
          const edad = hoy.getFullYear() - fecha.getFullYear();
          const mesActual = hoy.getMonth() - fecha.getMonth();
          const diaActual = hoy.getDate() - fecha.getDate();
          
          let edadExacta = edad;
          if (mesActual < 0 || (mesActual === 0 && diaActual < 0)) {
            edadExacta--;
          }
          
          if (edadExacta < 18) {
            setErrFecha('Debes ser mayor de 18 años para registrarte.');
          } else if (edadExacta > 120) {
            setErrFecha('La fecha de nacimiento no es válida.');
          } else {
            setErrFecha('');
          }
        } else {
          setErrFecha('Fecha inválida.');
          setFechaNacimiento(null);
        }
      } else {
        setErrFecha('Fecha inválida.');
        setFechaNacimiento(null);
      }
    } else {
      setFechaNacimiento(null);
      setErrFecha('');
    }
    
    setErrGeneral('');
  };

  // Maneja el registro
  const handleRegistro = async () => {
    // Validar todos los campos
    const eNombre = validarUnNombre(nombre, 'El nombre');
    const eSegundoNombre = validarSegundoNombre(segundoNombre, 'El segundo nombre');
    const eApellido = validarUnNombre(apellido, 'El apellido');
    const eSegundoApellido = validarSegundoNombre(segundoApellido, 'El segundo apellido');
    const eFecha = validarFechaNacimiento(fechaNacimiento);
    const eTelefono = validarTelefono(telefono);
    const eCorreo = validarCorreoGmail(correo);
    const eContrasena = validarContrasena(contrasena);
    const eConfirmar = validarConfirmarContrasena(contrasena, confirmarContrasena);

    setErrNombre(eNombre ?? '');
    setErrSegundoNombre(eSegundoNombre ?? '');
    setErrApellido(eApellido ?? '');
    setErrSegundoApellido(eSegundoApellido ?? '');
    setErrFecha(eFecha ?? '');
    setErrTelefono(eTelefono ?? '');
    setErrCorreo(eCorreo ?? '');
    setErrContrasena(eContrasena ?? '');
    setErrConfirmar(eConfirmar ?? '');

    // Si hay algún error, no continuar
    if ([eNombre, eSegundoNombre, eApellido, eSegundoApellido, eFecha, eTelefono, eCorreo, eContrasena, eConfirmar].some(Boolean)) {
      // Si el error es de edad, mostrar mensaje específico
      if (eFecha === 'Debes ser mayor de 18 años para registrarte.') {
        setErrGeneral('No puedes registrarte por ser menor de edad.');
      }
      return;
    }

    // Verificar si el correo ya está registrado
    if (correoYaRegistrado(correo.trim().toLowerCase())) {
      setErrCorreo('Este correo ya está registrado.');
      return;
    }

    setLoading(true);
    setErrGeneral('');

    try {
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Guardar usuario en datos simulados
      agregarUsuario({
        nombre: nombre.trim(),
        segundoNombre: segundoNombre.trim() || undefined,
        apellido: apellido.trim(),
        segundoApellido: segundoApellido.trim() || undefined,
        fechaNacimiento: fechaNacimiento!,
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena,
      });

      // Mostrar modal de confirmación
      setModalVisible(true);

      // Después de 3 segundos, cerrar modal y navegar al login
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/(auth)/login' as any);
      }, 3000);
    } catch (err: any) {
      setErrGeneral(err?.message ?? 'Error al registrar el usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondoLogin.png')}
      style={registroStyles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={registroStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={registroStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botón regresar */}
          <Pressable
            onPress={() => router.replace('/(auth)/login' as any)}
            style={registroStyles.backButton}
            hitSlop={8}
          >
            <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
          </Pressable>

          {/* Formulario */}
          <View style={registroStyles.formContainer}>

            {/* Logo */}
            <View style={registroStyles.logoContainer}>
              <Image
                source={require('../../assets/images/iconoTransparente.png')}
                resizeMode="contain"
                style={registroStyles.logo}
              />
            </View>

            {/* Título */}
            <Text style={registroStyles.title}>Registro de Usuario</Text>
            <Text style={registroStyles.subtitle}>Completa tus datos para crear una cuenta</Text>

            {/* Campo: Nombre */}
            <Text style={registroStyles.fieldLabel}>Nombre</Text>
            <TextInput
              style={[registroStyles.input, errNombre ? registroStyles.inputError : null]}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#94A3B8"
              value={nombre}
              onChangeText={(t) => { setNombre(t); setErrNombre(''); setErrGeneral(''); }}
              onBlur={() => {
                const error = validarUnNombre(nombre, 'El nombre');
                setErrNombre(error ?? '');
              }}
              maxLength={50}
            />
            {errNombre ? <Text style={registroStyles.errorText}>{errNombre}</Text> : null}

            {/* Campo: Segundo Nombre (opcional) */}
            <Text style={registroStyles.fieldLabel}>Segundo Nombre (opcional)</Text>
            <TextInput
              style={[registroStyles.input, errSegundoNombre ? registroStyles.inputError : null]}
              placeholder="Ingresa tu segundo nombre"
              placeholderTextColor="#94A3B8"
              value={segundoNombre}
              onChangeText={(t) => { setSegundoNombre(t); setErrSegundoNombre(''); setErrGeneral(''); }}
              onBlur={() => {
                const error = validarSegundoNombre(segundoNombre, 'El segundo nombre');
                setErrSegundoNombre(error ?? '');
              }}
              maxLength={50}
            />
            {errSegundoNombre ? <Text style={registroStyles.errorText}>{errSegundoNombre}</Text> : null}

            {/* Campo: Apellido */}
            <Text style={registroStyles.fieldLabel}>Apellido</Text>
            <TextInput
              style={[registroStyles.input, errApellido ? registroStyles.inputError : null]}
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#94A3B8"
              value={apellido}
              onChangeText={(t) => { setApellido(t); setErrApellido(''); setErrGeneral(''); }}
              onBlur={() => {
                const error = validarUnNombre(apellido, 'El apellido');
                setErrApellido(error ?? '');
              }}
              maxLength={50}
            />
            {errApellido ? <Text style={registroStyles.errorText}>{errApellido}</Text> : null}

            {/* Campo: Segundo Apellido (opcional) */}
            <Text style={registroStyles.fieldLabel}>Segundo Apellido (opcional)</Text>
            <TextInput
              style={[registroStyles.input, errSegundoApellido ? registroStyles.inputError : null]}
              placeholder="Ingresa tu segundo apellido"
              placeholderTextColor="#94A3B8"
              value={segundoApellido}
              onChangeText={(t) => { setSegundoApellido(t); setErrSegundoApellido(''); setErrGeneral(''); }}
              onBlur={() => {
                const error = validarSegundoNombre(segundoApellido, 'El segundo apellido');
                setErrSegundoApellido(error ?? '');
              }}
              maxLength={50}
            />
            {errSegundoApellido ? <Text style={registroStyles.errorText}>{errSegundoApellido}</Text> : null}

            {/* Campo: Fecha de Nacimiento */}
            <Text style={registroStyles.fieldLabel}>Fecha de Nacimiento</Text>
            <TextInput
              style={[registroStyles.input, errFecha ? registroStyles.inputError : null]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={fechaTexto}
              onChangeText={handleFechaChange}
              maxLength={10}
            />
            {errFecha ? <Text style={registroStyles.errorText}>{errFecha}</Text> : null}

            {/* Campo: Teléfono */}
            <Text style={registroStyles.fieldLabel}>Teléfono</Text>
            <TextInput
              style={[registroStyles.input, errTelefono ? registroStyles.inputError : null]}
              placeholder="10 dígitos"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={(t) => { 
                // Solo permitir números
                const soloNumeros = t.replace(/[^0-9]/g, '');
                setTelefono(soloNumeros); 
                setErrTelefono(''); 
                setErrGeneral(''); 
              }}
              maxLength={10}
            />
            {errTelefono ? <Text style={registroStyles.errorText}>{errTelefono}</Text> : null}

            {/* Campo: Correo */}
            <Text style={registroStyles.fieldLabel}>Correo Electrónico</Text>
            <TextInput
              style={[registroStyles.input, errCorreo ? registroStyles.inputError : null]}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={(t) => { setCorreo(t); setErrCorreo(''); setErrGeneral(''); }}
            />
            {errCorreo ? <Text style={registroStyles.errorText}>{errCorreo}</Text> : null}

            {/* Campo: Contraseña */}
            <Text style={registroStyles.fieldLabel}>Contraseña</Text>
            <View style={[registroStyles.passwordRow, errContrasena ? registroStyles.inputError : null]}>
              <TextInput
                style={registroStyles.passwordInput}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={contrasena}
                onChangeText={(t) => { setContrasena(t); setErrContrasena(''); setErrGeneral(''); }}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={registroStyles.eyeBtn} hitSlop={8}>
                <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {errContrasena ? <Text style={registroStyles.errorText}>{errContrasena}</Text> : null}

            {/* Campo: Confirmar Contraseña */}
            <Text style={registroStyles.fieldLabel}>Confirmar Contraseña</Text>
            <View style={[registroStyles.passwordRow, errConfirmar ? registroStyles.inputError : null]}>
              <TextInput
                style={registroStyles.passwordInput}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                value={confirmarContrasena}
                onChangeText={(t) => { setConfirmarContrasena(t); setErrConfirmar(''); setErrGeneral(''); }}
              />
              <Pressable onPress={() => setShowConfirmPassword((v) => !v)} style={registroStyles.eyeBtn} hitSlop={8}>
                <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {errConfirmar ? <Text style={registroStyles.errorText}>{errConfirmar}</Text> : null}

            {/* Botón registrarse */}
            <Pressable
              style={({ pressed }) => [registroStyles.button, pressed && registroStyles.buttonPressed]}
              onPress={handleRegistro}
              disabled={loading}
            >
              {({ pressed }) => (
                <Text style={[registroStyles.buttonText, pressed && registroStyles.buttonTextPressed]}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Text>
              )}
            </Pressable>

            {/* Error general */}
            {errGeneral ? <Text style={registroStyles.errorTextCentered}>{errGeneral}</Text> : null}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de confirmación inline */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={confirmacionStyles.modalOverlay}>
          <View style={confirmacionStyles.modalContent}>
            <View style={confirmacionStyles.iconContainer}>
              <FontAwesome name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={confirmacionStyles.title}>Registro exitoso</Text>
            <Text style={confirmacionStyles.message}>
              Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.
            </Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
