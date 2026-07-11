import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap, Shield, Sparkles, Globe, BarChart3, ExternalLink } from 'lucide-react';

const valueProps = [
  {
    icon: Zap,
    title: 'Instant Execution',
    desc: 'Gemini plans each task, then Playwright executes it step-by-step — Google searches, YouTube, GitHub, forms, and more.'
  },
  {
    icon: Shield,
    title: 'Isolated & Safe',
    desc: 'Every run uses a fresh Chromium session fully sandboxed in your backend. No data persists between runs.'
  },
  {
    icon: BarChart3,
    title: 'Live Observability',
    desc: 'Watch every browser action in real-time via the terminal console, execution timeline, and progress bar.'
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 space-y-20 animate-fade-in">

      {/* Hero */}
      <div className="text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent glow-accent">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Browser Automation Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-black leading-tight tracking-tight text-white">
          Automate the Web{' '}
          <span className="bg-gradient-to-r from-accent via-accent-bright to-accent bg-clip-text text-transparent glow-accent-strong">
            With Plain English
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-text-muted text-base sm:text-lg leading-relaxed">
          Type any web task. BrowserPilot AI plans, launches a real browser, executes every step,
          and delivers structured results — automatically.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="btn-primary flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold"
          >
            <Play className="h-4.5 w-4.5 fill-current" />
            Open Dashboard
          </Link>
          <Link
            to="/features"
            className="btn-secondary flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold"
          >
            Explore Features
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Browser mockup */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 blob-bg shadow-glass">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-accent/10">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-danger/70" />
            <span className="h-3 w-3 rounded-full bg-warn/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-text-muted bg-bg-primary/60 border border-accent/10 px-4 py-1 rounded-full font-mono">
              https://browserpilot.ai/agent/live
            </span>
          </div>
        </div>
        <div className="aspect-video bg-bg-primary/90 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-5 border border-accent/8">
          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 animate-pulse-glow">
            <Globe className="h-12 w-12 text-accent" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-text-primary">Agent Executing Task</p>
            <p className="text-sm text-text-muted mt-2 max-w-md leading-relaxed">
              "Search Python internships in Lucknow, extract top 5 listings with links and descriptions"
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-accent font-medium">
            <span className="status-dot active" />
            Browsing google.com → indeed.com → internshala.com…
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="grid md:grid-cols-3 gap-6">
        {valueProps.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card glass-card-hover rounded-2xl p-6 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-accent/10 border border-accent/20">
              <Icon className="h-5.5 w-5.5 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-base text-text-primary">{title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="glass-card rounded-2xl p-8 text-center space-y-4 blob-bg">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Ready to automate?</h2>
        <p className="text-text-muted text-sm">No configuration needed. Just type and go.</p>
        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold"
        >
          <Zap className="h-4.5 w-4.5 fill-current" /> Launch Dashboard
        </Link>
      </div>
    </div>
  );
}
