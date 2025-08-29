import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'employee';
  name: string;
  ownerId?: string; // For employees
  permissions?: {
    clients: string[];
    inventory: string[];
    invoices: string[];
    stores: string[];
  };
  assignedStores?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, username?: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('opti_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, username?: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('opti_users') || '[]');
      
      let foundUser;
      
      if (username) {
        // Employee login: find by username and verify password
        foundUser = users.find((u: any) => 
          u.role === 'employee' && 
          u.username === username && 
          u.password === password
        );
      } else {
        // Owner login: find by email
        foundUser = users.find((u: User) => u.email === email && u.role === 'owner');
      }

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('opti_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('opti_users') || '[]');
      
      // Check if user already exists
      if (users.some((u: User) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'owner'
      };

      users.push(newUser);
      localStorage.setItem('opti_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('opti_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opti_user');
  };

  const isAuthenticated = !!user;
  const isOwner = user?.role === 'owner';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        isAuthenticated, 
        isOwner 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};