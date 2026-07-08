import React from 'react';
import { Github, Globe, Cpu, BookOpen, Heart, Layers, Code2 } from 'lucide-react';
import Breadcrumbs from '../layouts/Breadcrumbs';

const techStack = [
  { name: 'React 18', role: 'Frontend UI Library', icon: '⚛️' },
  { name: 'Vite', role: 'Build Tool & Dev Server', icon: '⚡' },
  { name: 'Tailwind CSS', role: 'Utility-First Styling', icon: '🎨' },
  { name: 'React Router v6', role: 'Client-Side Routing', icon: '🧭' },
  { name: 'FastAPI', role: 'Python Backend API', icon: '🐍' },
  { name: 'Playwright', role: 'Browser Automation Engine', icon: '🎭' },
  { name: 'Gemini 1.5 Flash', role: 'AI Planning & Reasoning', icon: '✨' },
  { name: 'Pydantic v2', role: 'Data Validation & Schemas', icon: '🔒' },
  { name: 'WebSockets', role: 'Real-Time Log Streaming', icon: '📡' },
  { name: 'Lucide React', role: 'Icon Component Library', icon: '🖼️' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <Breadcrumbs />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/20 text-xs text-neonGreen font-medium">
          <Cpu className="h-3.5 w-3.5" /> Open-Source AI Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
          About BrowserPilot AI
        </h1>
        <p className="max-w-xl mx-auto text-emerald-400/70 text-sm sm:text-base leading-relaxed">
          BrowserPilot AI is a hackathon and internship showcase project demonstrating how modern LLMs and browser automation can be combined to automate everyday web tasks without writing a single line of code.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-panel rounded-2xl p-6 liquid-blur space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-neonGreen" />
          <h2 className="text-base font-bold text-emerald-200 font-heading">Mission</h2>
        </div>
        <p className="text-sm text-emerald-400/70 leading-relaxed">
          Our mission is to democratize web automation. Traditionally, writing browser scripts requires knowledge of DOM selectors, XPath, JavaScript timing, and complex tool chains. BrowserPilot AI replaces this with a simple text prompt, allowing students, researchers, and professionals to automate repetitive research, data extraction, and form-filling tasks instantly.
        </p>
      </div>

      {/* Architecture */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-neonGreen" />
          <h2 className="text-base font-bold text-emerald-200 font-heading">Architecture Overview</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-950/40 rounded-xl border border-emerald-900/30">
            <p className="text-2xl mb-2">🌐</p>
            <p className="font-semibold text-sm text-emerald-200">Frontend</p>
            <p className="text-xs text-emerald-500/60 mt-1">React 18 + Vite + Tailwind CSS. Glassmorphism UI. WebSocket client for live updates.</p>
          </div>
          <div className="text-center p-4 bg-emerald-950/40 rounded-xl border border-emerald-900/30">
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-semibold text-sm text-emerald-200">Backend</p>
            <p className="text-xs text-emerald-500/60 mt-1">FastAPI + Python. Task manager, async execution, WebSocket server, static file serving.</p>
          </div>
          <div className="text-center p-4 bg-emerald-950/40 rounded-xl border border-emerald-900/30">
            <p className="text-2xl mb-2">🤖</p>
            <p className="font-semibold text-sm text-emerald-200">AI Agent</p>
            <p className="text-xs text-emerald-500/60 mt-1">Gemini 1.5 Flash plans execution steps. Playwright performs browser actions. Results are synthesized and reported.</p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-neonGreen" />
          <h2 className="text-base font-bold text-emerald-200 font-heading">Technology Stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {techStack.map(({ name, role, icon }) => (
            <div key={name} className="flex items-center gap-3 p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/20">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-emerald-200">{name}</p>
                <p className="text-xs text-emerald-500/60">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 glass-panel rounded-xl text-sm text-emerald-300 hover:text-white border border-emerald-900/30 hover:border-emerald-500/40 transition-all"
        >
          <Github className="h-5 w-5" /> View on GitHub
        </a>
        <a
          href="https://ai.google.dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 glass-panel rounded-xl text-sm text-emerald-300 hover:text-white border border-emerald-900/30 hover:border-emerald-500/40 transition-all"
        >
          <Globe className="h-5 w-5" /> Gemini API Docs
        </a>
        <a
          href="https://playwright.dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 glass-panel rounded-xl text-sm text-emerald-300 hover:text-white border border-emerald-900/30 hover:border-emerald-500/40 transition-all"
        >
          <BookOpen className="h-5 w-5" /> Playwright Docs
        </a>
      </div>
    </div>
  );
}
