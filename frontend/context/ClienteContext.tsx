// ClienteContext.tsx
// Context para manejar la sesión del cliente (usuarios con @gmail.com)
// NOTA: La sesión NO persiste - se cierra automáticamente al cerrar la app

import React, { createContext, useContext, useState } from 'react';

interface ClienteContextType {
  estaLogueado: boolean;
  correoCliente: string | null;
  nombreCliente: string | null;
  nombrePrimerCliente: string | null;
  nombreSegundoCliente: string | null;
  apellidoPrimerCliente: string | null;
  apellidoSegundoCliente: string | null;
  telefonoCliente: string | null;
  iniciarSesionCliente: (correo: string, nombre: string, nombrePrimero: string, nombreSegundo: string, apellidoPrimero: string, apellidoSegundo: string, telefono: string) => Promise<void>;
  cerrarSesionCliente: () => Promise<void>;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [correoCliente, setCorreoCliente] = useState<string | null>(null);
  const [nombreCliente, setNombreCliente] = useState<string | null>(null);
  const [nombrePrimerCliente, setNombrePrimerCliente] = useState<string | null>(null);
  const [nombreSegundoCliente, setNombreSegundoCliente] = useState<string | null>(null);
  const [apellidoPrimerCliente, setApellidoPrimerCliente] = useState<string | null>(null);
  const [apellidoSegundoCliente, setApellidoSegundoCliente] = useState<string | null>(null);
  const [telefonoCliente, setTelefonoCliente] = useState<string | null>(null);

  // NO cargar sesión al iniciar - la sesión se pierde al cerrar la app
  // useEffect eliminado intencionalmente para que la sesión no persista

  const iniciarSesionCliente = async (
    correo: string,
    nombre: string,
    nombrePrimero: string,
    nombreSegundo: string,
    apellidoPrimero: string,
    apellidoSegundo: string,
    telefono: string
  ) => {
    // Solo mantener en memoria, NO en AsyncStorage
    setCorreoCliente(correo);
    setNombreCliente(nombre);
    setNombrePrimerCliente(nombrePrimero);
    setNombreSegundoCliente(nombreSegundo);
    setApellidoPrimerCliente(apellidoPrimero);
    setApellidoSegundoCliente(apellidoSegundo);
    setTelefonoCliente(telefono);
    setEstaLogueado(true);
  };

  const cerrarSesionCliente = async () => {
    setCorreoCliente(null);
    setNombreCliente(null);
    setNombrePrimerCliente(null);
    setNombreSegundoCliente(null);
    setApellidoPrimerCliente(null);
    setApellidoSegundoCliente(null);
    setTelefonoCliente(null);
    setEstaLogueado(false);
  };

  return (
    <ClienteContext.Provider
      value={{
        estaLogueado,
        correoCliente,
        nombreCliente,
        nombrePrimerCliente,
        nombreSegundoCliente,
        apellidoPrimerCliente,
        apellidoSegundoCliente,
        telefonoCliente,
        iniciarSesionCliente,
        cerrarSesionCliente,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useCliente debe usarse dentro de ClienteProvider');
  }
  return context;
};
