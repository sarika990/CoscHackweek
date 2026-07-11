import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layouts/Navbar';
import Sidebar from './components/layouts/Sidebar';
import Home from './components/pages/Home';
import Features from './components/pages/Features';
import Dashboard from './components/pages/Dashboard';
import TaskHistory from './components/pages/TaskHistory';
import Settings from './components/pages/Settings';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <Navbar
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/features"  element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history"   element={<TaskHistory />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/about"     element={<About />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
