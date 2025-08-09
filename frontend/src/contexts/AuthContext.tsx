import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
        
        // For now, use demo user
        const demoSession = localStorage.getItem('demoSession');
        if (demoSession === 'active') {
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      
      // const { user, token } = await response.json();
      // localStorage.setItem('authToken', token);
      // setUser(user);

      // Demo login - accept any credentials
      if (email && password) {
        localStorage.setItem('demoSession', 'active');
        setUser(demoUser);
      } else {
        throw new Error('Please enter email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      // });
      
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      
      // const { user, token } = await response.json();
      // localStorage.setItem('authToken', token);
      // setUser(user);

      // Demo registration
      if (name && email && password) {
        const newUser = {
          ...demoUser,
          name,
          email,
        };
        localStorage.setItem('demoSession', 'active');
        setUser(newUser);
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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