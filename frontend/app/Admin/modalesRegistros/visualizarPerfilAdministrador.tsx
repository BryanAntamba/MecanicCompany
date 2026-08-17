// visualizarPerfilAdministrador.tsx
// Modal para visualizar el perfil completo de un administrador (sin contraseña)

import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaAdmin/modalesRegistros/visualizarPerfilAdministrador';

interface PerfilAdministradorProps {
  visible: boolean;
  admin: any | null;
  onClose: () => void;
}

export default function VisualizarPerfilAdministrador({
  visible,
  admin,
  onClose,
}: PerfilAdministradorProps) {
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

  if (!admin) return null;

  const nombreCompleto = [
    admin.nombres,
    admin.segundoNombre,
    admin.apellidos,
    admin.segundoApellido,
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
            {/* Ícono de administrador */}
            <View style={styles.iconContainer}>
              <FontAwesome name="shield" size={50} color="#3B82F6" />
            </View>

            {/* Título */}
            <Text style={styles.title}>Perfil de Administrador</Text>

            {/* Campos */}
            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{nombreCompleto}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>{admin.edad} años</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{admin.telefono || 'No especificado'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Personal:</Text>
              <Text style={styles.value}>{admin.correo}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Empresarial:</Text>
              <Text style={styles.value}>{admin.correoEmpresarial}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estado de Conexión:</Text>
              <Text
                style={[
                  styles.value,
                  admin.estadoConexion === 'LÍNEA' && styles.valueLinea,
                  admin.estadoConexion === 'DESCONECTADO' && styles.valueDesconectado,
                  admin.estadoConexion === 'SUSPENDIDO' && styles.valueSuspendido,
                ]}
              >
                {admin.estadoConexion || 'DESCONECTADO'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estado de Cuenta:</Text>
              <Text style={[styles.value, admin.cuentaActiva ? styles.valueActiva : styles.valueInactiva]}>
                {admin.cuentaActiva ? 'Activa' : 'Inactiva'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Registro:</Text>
              <Text style={styles.value}>
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString('es-ES')
                  : 'No disponible'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Rol:</Text>
              <Text style={[styles.value, styles.valueRol]}>Administrador del Sistema</Text>
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
