// footerCliente.tsx
// Footer para la pantalla del cliente con derechos de autor y botón para regresar arriba

import { Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/footer/footerCliente';

// Props del componente
type FooterClienteProps = {
  onScrollToTop: () => void; // Callback para hacer scroll al inicio de la página
};

export default function FooterCliente({ onScrollToTop }: FooterClienteProps) {
  return (
    <View style={styles.footer}>
      {/* Texto de derechos de autor */}
      <Text style={styles.copyrightText}>
        © {new Date().getFullYear()} Mecanic Company. Todos los derechos reservados.{'\n'}
        Proporcionamos servicios automotrices de calidad con mecánicos certificados.
      </Text>

      {/* Botón para regresar arriba */}
      <Pressable
        style={({ pressed }) => [
          styles.scrollTopButton,
          pressed && styles.scrollTopButtonPressed,
        ]}
        onPress={onScrollToTop}
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
  );
}
