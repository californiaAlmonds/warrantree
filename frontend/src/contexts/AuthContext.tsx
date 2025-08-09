import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Demo user for development - replace with actual API calls
  const demoUser: User = {
    id: 1,
    name: 'Demo User',
    email: 'demo@warrantree.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate checking for existing session
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to check session
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   const response = await fetch('/api/auth/me', {
        //     headers: { Authorization: `Bearer ${token}` }
        //   });
        //   if (response.ok) {
        //     const userData = await response.json();
        //     setUser(userData);
        //   }
        // }
        
        // For now, use demo user and auto-login for development
        const demoSession = localStorage.getItem('demoSession');
        const authToken = localStorage.getItem('authToken');
        
        if (demoSession === 'active' || authToken) {
          setUser(demoUser);
        } else {
          // Auto-login with demo credentials for development
          localStorage.setItem('demoSession', 'active');
          setUser(demoUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      
      // Store the auth token
      localStorage.setItem('authToken', response.token);
      localStorage.removeItem('demoSession'); // Remove demo session
      
      // Set user from response
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        createdAt: response.user.createdAt,
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      // If API fails, fall back to demo mode for now
      if (email === 'demo@warrantree.com' && password === 'password') {
        localStorage.setItem('demoSession', 'active');
        setUser(demoUser);
      } else {
        throw new Error(error?.response?.data?.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      try {
        await api.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
      
      localStorage.removeItem('demoSession');
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.register({ name, email, password });
      
      // Store the auth token
      localStorage.setItem('authToken', response.token);
      localStorage.removeItem('demoSession'); // Remove demo session
      
      // Set user from response
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        createdAt: response.user.createdAt,
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      // If API fails, fall back to demo mode for now
      if (name && email && password) {
        const newUser = {
          ...demoUser,
          name,
          email,
        };
        localStorage.setItem('demoSession', 'active');
        setUser(newUser);
      } else {
        throw new Error(error?.response?.data?.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Profile update failed');
      // }
      
      // const updatedUser = await response.json();
      // setUser(updatedUser);

      // Demo profile update
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 