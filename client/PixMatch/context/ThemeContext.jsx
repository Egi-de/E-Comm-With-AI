import React, { createContext, useContext, useState, useEffect } from "react";
import { StyleSheet, Appearance } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === "dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const lightColors = {
    primary: "#B6EB7A", // Requested green
    secondary: "#FFE2E2", // Light pink
    background: "#FFFFFF", // White background
    accent: "#99DDCC", // Mint green
    text: "#333333",
    textLight: "#666666",
    white: "#FFFFFF",
    error: "#FF6B6B",
    success: "#4CAF50",
  };

  const darkColors = {
    primary: "#4A90E2", // Darker blue
    secondary: "#FF6B9D", // Darker pink
    background: "#121212", // Dark background
    accent: "#66C2A3", // Darker mint
    text: "#FFFFFF",
    textLight: "#BBBBBB",
    white: "#1E1E1E",
    error: "#FF6B6B",
    success: "#4CAF50",
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  const typography = {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      bold: "700",
    },
  };

  const theme = {
    colors,
    spacing,
    typography,
    isDarkMode,
    toggleTheme,
    globalStyles: {
      ...globalStyles,
      container: {
        ...globalStyles.container,
        backgroundColor: colors.background,
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333333",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B6EB7A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
});
