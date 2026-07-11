import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe, BookOpen, Code2, Layers, Heart, Cpu } from 'lucide-react';
import Breadcrumbs from '../layouts/Breadcrumbs';

const stack = [
  { name: 'React 18',            role: 'Frontend UI Library',        icon: '⚛️' },
  { name: 'Vite',                role: 'Build Tool & Dev Server',     icon: '⚡' },
  { name: 'Tailwind CSS',        role: 'Utility-First Styling',       icon: '🎨' },
  { name: 'React Router v6',     role: 'Client-Side Routing',         icon: '🧭' },
  { name: 'FastAPI',             role: 'Python REST & WebSocket API',  icon: '🐍' },
  { name: 'Playwright',          role: 'Browser Automation Engine',    icon: '🎭' },
  { name: 'Gemini 1.5 Flash',    role: 'AI Planning & Reasoning',      icon: '✨' },
  { name: 'Pydantic v2',         role: 'Data Validation & Schemas',    icon: '🔒' },
  { name: 'WebSockets',          role: 'Real-Time Log Streaming',      icon: '📡' },
  { name: 'Lucide React',        role: 'Icon Component Library',       icon: '🖼️' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10 animate-fade-in">
      <Breadcrumbs />

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
          <Cpu className="h-3.5 w-3.5" /> Open-Source AI Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-text-primary">About BrowserPilot AI</h1>
        <p className="max-w-xl mx-auto text-text-muted text-sm sm:text-base leading-relaxed">
          A hackathon and internship showcase demonstrating LLM-guided browser automation.
          Describe a task in plain English — the agent handles everything else.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-card rounded-2xl p-7 blob-bg">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-5 w-5 text-accent" />
          <h2 className="text-base font-heading font-bold text-text-primary">Mission</h2>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          Traditional browser automation requires DOM selectors, XPath, JS timing, and complex toolchains.
          BrowserPilot AI replaces all of this with a simple text prompt — powered by Gemini for planning
          and Playwright for execution — so students, researchers, and professionals can automate web tasks
          without writing a single line of code.
        </p>
      </div>

      {/* Architecture */}
      <div className="glass-card rounded-2xl p-7">
        <div className="flex items-center gap-2 mb-5">
          <Layers className="h-5 w-5 text-accent" />
          <h2 className="text-base font-heading font-bold text-text-primary">Architecture</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { emoji: '🌐', title: 'Frontend', body: 'React 18 + Vite + Tailwind CSS. Glassmorphism dashboard. WebSocket client for live log streaming.' },
            { emoji: '⚙️', title: 'Backend',  body: 'FastAPI + Python. Async task manager, WebSocket server, static file serving, JSON task storage.' },
            { emoji: '🤖', title: 'AI Agent', body: 'Gemini 1.5 Flash plans execution. Playwright performs browser actions. Results synthesized and returned.' },
          ].map(({ emoji, title, body }) => (
            <div key={title} className="bg-bg-primary/50 border border-accent/10 rounded-xl p-5 text-center">
              <p className="text-3xl mb-3">{emoji}</p>
              <p className="font-semibold text-sm text-text-primary mb-2">{title}</p>
              <p className="text-xs text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card rounded-2xl p-7">
        <div className="flex items-center gap-2 mb-5">
          <Code2 className="h-5 w-5 text-accent" />
          <h2 className="text-base font-heading font-bold text-text-primary">Technology Stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {stack.map(({ name, role, icon }) => (
            <div key={name} className="flex items-center gap-3 p-3 bg-bg-primary/50 border border-accent/10 rounded-xl hover:border-accent/25 transition-colors">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{name}</p>
                <p className="text-xs text-text-muted">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {[
          { href: 'https://github.com', icon: Github, label: 'View on GitHub' },
          { href: 'https://ai.google.dev', icon: Globe, label: 'Gemini API Docs' },
          { href: 'https://playwright.dev', icon: BookOpen, label: 'Playwright Docs' },
        ].map(({ href, icon: Icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer"
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium">
            <Icon className="h-4.5 w-4.5" /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}
