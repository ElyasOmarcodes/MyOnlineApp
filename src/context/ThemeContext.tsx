import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [fontSize, setFontSize] = useState(16);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const [savedMode, savedAccent, savedFontSize] = await Promise.all([
          AsyncStorage.getItem('theme-mode'),
          AsyncStorage.getItem('accent-color'),
          AsyncStorage.getItem('font-size'),
        ]);

        if (savedMode) setMode(savedMode as ThemeMode);
        if (savedAccent) setAccentColor(savedAccent);
        if (savedFontSize) setFontSize(Number(savedFontSize));
      } catch (e) {
        console.error('Error loading theme from AsyncStorage', e);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('theme-mode', mode);
    }
  }, [mode, isReady]);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('accent-color', accentColor);
    }
  }, [accentColor, isReady]);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('font-size', fontSize.toString());
    }
  }, [fontSize, isReady]);

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ mode, setMode, accentColor, setAccentColor, fontSize, setFontSize, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
