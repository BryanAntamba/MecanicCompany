// VisualizarPerfilCliente.tsx
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "@/Styles/pantallaAdmin/modalesClienteFinal/visualziarPerfilCliente";

interface VisualizarPerfilClienteProps {
  visible: boolean;
  cliente: any | null;
  onClose: () => void;
}

export default function VisualizarPerfilCliente({ visible, cliente, onClose }: VisualizarPerfilClienteProps) {
  if (!cliente) return null;

  const nombreCompleto = cliente.nombreCompleto || "";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
            <View style={styles.fotoPlaceholder}>
              <FontAwesome name="user" size={40} color="#64748B" />
            </View>
            <Text style={styles.title}>Perfil de Usuario</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{nombreCompleto}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Nacimiento:</Text>
              <Text style={styles.value}>
                {cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento).toLocaleDateString("es-ES") : "No especificada"}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{cliente.telefono || "No especificado"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{cliente.correo}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Estado de Conexión:</Text>
              <Text style={[
                styles.value, 
                cliente.estadoConexion === "LÍNEA" && styles.valueLinea, 
                cliente.estadoConexion === "DESCONECTADO" && styles.valueDesconectado, 
                cliente.estadoConexion === "SUSPENDIDO" && styles.valueSuspendido
              ]}>
                {cliente.estadoConexion || "DESCONECTADO"}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Estado de Cuenta:</Text>
              <Text style={[styles.value, cliente.cuentaActiva ? styles.valueActiva : styles.valueInactiva]}>
                {cliente.cuentaActiva ? "Activa" : "Inactiva"}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Registro:</Text>
              <Text style={styles.value}>
                {cliente.createdAt ? new Date(cliente.createdAt).toLocaleDateString("es-ES") : "No disponible"}
              </Text>
            </View>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}>
              {({ pressed }) => (
                <Text style={[styles.closeBtnText, pressed && styles.closeBtnTextPressed]}>CERRAR</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}