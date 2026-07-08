import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Shield, Cpu, ExternalLink, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
      {/* Hero section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/20 rounded-full text-xs text-neonGreen font-medium mb-2 glow-text">
          <Sparkles className="h-3.5 w-3.5" /> Next-Generation Browser Automation
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading">
          Autonomous Web Tasks <br />
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 bg-clip-text text-transparent glow-text-strong">
            Driven by Gemini AI
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-emerald-400/70 sm:text-lg leading-relaxed">
          BrowserPilot AI interprets your natural language instructions, builds dynamic execution plans, launches a live browser instance, and retrieves structured data automatically.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neonGreen hover:bg-emerald-500 text-emerald-950 font-bold shadow-neon-strong transition-all duration-300 hover:scale-105"
          >
            <Play className="h-4.5 w-4.5 fill-current" />
            Launch Dashboard
          </Link>
          <Link
            to="/features"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 text-emerald-300 transition-all duration-300"
          >
            Explore Capabilities
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Hero Liquid glass mockup representation */}
      <div className="relative glass-panel rounded-3xl p-4 md:p-8 overflow-hidden shadow-2xl max-w-4xl mx-auto liquid-blur">
        <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-4 mb-4">
          <div className="flex gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-red-500/80" />
            <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/80" />
            <span className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-emerald-500 bg-emerald-950/80 border border-emerald-900/30 px-3 py-1 rounded-full w-full max-w-sm truncate text-center">
            https://browserpilot.ai/agent/sandbox
          </span>
        </div>
        <div className="aspect-video bg-[#020e08]/90 rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/30 rounded-full animate-bounce">
            <Cpu className="h-10 w-10 text-neonGreen" />
          </div>
          <p className="font-heading text-lg text-white font-medium">Ready to execute actions autonomously</p>
          <p className="text-emerald-500/70 text-sm max-w-md">
            "Navigate to amazon.com, search for noise cancelling headphones, extract pricing matrix, and output CSV summary"
          </p>
        </div>
      </div>

      {/* Key Core value propositions */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-neonGreen">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">Instant Reasoning</h3>
          <p className="text-sm text-emerald-400/70 leading-relaxed">
            Gemini dynamically reviews DOM structure, forms plans, and handles unanticipated steps like cookies & popups autonomously.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-neonGreen">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">Playwright Security</h3>
          <p className="text-sm text-emerald-400/70 leading-relaxed">
            Runs isolated, browser-instance sessions under user control with absolute session sandboxing protection.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-neonGreen">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">Premium UI</h3>
          <p className="text-sm text-emerald-400/70 leading-relaxed">
            Designed around the Emerald Liquid Glass framework containing live consoles, status updates, and visual reports.
          </p>
        </div>
      </div>
    </div>
  );
}
