import React, { createContext, useContext, useState } from 'react';

// Crear el contexto del usuario
const UserContext = createContext();

// Proveedor del contexto del usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: '', accountNumber: '' });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Hook para usar el contexto del usuario
export const useUser = () => useContext(UserContext);
