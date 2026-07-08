import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, MousePointer, FormInput, Table, Camera, FileDown, Search, Navigation,
  RefreshCw, AlertCircle, CheckCircle, Zap, Brain, FileText, MessageSquare,
  BarChart2, Layers, Database
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Open & Navigate Websites',
    desc: 'Launches Chromium, opens URLs, handles redirects and navigation dynamically.'
  },
  {
    icon: MousePointer,
    title: 'Click Buttons & Links',
    desc: 'Identifies interactive elements via selectors and clicks them with retry logic.'
  },
  {
    icon: FormInput,
    title: 'Fill Forms',
    desc: 'Detects text, email, password, dropdown, and checkbox fields and fills them.'
  },
  {
    icon: Search,
    title: 'Search Websites',
    desc: 'Automates searches on Google, YouTube, GitHub, News, and more.'
  },
  {
    icon: Table,
    title: 'Extract Tables & Text',
    desc: 'Scrapes structured data from HTML tables, lists, and paragraphs precisely.'
  },
  {
    icon: Camera,
    title: 'Take Screenshots',
    desc: 'Captures full-page or element-specific screenshots and saves them as assets.'
  },
  {
    icon: FileDown,
    title: 'Download Files',
    desc: 'Monitors download events and retrieves files to the data directory.'
  },
  {
    icon: Navigation,
    title: 'Handle Pagination',
    desc: 'Automatically follows next-page links and traverses multi-page results.'
  },
  {
    icon: AlertCircle,
    title: 'Handle Popups & Cookies',
    desc: 'Dismisses cookie banners, modal popups, and overlays before proceeding.'
  },
  {
    icon: RefreshCw,
    title: 'Retry Failed Actions',
    desc: 'Detects timeout errors and retries page loads and element interactions.'
  },
];

const aiFeatures = [
  { icon: Brain, title: 'Task Planning', desc: 'Gemini breaks tasks into logical browser steps before executing anything.' },
  { icon: MessageSquare, title: 'Natural Language Input', desc: 'Understands instructions in plain English with no technical syntax required.' },
  { icon: Zap, title: 'Multi-Step Execution', desc: 'Chains complex browser actions across multiple pages and states.' },
  { icon: FileText, title: 'Report Generation', desc: 'Writes structured result reports with summaries, data, and screenshots.' },
  { icon: BarChart2, title: 'Execution Analytics', desc: 'Tracks success rate, task duration, and activity timelines.' },
  { icon: Layers, title: 'Conversation History', desc: 'Stores all past runs for review, filtering, and re-execution.' },
];

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
          <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
            Platform Capabilities
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-emerald-400/70 sm:text-base leading-relaxed">
          A complete list of actions BrowserPilot AI can perform autonomously via its Playwright + Gemini integration layer.
        </p>
      </div>

      {/* Browser Agent Features */}
      <div>
        <h2 className="text-xl font-bold text-emerald-300 mb-6 font-heading flex items-center gap-2">
          <Globe className="h-5 w-5" /> Browser Automation Engine
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel glass-panel-hover rounded-2xl p-5 flex gap-4">
              <div className="shrink-0 p-2.5 w-fit h-fit rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-neonGreen">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-1">{title}</p>
                <p className="text-xs text-emerald-400/70 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div>
        <h2 className="text-xl font-bold text-emerald-300 mb-6 font-heading flex items-center gap-2">
          <Brain className="h-5 w-5" /> Gemini AI Intelligence Layer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel glass-panel-hover rounded-2xl p-5 flex gap-4">
              <div className="shrink-0 p-2.5 w-fit h-fit rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-neonGreen">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-1">{title}</p>
                <p className="text-xs text-emerald-400/70 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Tasks */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 liquid-blur">
        <h2 className="text-xl font-bold text-emerald-300 mb-6 font-heading flex items-center gap-2">
          <Database className="h-5 w-5" /> Supported Task Types
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Google Search & Summarize', 'Google News Search', 'YouTube Video Search',
            'GitHub Repository Discovery', 'Python Internship Search', 'College Information Search',
            'Scholarship Finder', 'Online Course Search', 'Documentation Lookup',
            'Price Comparison', 'Demo Form Filling', 'Dummy Appointment Booking',
            'Website Content Extraction', 'Website Summary & Report'
          ].map((task) => (
            <div key={task} className="flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle className="h-4 w-4 text-neonGreen shrink-0" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-emerald-400/60 text-sm">Ready to automate your first task?</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neonGreen hover:bg-emerald-500 text-emerald-950 font-bold shadow-neon-strong transition-all duration-300 hover:scale-105"
        >
          <Zap className="h-4 w-4 fill-current" />
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}
