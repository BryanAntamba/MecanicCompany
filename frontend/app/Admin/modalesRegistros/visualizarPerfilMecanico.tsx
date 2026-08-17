// visualizarPerfilMecanico.tsx
// Modal para visualizar el perfil completo de un mecánico (sin contraseña)

import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaAdmin/modalesRegistros/visualizarPerfilMecanico';

interface PerfilMecanicoProps {
  visible: boolean;
  mecanico: any | null;
  onClose: () => void;
}

export default function VisualizarPerfilMecanico({
  visible,
  mecanico,
  onClose,
}: PerfilMecanicoProps) {
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

  if (!mecanico) return null;

  const nombreCompleto = [
    mecanico.nombres,
    mecanico.segundoNombre,
    mecanico.apellidos,
    mecanico.segundoApellido,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Botón X para cerrar */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={true}
          >
            {/* Foto de perfil */}
            {mecanico.fotoPerfil ? (
              <Image
                source={{ uri: mecanico.fotoPerfil }}
                style={styles.foto}
                contentFit="cover"
              />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <FontAwesome name="user" size={40} color="#64748B" />
              </View>
            )}

            {/* Título */}
            <Text style={styles.title}>Perfil de Mecánico</Text>

            {/* Campos */}
            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{nombreCompleto}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>{mecanico.edad} años</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{mecanico.telefono || 'No especificado'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Personal:</Text>
              <Text style={styles.value}>{mecanico.correo}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Empresarial:</Text>
              <Text style={styles.value}>{mecanico.correoEmpresarial}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Especialidad:</Text>
              <Text style={styles.value}>{mecanico.especialidad || mecanico.especialidadCatalogo}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Años de Experiencia:</Text>
              <Text style={styles.value}>
                {mecanico.anosExperiencia || mecanico.añosExperiencia} años
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estado de Conexión:</Text>
              <Text
                style={[
                  styles.value,
                  mecanico.estadoConexion === 'LÍNEA' && styles.valueLinea,
                  mecanico.estadoConexion === 'DESCONECTADO' && styles.valueDesconectado,
                  mecanico.estadoConexion === 'SUSPENDIDO' && styles.valueSuspendido,
                ]}
              >
                {mecanico.estadoConexion || 'DESCONECTADO'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estado de Cuenta:</Text>
              <Text style={[styles.value, mecanico.cuentaActiva ? styles.valueActiva : styles.valueInactiva]}>
                {mecanico.cuentaActiva ? 'Activa' : 'Inactiva'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Registro:</Text>
              <Text style={styles.value}>
                {mecanico.createdAt
                  ? new Date(mecanico.createdAt).toLocaleDateString('es-ES')
                  : 'No disponible'}
              </Text>
            </View>

            {/* Botón CERRAR */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.closeBtnText, pressed && styles.closeBtnTextPressed]}>
                  CERRAR
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
