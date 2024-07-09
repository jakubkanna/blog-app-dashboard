import React, { createContext, useState, ReactNode } from "react";
import { AuthContextType } from "../../types";

// initial values
const initialAuthContext: AuthContextType = {
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
};

//  props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType>(initialAuthContext);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
