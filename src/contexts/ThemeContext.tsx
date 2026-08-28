// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '@constants/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof LIGHT_COLORS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme,
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};