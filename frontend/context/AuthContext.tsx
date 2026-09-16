// AuthContext.tsx
// Contexto global de autenticación.
// Provee: usuario autenticado, token JWT, funciones login/logout, estado de carga.
// El token se persiste en AsyncStorage para mantener la sesión entre reinicios de la app.
// IMPORTANTE: Cierra sesión automáticamente cuando la app pasa a background (usuario cierra la app).

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, LoginResponse } from '@/utils/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthUser = LoginResponse['mecanico'];

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  /** true mientras se verifica si hay sesión guardada al abrir la app */
  bootstrapping: boolean;
  login: (correoEmpresarial: string, contrasena: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Establece sesión manualmente (para usuarios simulados) */
  setSession: (token: string, user: AuthUser) => Promise<void>;
}

// ─── Keys de AsyncStorage ─────────────────────────────────────────────────────

const TOKEN_KEY = '@mecaniccompany/token';
const USER_KEY  = '@mecaniccompany/user';

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  bootstrapping: true,
  login: async () => { throw new Error('AuthProvider no montado'); },
  logout: async () => {},
  setSession: async () => { throw new Error('AuthProvider no montado'); },
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<AuthUser | null>(null);
  const [token, setToken]             = useState<string | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Al montar: recupera sesión guardada de AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser) as AuthUser);
        }
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  // Listener de AppState/visibilidad: detectar cuando la app se cierra completamente
  useEffect(() => {
    // Detectar si estamos en web verificando si 'document' existe
    const isWeb = typeof document !== 'undefined';
    
    // En WEB: usar eventos de visibilidad del documento
    if (isWeb) {
      const handleVisibilityChange = async () => {
        if (document.hidden) {
          // El usuario cambió de pestaña o minimizó el navegador
          await AsyncStorage.setItem('@mecaniccompany/backgroundTime', Date.now().toString());
          console.log('🌐 WEB - App en background, guardando timestamp');
        } else {
          // El usuario volvió a la pestaña
          const backgroundTimeStr = await AsyncStorage.getItem('@mecaniccompany/backgroundTime');
          
          if (backgroundTimeStr) {
            const backgroundTime = parseInt(backgroundTimeStr);
            const now = Date.now();
            const timeDiff = now - backgroundTime;
            
            // Si pasaron más de 30 minutos, considerar que la sesión expiró
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
            
            console.log(`🌐 WEB - App visible de nuevo, tiempo en background: ${Math.round(timeDiff / 1000)}s`);
            
            if (timeDiff > SESSION_TIMEOUT) {
              console.log('🌐 WEB - Sesión expirada, cerrando sesión');
              // La app estuvo inactiva por mucho tiempo, limpiar sesión
              await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY),
                AsyncStorage.removeItem('@mecaniccompany/backgroundTime'),
              ]);
              setToken(null);
              setUser(null);
            } else {
              console.log('🌐 WEB - Sesión válida, manteniendo login');
            }
          }
        }
      };

      // Detectar cierre de pestaña/navegador
      const handleBeforeUnload = async () => {
        console.log('🌐 WEB - Cerrando pestaña/navegador');
        // NO limpiar la sesión aquí porque beforeunload se dispara incluso al recargar
        // La sesión se limpiará por timeout cuando vuelvan después de 5 minutos
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      // En MÓVIL: usar AppState
      const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          await AsyncStorage.setItem('@mecaniccompany/backgroundTime', Date.now().toString());
          console.log('📱 MOBILE - App en background');
        }
        
        if (nextAppState === 'active') {
          const backgroundTimeStr = await AsyncStorage.getItem('@mecaniccompany/backgroundTime');
          
          if (backgroundTimeStr) {
            const backgroundTime = parseInt(backgroundTimeStr);
            const now = Date.now();
            const timeDiff = now - backgroundTime;
            
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
            
            console.log(`📱 MOBILE - App activa, tiempo en background: ${Math.round(timeDiff / 1000)}s`);
            
            if (timeDiff > SESSION_TIMEOUT) {
              console.log('📱 MOBILE - Sesión expirada');
              await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY),
                AsyncStorage.removeItem('@mecaniccompany/backgroundTime'),
              ]);
              setToken(null);
              setUser(null);
            }
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [token, user]);


  const login = useCallback(async (correoEmpresarial: string, contrasena: string): Promise<AuthUser> => {
    const data = await authApi.login(correoEmpresarial, contrasena);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, data.token),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(data.mecanico)),
    ]);
    setToken(data.token);
    setUser(data.mecanico);
    return data.mecanico;
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  const setSession = useCallback(async (newToken: string, newUser: AuthUser) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
    ]);
    setToken(newToken);
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, bootstrapping, login, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook de conveniencia ─────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
