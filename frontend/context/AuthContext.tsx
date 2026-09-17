// AuthContext.tsx
// Contexto global de autenticación.
// Provee: usuario autenticado, token JWT, funciones login/logout, estado de carga.
// WEB: Token en sessionStorage - expira al cerrar navegador completamente
// MÓVIL: Token en AsyncStorage - persiste al minimizar, se pide login al abrir de nuevo

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
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

// ─── Keys de AsyncStorage/SessionStorage ──────────────────────────────────────

const TOKEN_KEY = '@mecaniccompany/token';
const USER_KEY  = '@mecaniccompany/user';

// ─── Storage Helper ───────────────────────────────────────────────────────────

// En WEB usar sessionStorage para que expire al cerrar navegador
// En MÓVIL usar AsyncStorage que persiste
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }
};

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

  // Al montar: recupera sesión guardada
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web') {
          // En WEB: usar sessionStorage
          const [savedToken, savedUser] = await Promise.all([
            storage.getItem(TOKEN_KEY),
            storage.getItem(USER_KEY),
          ]);
          
          console.log('🔍 AuthContext WEB - Token encontrado:', savedToken ? 'SÍ' : 'NO');
          console.log('🔍 AuthContext WEB - User encontrado:', savedUser ? 'SÍ' : 'NO');
          
          if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser) as AuthUser);
            console.log('✅ AuthContext WEB - Sesión restaurada');
          } else {
            console.log('❌ AuthContext WEB - No hay sesión guardada');
          }
        } else {
          // En MÓVIL: verificar si es primera apertura después de cerrar app
          const appClosedFlag = await AsyncStorage.getItem('@mecaniccompany/appClosed');
          
          if (appClosedFlag === 'true') {
            // La app se cerró completamente, limpiar sesión
            console.log('📱 MOBILE - App cerrada detectada, limpiando sesión');
            await Promise.all([
              AsyncStorage.removeItem(TOKEN_KEY),
              AsyncStorage.removeItem(USER_KEY),
              AsyncStorage.removeItem('@mecaniccompany/appClosed'),
            ]);
          } else {
            // Es primera apertura o minimizó, restaurar sesión si existe
            const [savedToken, savedUser] = await Promise.all([
              AsyncStorage.getItem(TOKEN_KEY),
              AsyncStorage.getItem(USER_KEY),
            ]);
            
            console.log('🔍 AuthContext MOBILE - Token encontrado:', savedToken ? 'SÍ' : 'NO');
            
            if (savedToken && savedUser) {
              setToken(savedToken);
              setUser(JSON.parse(savedUser) as AuthUser);
              console.log('✅ AuthContext MOBILE - Sesión restaurada');
            } else {
              console.log('❌ AuthContext MOBILE - No hay sesión guardada');
            }
          }
        }
      } catch (error) {
        console.error('❌ AuthContext - Error al cargar sesión:', error);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  // Listener de AppState: solo para móvil
  useEffect(() => {
    if (Platform.OS !== 'web') {
      let isAppInBackground = false;
      
      const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background') {
          // App va a background (minimizada o cerrándose)
          isAppInBackground = true;
          console.log('📱 MOBILE - App va a background');
          
          // Esperar un momento para ver si la app se cierra o solo se minimiza
          setTimeout(async () => {
            // Si después de 2 segundos sigue en background, asumir que se cerró
            const currentState = AppState.currentState;
            if (currentState === 'background' || currentState === 'inactive') {
              console.log('📱 MOBILE - App probablemente cerrada, marcando bandera');
              await AsyncStorage.setItem('@mecaniccompany/appClosed', 'true');
            }
          }, 2000);
        }
        
        if (nextAppState === 'active') {
          if (isAppInBackground) {
            console.log('📱 MOBILE - App volvió de background (solo minimizó)');
            // La app volvió rápido, no estaba cerrada
            await AsyncStorage.removeItem('@mecaniccompany/appClosed');
            isAppInBackground = false;
          } else {
            console.log('📱 MOBILE - App activa');
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  const login = useCallback(async (correoEmpresarial: string, contrasena: string): Promise<AuthUser> => {
    const data = await authApi.login(correoEmpresarial, contrasena);
    await Promise.all([
      storage.setItem(TOKEN_KEY, data.token),
      storage.setItem(USER_KEY, JSON.stringify(data.mecanico)),
    ]);
    setToken(data.token);
    setUser(data.mecanico);
    console.log('✅ AuthContext - Login exitoso, sesión guardada');
    return data.mecanico;
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      storage.removeItem(TOKEN_KEY),
      storage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
    console.log('✅ AuthContext - Logout exitoso, sesión eliminada');
  }, []);

  const setSession = useCallback(async (newToken: string, newUser: AuthUser) => {
    await Promise.all([
      storage.setItem(TOKEN_KEY, newToken),
      storage.setItem(USER_KEY, JSON.stringify(newUser)),
    ]);
    setToken(newToken);
    setUser(newUser);
    console.log('✅ AuthContext - setSession exitoso, sesión guardada');
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