import React, { useState } from 'react';
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

  // Close sidebar on navigation
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full py-2 sm:py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<TaskHistory />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
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
