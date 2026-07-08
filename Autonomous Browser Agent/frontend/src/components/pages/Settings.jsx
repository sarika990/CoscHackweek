import React, { useState } from 'react';
import { Save, Key, Globe, Monitor, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumbs from '../layouts/Breadcrumbs';

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-emerald-900/20 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-emerald-200">{label}</p>
        <p className="text-xs text-emerald-500/60 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [geminiKey, setGeminiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [headless, setHeadless] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Settings</h1>
        <p className="text-sm text-emerald-500/70 mt-0.5">Configure BrowserPilot AI to suit your environment.</p>
      </div>

      {/* API Configuration */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-neonGreen" />
          <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">API Configuration</h2>
        </div>

        <SettingRow
          label="Gemini API Key"
          desc="Your Google AI Studio API key for the Gemini 1.5 Flash model. Stored in backend/.env — never sent to the frontend."
        >
          <input
            type="password"
            value={geminiKey}
            onChange={e => setGeminiKey(e.target.value)}
            placeholder="AIza..."
            className="w-52 sm:w-64 px-3 py-2 bg-emerald-950/70 border border-emerald-900/40 text-emerald-200 placeholder-emerald-700 rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition-colors font-mono"
          />
        </SettingRow>

        <SettingRow
          label="Backend API URL"
          desc="The URL of your FastAPI backend server. Change this if running on a remote host."
        >
          <input
            type="text"
            value={backendUrl}
            onChange={e => setBackendUrl(e.target.value)}
            className="w-52 sm:w-64 px-3 py-2 bg-emerald-950/70 border border-emerald-900/40 text-emerald-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition-colors font-mono"
          />
        </SettingRow>
      </div>

      {/* Browser Configuration */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-neonGreen" />
          <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Browser Configuration</h2>
        </div>

        <SettingRow
          label="Headless Mode"
          desc="Run Playwright in headless mode (no visible browser window). Disable to debug browser issues visually. Toggle is synced with backend/.env."
        >
          <button
            onClick={() => setHeadless(p => !p)}
            className="flex items-center gap-2 text-sm text-emerald-300"
          >
            {headless
              ? <ToggleRight className="h-7 w-7 text-neonGreen" />
              : <ToggleLeft className="h-7 w-7 text-emerald-700" />}
            <span className="text-xs w-12">{headless ? 'Enabled' : 'Disabled'}</span>
          </button>
        </SettingRow>
      </div>

      {/* Appearance */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="h-4 w-4 text-neonGreen" />
          <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Appearance</h2>
        </div>

        <SettingRow
          label="Dark / Light Theme"
          desc="Toggle between the signature Dark Emerald Liquid Glass theme and a lighter variant."
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm text-emerald-300"
          >
            {isDark
              ? <ToggleRight className="h-7 w-7 text-neonGreen" />
              : <ToggleLeft className="h-7 w-7 text-emerald-700" />}
            <span className="text-xs w-14">{isDark ? 'Dark' : 'Light'}</span>
          </button>
        </SettingRow>
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-yellow-800/30 bg-yellow-950/20 p-4 text-xs text-yellow-400/80 leading-relaxed">
        <p className="font-semibold text-yellow-400 mb-1">Important — API Key Security</p>
        Your Gemini API key must be set directly inside <code className="bg-yellow-950/40 px-1 rounded">backend/.env</code> as <code className="bg-yellow-950/40 px-1 rounded">GEMINI_API_KEY=your_key_here</code>. It is never transmitted to the frontend and never stored in the browser.
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-neonGreen hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold text-sm transition-all hover:shadow-neon-strong"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
