import React, { createContext, useContext, useState } from "react";

// Create the context
const ThemeContext = createContext(null);

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [themes, setTheme] = useState("dark"); // Default theme is 'dark'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ themes, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
