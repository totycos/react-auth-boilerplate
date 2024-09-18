import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext } from "react";

type AuthContextType = {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(Cookies.get("auth_token"));
  const navigate = useNavigate();
  const login = (newToken: string) => {
    setToken(newToken);
    Cookies.set("auth_token", newToken);
  };

  const logout = () => {
    setToken(null);
    Cookies.remove("auth_token");
    navigate(`/`);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
