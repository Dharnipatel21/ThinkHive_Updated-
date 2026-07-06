import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative w-11 h-6 rounded-full bg-muted transition-colors duration-300 flex items-center px-1 shrink-0"
    >
      <div
        className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm transition-transform duration-300"
        style={{ transform: isDark ? "translateX(20px)" : "translateX(0px)" }}
      >
        {isDark ? (
          <Moon size={7} className="text-primary-foreground" />
        ) : (
          <Sun size={7} className="text-primary-foreground" />
        )}
      </div>
    </button>
  );
}