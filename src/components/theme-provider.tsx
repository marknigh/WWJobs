import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  setTheme: (theme: 'light' | 'dark' | 'system') => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const appliedTheme =
      theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(appliedTheme);

    // Apply bg-background and text-foreground globally
    document.body.classList.remove('bg-background', 'text-foreground');
    document.body.classList.add('bg-background', 'text-foreground');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
