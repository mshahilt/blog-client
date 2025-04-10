import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
        const response = await axiosInstance.post('/users/login', {
            email,
            password,
        });

        console.log('Login response:', response.data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    } catch (error) {
        toast.error('Login failed. Please check your credentials.');
        console.error('Login error:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
};
const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
        const response = await axiosInstance.post('/users/register', {
            name,
            email,
            password,
        });

        console.log('Signup response:', response.data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    } catch (error: any) {
        const message =
            error?.response?.data?.error || error.error || 'Something went wrong.';
        toast.error(`Signup failed. ${message}`);
        console.error('Signup error:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};