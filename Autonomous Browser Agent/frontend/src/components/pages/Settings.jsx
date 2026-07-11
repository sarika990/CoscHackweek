import React, { useState } from 'react';
import { Save, Key, Globe, Monitor, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumbs from '../layouts/Breadcrumbs';

function Row({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-8 py-5 border-b border-accent/8 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 rounded-full border-2 transition-colors duration-200 ${value ? 'bg-accent border-accent' : 'bg-bg-primary border-accent/20'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [showKey, setShowKey]   = useState(false);
  const [key, setKey]           = useState('');
  const [url, setUrl]           = useState('http://localhost:8000');
  const [headless, setHeadless] = useState(true);
  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Configure your BrowserPilot AI environment.</p>
      </div>

      {/* API Config */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
          <Key className="h-3.5 w-3.5 text-accent" /> API Configuration
        </h2>
        <Row
          label="Gemini API Key"
          desc="Set this directly in backend/.env as GEMINI_API_KEY. Never exposed to the browser."
        >
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="AIza…"
              className="input-field w-56 px-3 py-2 pr-9 rounded-lg text-xs font-mono"
            />
            <button onClick={() => setShowKey(p => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent">
              {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </Row>
        <Row label="Backend URL" desc="URL of the FastAPI backend. Proxy auto-routes /api in dev mode.">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="input-field w-56 px-3 py-2 rounded-lg text-xs font-mono"
          />
        </Row>
      </div>

      {/* Browser Config */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-accent" /> Browser Configuration
        </h2>
        <Row label="Headless Mode" desc="Hide browser window during automation. Disable to watch it in real-time for debugging.">
          <Toggle value={headless} onChange={setHeadless} />
        </Row>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
          <Monitor className="h-3.5 w-3.5 text-accent" /> Appearance
        </h2>
        <Row label="Dark Theme" desc="Toggle between Dark Emerald Liquid Glass and Light mode.">
          <Toggle value={isDark} onChange={toggleTheme} />
        </Row>
      </div>

      {/* Security note */}
      <div className="flex gap-3 p-4 rounded-xl bg-warn/8 border border-warn/20">
        <AlertTriangle className="h-4.5 w-4.5 text-warn shrink-0 mt-0.5" />
        <div className="text-xs text-warn/90 leading-relaxed">
          <p className="font-bold mb-1">API Key Security</p>
          Your Gemini API key belongs in <code className="bg-warn/10 px-1 rounded font-mono">backend/.env</code> only.
          Never commit <code className="bg-warn/10 px-1 rounded font-mono">.env</code> to version control.
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm">
          {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
