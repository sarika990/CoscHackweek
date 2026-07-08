import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync class with HTML element for Tailwind dark mode
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-surface-50">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} totalFiles={0} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Home />
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
        }}
      />
    </div>
  );
}
