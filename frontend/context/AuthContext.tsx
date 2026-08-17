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

  // Listener de AppState: cierra sesión automáticamente cuando la app pasa a background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      // Cuando la app pasa de activa a background o inactiva → logout automático
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Solo hacer logout si hay una sesión activa
        if (token && user) {
          await Promise.all([
            AsyncStorage.removeItem(TOKEN_KEY),
            AsyncStorage.removeItem(USER_KEY),
          ]);
          setToken(null);
          setUser(null);
        }
      }
    });

    return () => {
      subscription.remove();
    };
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

  return (
    <AuthContext.Provider value={{ user, token, bootstrapping, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook de conveniencia ─────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
