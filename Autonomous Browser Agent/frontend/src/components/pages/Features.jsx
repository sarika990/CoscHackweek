import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MousePointer, FormInput, Table, Camera, FileDown, Search, RefreshCw, AlertCircle, Navigation, Zap, Brain, FileText, MessageSquare, BarChart2, Layers, CheckCircle2 } from 'lucide-react';

const browserFeatures = [
  { icon: Globe,        title: 'Open & Navigate',     desc: 'Launches URLs, handles redirects, SPA navigation' },
  { icon: MousePointer, title: 'Click Elements',       desc: 'Buttons, links, dropdowns via smart selectors' },
  { icon: FormInput,    title: 'Fill Forms',           desc: 'Text, email, password, select, and checkbox fields' },
  { icon: Search,       title: 'Site Search',          desc: 'Google, YouTube, GitHub, News, and more' },
  { icon: Table,        title: 'Extract Data',         desc: 'Tables, lists, paragraphs — structured output' },
  { icon: Camera,       title: 'Screenshots',          desc: 'Full-page captures saved and served as assets' },
  { icon: FileDown,     title: 'Downloads',            desc: 'Triggered download events captured to storage' },
  { icon: Navigation,   title: 'Pagination',           desc: 'Follows next-page links across multi-page results' },
  { icon: AlertCircle,  title: 'Popups & Cookies',     desc: 'Auto-dismisses consent banners and overlays' },
  { icon: RefreshCw,    title: 'Retry Logic',          desc: 'Recovers from timeouts and transient failures' },
];

const aiFeatures = [
  { icon: Brain,        title: 'Task Planning',       desc: 'Breaks your request into ordered browser actions' },
  { icon: MessageSquare,title: 'Natural Language',    desc: 'Understands plain English — no selectors needed' },
  { icon: Zap,          title: 'Multi-step Chains',   desc: 'Executes complex multi-page workflows automatically' },
  { icon: FileText,     title: 'Report Generation',   desc: 'Produces structured JSON results + AI summaries' },
  { icon: BarChart2,    title: 'Analytics Tracking',  desc: 'Records duration, success rate, and step counts' },
  { icon: Layers,       title: 'History Storage',     desc: 'Persists all runs for review and re-execution' },
];

const supportedTasks = [
  'Google Search & Summarize', 'Google News Briefing', 'YouTube Video Search',
  'GitHub Repository Discovery', 'Internship & Job Finder', 'Scholarship Lookup',
  'Price Comparison', 'Wikipedia Article Summary', 'Website Content Summary',
  'Demo Form Filling', 'Documentation Search', 'General AI-Guided Research',
];

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 flex gap-4">
      <div className="shrink-0 p-2.5 w-fit h-fit rounded-xl bg-accent/10 border border-accent/20 text-accent">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
        <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-14 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-text-primary">
          Platform{' '}
          <span className="bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent">
            Capabilities
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-text-muted text-sm sm:text-base leading-relaxed">
          Every action BrowserPilot AI can perform autonomously via Playwright + Gemini.
        </p>
      </div>

      {/* Browser Automation */}
      <section>
        <h2 className="text-lg font-heading font-bold text-text-secondary mb-5 flex items-center gap-2">
          <Globe className="h-5 w-5 text-accent" /> Browser Automation Engine
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {browserFeatures.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* AI Layer */}
      <section>
        <h2 className="text-lg font-heading font-bold text-text-secondary mb-5 flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" /> Gemini AI Intelligence Layer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiFeatures.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* Supported Tasks */}
      <section className="glass-card rounded-2xl p-7 blob-bg">
        <h2 className="text-lg font-heading font-bold text-text-secondary mb-5 flex items-center gap-2">
          <Layers className="h-5 w-5 text-accent" /> Supported Task Types
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supportedTasks.map(task => (
            <div key={task} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-text-muted text-sm">Start automating now — no setup required.</p>
        <Link
          to="/dashboard"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold"
        >
          <Zap className="h-4.5 w-4.5" /> Open Dashboard
        </Link>
      </div>
    </div>
  );
}
