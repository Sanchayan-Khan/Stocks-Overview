'use client'
import { createContext, useContext, useState, useEffect } from 'react';

type User = {
  fullName: string;
  email: string;
} | null;

type SessionContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SessionContext.Provider value={{ user, setUser, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);