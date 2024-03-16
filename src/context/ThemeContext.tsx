import { createContext, useState } from "react";
import { Contexts } from "types/context-type";

const ThemeContext = createContext({
  theme: "light",
  toggleMode: () => {},
});

export const ThemeContextProvider = ({ children }: Contexts) => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme") || "light"
  );

  const toggleMode = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    window.localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
