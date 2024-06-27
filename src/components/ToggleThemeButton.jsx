import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleBtn() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
