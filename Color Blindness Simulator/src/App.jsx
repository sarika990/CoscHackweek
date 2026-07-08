import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import EmptyState from './components/common/EmptyState';
import ImagePreview from './components/Preview/ImagePreview';
import SimulationControls from './components/Controls/SimulationControls';
import DownloadButton from './components/Download/DownloadButton';
import Loader from './components/common/Loader';
import Notification from './components/common/Notification';

function SimulatorApp() {
  const { image } = useSimulator();

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-slate-800 dark:text-gray-200 transition-colors duration-300 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        {!image ? (
          <EmptyState />
        ) : (
          <div className="w-full flex flex-col gap-8 animate-fade-in">
            {/* Top Preview Card */}
            <div className="bg-glass-card/5 border border-glass-border p-6 rounded-3xl backdrop-blur-md shadow-lg">
              <ImagePreview />
            </div>

            {/* Simulation Options Grid */}
            <div className="bg-glass-card/5 border border-glass-border p-6 rounded-3xl backdrop-blur-md shadow-lg">
              <SimulationControls />
            </div>

            {/* Download / Export Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-glass-card/5 border border-glass-border p-6 rounded-3xl backdrop-blur-md shadow-lg">
              <div className="text-center sm:text-left">
                <h3 className="text-white font-bold text-base mb-1">Export Simulated Output</h3>
                <p className="text-xs text-gray-400">
                  Save the filtered image directly to your local drive at full resolution.
                </p>
              </div>
              <DownloadButton />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Global Overlays */}
      <Loader />
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SimulatorProvider>
        <SimulatorApp />
      </SimulatorProvider>
    </ThemeProvider>
  );
}
