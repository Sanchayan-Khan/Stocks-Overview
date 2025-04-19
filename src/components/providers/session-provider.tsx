'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  fullName: string;
  email: string;
} | null;

type SessionContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

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
      // First clear the user state to trigger UI updates
      setUser(null);
      
      // Then make the logout request
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Let the UI update complete before redirecting
      await new Promise(resolve => setTimeout(resolve, 200));
      
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