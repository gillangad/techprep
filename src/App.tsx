import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import { AppProvider } from "./context/AppContext";

type Theme = "light" | "dark";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("techprep-theme");
    if (savedTheme === "dark") return "dark";
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("techprep-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#BDE6FF] text-gray-900 dark:bg-[#0f172a] dark:text-white">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <DashboardContent onMenuClick={() => setSidebarOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    </AppProvider>
  );
}

export default App;
