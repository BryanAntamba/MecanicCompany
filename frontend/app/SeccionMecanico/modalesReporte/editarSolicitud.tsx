// editarSolicitud.tsx
// Modal para editar una solicitud existente

import { useEffect, useState } from 'react';
import {
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
import styles from '../../../Styles/pantallaMecanico/modalesReporte/editarSolicitud';
import {
  validarUnNombre,
  validarSegundoNombre,
  validarCorreoGmail,
  validarTelefono,
  validarSoloTexto,
  validarTextoYNumeros,
  validarAño,
  validarPlaca,
  validarSoloNumeros,
} from '@/utils/validaciones';
import { PROVINCIAS_ECUADOR, obtenerMecanicasPorProvincia, type ProvinciaEcuador } from '@/utils/provinciasEcuador';

const ESTADOS = ['Pendiente', 'En_proceso', 'Completado'] as const;

type EstadoSolicitud = typeof ESTADOS[number];

interface EditarSolicitudProps {
  visible: boolean;
  solicitud: any | null;
  onClose: () => void;
  onSuccess: (solicitud: any) => void;
  token: string;
}

export default function EditarSolicitud({
  visible,
  solicitud,
  onClose,
  onSuccess,
  token,
}: EditarSolicitudProps) {
  // Campos de datos personales
  const [nombre, setNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');

  // Campos de datos del vehículo
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [placa, setPlaca] = useState('');
  const [kilometraje, setKilometraje] = useState('');

  // Campos de solicitud
  const [estado, setEstado] = useState<EstadoSolicitud>('Pendiente');
  const [descripcionProblema, setDescripcionProblema] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');
  const [estadoDropdown, setEstadoDropdown] = useState(false);

  // Campos de provincia y ubicación
  const [provincia, setProvincia] = useState<ProvinciaEcuador | ''>('');
  const [ubicacionMecanica, setUbicacionMecanica] = useState('');
  const [provinciaDropdownOpen, setProvinciaDropdownOpen] = useState(false);
  const [ubicacionDropdownOpen, setUbicacionDropdownOpen] = useState(false);

  // Estados de error
  const [errNombre, setErrNombre] = useState('');
  const [errSegundoNombre, setErrSegundoNombre] = useState('');
  const [errApellido, setErrApellido] = useState('');
  const [errSegundoApellido, setErrSegundoApellido] = useState('');
  const [errCorreoElectronico, setErrCorreoElectronico] = useState('');
  const [errTelefono, setErrTelefono] = useState('');
  const [errMarca, setErrMarca] = useState('');
  const [errModelo, setErrModelo] = useState('');
  const [errAnio, setErrAnio] = useState('');
  const [errPlaca, setErrPlaca] = useState('');
  const [errKilometraje, setErrKilometraje] = useState('');
  const [errDescripcionProblema, setErrDescripcionProblema] = useState('');
  const [errFechaCita, setErrFechaCita] = useState('');
  const [errHoraCita, setErrHoraCita] = useState('');
  const [errProvincia, setErrProvincia] = useState('');
  const [errUbicacion, setErrUbicacion] = useState('');

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
    if (solicitud) {
      // Extraer nombres desde nombreCliente
      const nombreCompleto = solicitud.nombreCliente || '';
      const palabras = nombreCompleto.trim().split(/\s+/);
      
      setNombre(palabras[0] || '');
      setSegundoNombre(palabras.length >= 4 ? palabras[1] : '');
      setApellido(palabras.length >= 4 ? palabras[2] : palabras[1] || '');
      setSegundoApellido(palabras.length >= 4 ? palabras[3] : palabras[2] || '');

      setCorreoElectronico(solicitud.correoCliente || '');
      setTelefono(solicitud.telefono || '');
      setMarca(solicitud.marca || '');
      setModelo(solicitud.modelo || '');
      setAnio(solicitud.anio || '');
      setPlaca(solicitud.placa || '');
      setKilometraje(solicitud.kilometraje || '');
      setEstado(solicitud.estado || 'Pendiente');
      setDescripcionProblema(solicitud.descripcionProblema || '');
      setFechaCita(solicitud.fechaCita || '');
      setHoraCita(solicitud.horaCita || '');
      setProvincia(solicitud.provincia || '');
      setUbicacionMecanica(solicitud.ubicacionMecanicaId || '');
      
      // Limpiar errores
      setErrNombre('');
      setErrSegundoNombre('');
      setErrApellido('');
      setErrSegundoApellido('');
      setErrCorreoElectronico('');
      setErrTelefono('');
      setErrMarca('');
      setErrModelo('');
      setErrAnio('');
      setErrPlaca('');
      setErrKilometraje('');
      setErrDescripcionProblema('');
      setErrFechaCita('');
      setErrHoraCita('');
      setErrProvincia('');
      setErrUbicacion('');
    }
  }, [solicitud]);

  const guardar = async () => {
    if (!solicitud) return;

    // Validaciones de datos personales
    const eNombre = validarUnNombre(nombre, 'El nombre');
    const eSegundoNombre = validarSegundoNombre(segundoNombre, 'El segundo nombre');
    const eApellido = validarUnNombre(apellido, 'El apellido');
    const eSegundoApellido = validarSegundoNombre(segundoApellido, 'El segundo apellido');
    const eCorreo = validarCorreoGmail(correoElectronico);
    const eTelefono = validarTelefono(telefono);

    // Validaciones de datos del vehículo
    const eMarca = validarSoloTexto(marca, 'La marca');
    const eModelo = validarTextoYNumeros(modelo, 'El modelo');
    const eAnio = validarAño(anio);
    const ePlaca = validarPlaca(placa);
    const eKilometraje = validarSoloNumeros(kilometraje, 'El kilometraje');

    // Validaciones de solicitud
    const eDescripcion = validarTextoYNumeros(descripcionProblema, 'La descripción del problema');
    const eFechaCita = !fechaCita.trim() ? 'La fecha de cita es obligatoria.' : null;
    const eHoraCita = !horaCita.trim() ? 'La hora de cita es obligatoria.' : null;
    const eProvincia = !provincia ? 'La provincia es obligatoria.' : null;
    const eUbicacion = !ubicacionMecanica ? 'La ubicación de la mecánica es obligatoria.' : null;

    // Establecer errores
    setErrNombre(eNombre ?? '');
    setErrSegundoNombre(eSegundoNombre ?? '');
    setErrApellido(eApellido ?? '');
    setErrSegundoApellido(eSegundoApellido ?? '');
    setErrCorreoElectronico(eCorreo ?? '');
    setErrTelefono(eTelefono ?? '');
    setErrMarca(eMarca ?? '');
    setErrModelo(eModelo ?? '');
    setErrAnio(eAnio ?? '');
    setErrPlaca(ePlaca ?? '');
    setErrKilometraje(eKilometraje ?? '');
    setErrDescripcionProblema(eDescripcion ?? '');
    setErrFechaCita(eFechaCita ?? '');
    setErrHoraCita(eHoraCita ?? '');
    setErrProvincia(eProvincia ?? '');
    setErrUbicacion(eUbicacion ?? '');

    // Si hay errores, no continuar
    if ([eNombre, eSegundoNombre, eApellido, eSegundoApellido, eCorreo, eTelefono,
      eMarca, eModelo, eAnio, ePlaca, eKilometraje, eDescripcion, eFechaCita, eHoraCita,
      eProvincia, eUbicacion].some(Boolean)) {
      return;
    }

    try {
      // Construir nombre completo
      const nombreCompleto = [nombre.trim(), segundoNombre.trim(), apellido.trim(), segundoApellido.trim()]
        .filter(Boolean)
        .join(' ');

      // Obtener datos de la mecánica seleccionada
      const mecanicasDisponibles = provincia ? obtenerMecanicasPorProvincia(provincia) : [];
      const mecanicaSeleccionada = mecanicasDisponibles.find(m => m.id === ubicacionMecanica);

      // Usar datosSimulados en lugar de API
      const { actualizarSolicitud } = require('@/utils/datosSimulados');
      
      const datosActualizados = {
        nombreCliente: nombreCompleto,
        correoCliente: correoElectronico.trim().toLowerCase(),
        telefono: telefono.trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: anio.trim(),
        placa: placa.trim().toUpperCase(),
        kilometraje: kilometraje.trim(),
        estado,
        descripcionProblema: descripcionProblema.trim(),
        fechaCita: fechaCita.trim(),
        horaCita: horaCita.trim(),
        provincia,
        ubicacionMecanicaId: ubicacionMecanica,
        ubicacionMecanicaNombre: mecanicaSeleccionada?.nombre || '',
        ubicacionMecanicaDireccion: mecanicaSeleccionada?.direccion || '',
      };

      actualizarSolicitud(solicitud.id, datosActualizados);
      
      const solicitudActualizada = { ...solicitud, ...datosActualizados };
      onSuccess(solicitudActualizada);
      onClose();
    } catch (error: any) {
      // Error silencioso, no mostrar alerta
      console.error('Error al actualizar:', error);
    }
  };

  if (!solicitud) return null;

  // Obtener mecánicas disponibles según la provincia seleccionada
  const mecanicasDisponibles = provincia ? obtenerMecanicasPorProvincia(provincia) : [];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextBlock}>
              <Text style={styles.modalTitle}>Editar Solicitud</Text>
              <Text style={styles.modalSubtitle}>
                Actualiza los datos de la solicitud de {solicitud.nombreCliente}
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
            {/* SECCIÓN: DATOS PERSONALES */}
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#64748B"
              value={nombre}
              onChangeText={(val) => {
                setNombre(val);
                setErrNombre('');
              }}
              style={[styles.input, errNombre && styles.inputError]}
            />
            {errNombre ? <Text style={styles.errorText}>{errNombre}</Text> : null}

            {/* Segundo Nombre */}
            <Text style={styles.label}>Segundo Nombre</Text>
            <TextInput
              placeholder="Segundo Nombre (opcional)"
              placeholderTextColor="#64748B"
              value={segundoNombre}
              onChangeText={(val) => {
                setSegundoNombre(val);
                setErrSegundoNombre('');
              }}
              style={[styles.input, errSegundoNombre && styles.inputError]}
            />
            {errSegundoNombre ? <Text style={styles.errorText}>{errSegundoNombre}</Text> : null}

            {/* Apellido */}
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              placeholder="Apellido"
              placeholderTextColor="#64748B"
              value={apellido}
              onChangeText={(val) => {
                setApellido(val);
                setErrApellido('');
              }}
              style={[styles.input, errApellido && styles.inputError]}
            />
            {errApellido ? <Text style={styles.errorText}>{errApellido}</Text> : null}

            {/* Segundo Apellido */}
            <Text style={styles.label}>Segundo Apellido</Text>
            <TextInput
              placeholder="Segundo Apellido (opcional)"
              placeholderTextColor="#64748B"
              value={segundoApellido}
              onChangeText={(val) => {
                setSegundoApellido(val);
                setErrSegundoApellido('');
              }}
              style={[styles.input, errSegundoApellido && styles.inputError]}
            />
            {errSegundoApellido ? <Text style={styles.errorText}>{errSegundoApellido}</Text> : null}

            {/* Correo Electrónico */}
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              placeholder="correo@gmail.com"
              placeholderTextColor="#64748B"
              value={correoElectronico}
              onChangeText={(val) => {
                setCorreoElectronico(val);
                setErrCorreoElectronico('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errCorreoElectronico && styles.inputError]}
            />
            {errCorreoElectronico ? <Text style={styles.errorText}>{errCorreoElectronico}</Text> : null}

            {/* Teléfono */}
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              placeholder="0987654321"
              placeholderTextColor="#64748B"
              value={telefono}
              onChangeText={(val) => {
                setTelefono(val);
                setErrTelefono('');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              style={[styles.input, errTelefono && styles.inputError]}
            />
            {errTelefono ? <Text style={styles.errorText}>{errTelefono}</Text> : null}

            {/* SECCIÓN: DATOS DEL VEHÍCULO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Datos del Vehículo</Text>

            {/* Marca */}
            <Text style={styles.label}>Marca del Vehículo</Text>
            <TextInput
              placeholder="Toyota"
              placeholderTextColor="#64748B"
              value={marca}
              onChangeText={(val) => {
                setMarca(val);
                setErrMarca('');
              }}
              style={[styles.input, errMarca && styles.inputError]}
            />
            {errMarca ? <Text style={styles.errorText}>{errMarca}</Text> : null}

            {/* Modelo */}
            <Text style={styles.label}>Modelo del Vehículo</Text>
            <TextInput
              placeholder="Corolla"
              placeholderTextColor="#64748B"
              value={modelo}
              onChangeText={(val) => {
                setModelo(val);
                setErrModelo('');
              }}
              style={[styles.input, errModelo && styles.inputError]}
            />
            {errModelo ? <Text style={styles.errorText}>{errModelo}</Text> : null}

            {/* Año */}
            <Text style={styles.label}>Año del Vehículo</Text>
            <TextInput
              placeholder="2020"
              placeholderTextColor="#64748B"
              value={anio}
              onChangeText={(val) => {
                setAnio(val);
                setErrAnio('');
              }}
              keyboardType="number-pad"
              maxLength={4}
              style={[styles.input, errAnio && styles.inputError]}
            />
            {errAnio ? <Text style={styles.errorText}>{errAnio}</Text> : null}

            {/* Placa */}
            <Text style={styles.label}>Placa del Vehículo</Text>
            <TextInput
              placeholder="ABC1234"
              placeholderTextColor="#64748B"
              value={placa}
              onChangeText={(val) => {
                setPlaca(val.toUpperCase());
                setErrPlaca('');
              }}
              autoCapitalize="characters"
              maxLength={7}
              style={[styles.input, errPlaca && styles.inputError]}
            />
            {errPlaca ? <Text style={styles.errorText}>{errPlaca}</Text> : null}

            {/* Kilometraje */}
            <Text style={styles.label}>Kilometraje Actual</Text>
            <TextInput
              placeholder="50000"
              placeholderTextColor="#64748B"
              value={kilometraje}
              onChangeText={(val) => {
                setKilometraje(val);
                setErrKilometraje('');
              }}
              keyboardType="number-pad"
              style={[styles.input, errKilometraje && styles.inputError]}
            />
            {errKilometraje ? <Text style={styles.errorText}>{errKilometraje}</Text> : null}

            {/* SECCIÓN: DATOS DE LA SOLICITUD */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Datos de la Solicitud</Text>

            {/* Estado de la solicitud */}
            <Text style={styles.label}>Estado de la Solicitud</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setEstadoDropdown((v) => !v)}
            >
              <Text style={styles.dropdownText}>
                {estado === 'En_proceso' ? 'En Proceso' : estado}
              </Text>
              <Text style={styles.dropdownArrow}>{estadoDropdown ? '▲' : '▼'}</Text>
            </Pressable>
            {estadoDropdown && (
              <View style={styles.dropdownList}>
                {ESTADOS.map((est) => (
                  <Pressable
                    key={est}
                    style={[
                      styles.dropdownItem,
                      estado === est && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setEstado(est);
                      setEstadoDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {estado === est ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>
                      {est === 'En_proceso' ? 'En Proceso' : est}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Descripción del problema */}
            <Text style={styles.label}>Descripción del Problema</Text>
            <TextInput
              placeholder="Describe el problema"
              placeholderTextColor="#64748B"
              value={descripcionProblema}
              onChangeText={(val) => {
                setDescripcionProblema(val);
                setErrDescripcionProblema('');
              }}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea, errDescripcionProblema && styles.inputError]}
            />
            {errDescripcionProblema ? <Text style={styles.errorText}>{errDescripcionProblema}</Text> : null}

            {/* Fecha de cita */}
            <Text style={styles.label}>Fecha de Cita</Text>
            <TextInput
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#64748B"
              value={fechaCita}
              onChangeText={(val) => {
                setFechaCita(val);
                setErrFechaCita('');
              }}
              style={[styles.input, errFechaCita && styles.inputError]}
            />
            {errFechaCita ? <Text style={styles.errorText}>{errFechaCita}</Text> : null}

            {/* Hora de cita */}
            <Text style={styles.label}>Hora de Cita</Text>
            <TextInput
              placeholder="HH:MM"
              placeholderTextColor="#64748B"
              value={horaCita}
              onChangeText={(val) => {
                setHoraCita(val);
                setErrHoraCita('');
              }}
              style={[styles.input, errHoraCita && styles.inputError]}
            />
            {errHoraCita ? <Text style={styles.errorText}>{errHoraCita}</Text> : null}

            {/* Provincia de la Visita */}
            <Text style={styles.label}>Provincia de la Visita</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setProvinciaDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>
                {provincia || 'Selecciona una provincia'}
              </Text>
              <Text style={styles.dropdownArrow}>{provinciaDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {provinciaDropdownOpen && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {PROVINCIAS_ECUADOR.map((prov) => (
                  <Pressable
                    key={prov}
                    style={[
                      styles.dropdownItem,
                      provincia === prov && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setProvincia(prov);
                      setUbicacionMecanica(''); // Resetear ubicación al cambiar provincia
                      setProvinciaDropdownOpen(false);
                      setErrProvincia('');
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {provincia === prov ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{prov}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {errProvincia ? <Text style={styles.errorText}>{errProvincia}</Text> : null}

            {/* Ubicación de la Mecánica */}
            <Text style={styles.label}>Ubicación de la Mecánica</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                if (!provincia) {
                  // No mostrar alerta, simplemente no hacer nada
                  return;
                }
                setUbicacionDropdownOpen((v) => !v);
              }}
            >
              <Text style={styles.dropdownText}>
                {ubicacionMecanica 
                  ? mecanicasDisponibles.find(m => m.id === ubicacionMecanica)?.nombre || 'Selecciona una ubicación'
                  : 'Selecciona una ubicación'}
              </Text>
              <Text style={styles.dropdownArrow}>{ubicacionDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {ubicacionDropdownOpen && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {mecanicasDisponibles.map((mecanica) => (
                  <Pressable
                    key={mecanica.id}
                    style={[
                      styles.dropdownItem,
                      ubicacionMecanica === mecanica.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setUbicacionMecanica(mecanica.id);
                      setUbicacionDropdownOpen(false);
                      setErrUbicacion('');
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {ubicacionMecanica === mecanica.id ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{mecanica.nombre}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {errUbicacion ? <Text style={styles.errorText}>{errUbicacion}</Text> : null}

            {/* Botón Guardar */}
            <Pressable
              onPress={guardar}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                  ACTUALIZAR SOLICITUD
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
