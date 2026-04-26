import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export const THEMES = {
  light: {
    primary: '#0857a0', 
    accent: '#b0e8fd',  
    text: '#111827',
    background: '#F3F4F6' // Blanco roto verificado
  },
  dark: {
    primary: '#6249d1',
    accent: '#00c6ff',
    text: '#F3F4F6',
    background: '#111827' // Carbón profundo verificado
  }
};

interface ThemeContextType {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  activeColors: typeof THEMES.light;
  username: string;
  updateUsername: (name: string) => void;
  isTabBarHidden: boolean;
  setIsTabBarHidden: (hidden: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  activeColors: THEMES.dark,
  username: '',
  updateUsername: () => {},
  isTabBarHidden: false,
  setIsTabBarHidden: () => {}
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [username, setUsername] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setCurrentTheme(stored);
      } else {
        setCurrentTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
      setIsLoaded(true);
    });
  }, [systemTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', next);
      return next;
    });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    AsyncStorage.setItem('theme', theme);
  };

  const activeColors = THEMES[currentTheme];

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, setTheme, activeColors, username, updateUsername: setUsername, isTabBarHidden, setIsTabBarHidden }}>
      {children}
    </ThemeContext.Provider>
  );
};
