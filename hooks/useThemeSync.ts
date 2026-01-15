'use client';

import { useEffect, useState } from 'react';

export function useThemeSync() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lire depuis localStorage directement
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      setIsDark(parsed.state?.isDark || false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme-storage', JSON.stringify({ state: { isDark: newValue } }));
      return newValue;
    });
  };

  return { isDark: mounted ? isDark : false, toggleTheme, mounted };
}