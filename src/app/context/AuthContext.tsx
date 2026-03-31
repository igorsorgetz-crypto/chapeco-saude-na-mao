import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  nome: string;
  cpf: string;
  cartaoSus: string;
  dataNascimento: string;
  telefone: string;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (cpf: string, cartaoSus: string) => boolean;
  register: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (userData: UserData) => {
    // Salvar novo usuário no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Fazer login automaticamente
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const login = (cpf: string, cartaoSus: string): boolean => {
    // Buscar usuário cadastrado
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: UserData) => u.cpf === cpf && u.cartaoSus === cartaoSus
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
