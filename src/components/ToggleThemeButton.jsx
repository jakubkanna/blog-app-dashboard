import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleBtn() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
