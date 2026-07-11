import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Square, Trash2, Copy, Download, CheckCircle2, XCircle, Clock,
  Loader2, Globe, Cpu, Activity, Camera, ChevronDown, ChevronUp,
  Terminal, Zap, BarChart3, Link2
} from 'lucide-react';
import { api } from '../../services/api';
import Breadcrumbs from '../layouts/Breadcrumbs';

// ─── Quick-task Suggestions ──────────────────────────────────────────
const SUGGESTIONS = [
  'Search Python internships in Lucknow',
  'Search YouTube tutorials for machine learning',
  'Compare prices of wireless noise cancelling headphones',
  'Find scholarships for B.Tech students in India',
  'Search GitHub repositories for React dashboard UI',
  'Summarize the python.org website',
  'Search Google News for AI developments today',
  'Wikipedia: Artificial Intelligence',
];

// ─── Sub-components ──────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent = false, pulse = false }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4 glass-card-hover">
      <div className={`p-2.5 rounded-xl border shrink-0 ${accent ? 'bg-accent/12 border-accent/25 text-accent' : 'bg-bg-primary/60 border-accent/10 text-text-muted'}`}>
        <Icon className={`h-5 w-5 ${pulse ? 'animate-pulse' : ''}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
        <p className="stat-value">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',   cls: 'text-warn bg-warn/10 border-warn/25' },
    running:   { label: 'Running',   cls: 'text-accent bg-accent/10 border-accent/25', dot: true },
    completed: { label: 'Completed', cls: 'text-success bg-success/10 border-success/25' },
    failed:    { label: 'Failed',    cls: 'text-danger bg-danger/10 border-danger/25' },
    stopped:   { label: 'Stopped',   cls: 'text-text-muted bg-bg-card border-accent/10' },
  };
  const { label, cls, dot } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
      {label}
    </span>
  );
}

function ProgressBar({ progress, status }) {
  const color = status === 'failed' ? 'bg-danger' : status === 'stopped' ? 'bg-warn' : '';
  return (
    <div className="progress-bar-track h-2 w-full">
      <div
        className={`progress-bar-fill h-full ${color}`}
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );
}

function LogLine({ line }) {
  let cls = 'log-info';
  const l = line.toLowerCase();
  if (l.includes('[success]') || l.includes('✅') || l.includes('successfully'))  cls = 'log-success';
  else if (l.includes('[warning]') || l.includes('⚠️'))  cls = 'log-warning';
  else if (l.includes('[error]') || l.includes('💥') || l.includes('failed'))    cls = 'log-error';
  else if (l.includes('[info]') && (l.includes('navigat') || l.includes('🌐')))  cls = 'log-step';

  return <p className={`${cls} leading-relaxed break-all`}>{line}</p>;
}

function ResultPanel({ result }) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;
  const data = result.extracted_data;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderData = () => {
    if (!data) return null;

    if (data.internships) return (
      <div className="space-y-2.5">
        {data.internships.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-primary/60 border border-accent/10 hover:border-accent/25 transition-colors">
            <p className="font-semibold text-sm text-text-primary">{item.role}</p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.description}</p>
            {item.link && (
              <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2">
                <Link2 className="h-3 w-3" /> View Listing
              </a>
            )}
          </div>
        ))}
      </div>
    );

    if (data.scholarships) return (
      <div className="space-y-2.5">
        {data.scholarships.map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-primary/60 border border-accent/10 hover:border-accent/25 transition-colors">
            <p className="font-semibold text-sm text-text-primary">{s.name}</p>
            <p className="text-xs text-text-muted mt-1">Eligibility: {s.eligibility}</p>
            <p className="text-xs font-bold text-accent mt-1">{s.amount}</p>
            {s.link && (
              <a href={s.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1">
                <Link2 className="h-3 w-3" /> Apply
              </a>
            )}
          </div>
        ))}
      </div>
    );

    if (data.comparison) return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-accent/15 text-text-muted text-left">
              <th className="py-2 pr-4 font-semibold">Platform</th>
              <th className="py-2 pr-4 font-semibold">Price</th>
              <th className="py-2 pr-4 font-semibold">Discount</th>
            </tr>
          </thead>
          <tbody>
            {data.comparison.map((item, i) => (
              <tr key={i} className="border-b border-accent/8 hover:bg-accent/5 transition-colors">
                <td className="py-2.5 pr-4 text-accent font-semibold">{item.platform}</td>
                <td className="py-2.5 pr-4 font-bold text-text-primary">{item.price}</td>
                <td className="py-2.5 pr-4">
                  <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    {item.discount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    if (data.videos) return (
      <div className="space-y-2.5">
        {data.videos.map((v, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-primary/60 border border-accent/10 hover:border-accent/25 transition-colors">
            <p className="font-semibold text-sm text-text-primary">{v.title}</p>
            <p className="text-xs text-text-muted mt-1">Channel: {v.channel}</p>
            {v.url && (
              <a href={v.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1">
                <Link2 className="h-3 w-3" /> Watch on YouTube
              </a>
            )}
          </div>
        ))}
      </div>
    );

    if (data.results) return (
      <div className="space-y-2.5">
        {data.results.map((r, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-primary/60 border border-accent/10 hover:border-accent/25 transition-colors">
            <p className="font-semibold text-sm text-text-primary">{r.title}</p>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{r.snippet}</p>
            {r.link && (
              <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2 truncate">
                <Link2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{r.link}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    );

    if (data.repositories) return (
      <div className="space-y-2.5">
        {data.repositories.map((r, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-primary/60 border border-accent/10 hover:border-accent/25 transition-colors">
            <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold text-sm text-accent hover:underline">{r.name}</a>
            <p className="text-xs text-text-muted mt-1">{r.description}</p>
            {r.stars && <p className="text-xs text-warn mt-1">⭐ {r.stars} stars</p>}
          </div>
        ))}
      </div>
    );

    if (data.headlines) return (
      <ul className="space-y-2">
        {data.headlines.map((h, i) => (
          <li key={i} className="border-b border-accent/8 pb-2 last:border-0">
            <a href={h.url} target="_blank" rel="noreferrer"
              className="text-sm text-text-secondary hover:text-accent hover:underline block leading-snug transition-colors">
              {h.headline}
            </a>
          </li>
        ))}
      </ul>
    );

    // Fallback: raw JSON
    return (
      <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap break-words leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`p-4 rounded-xl border ${result.success ? 'border-success/20 bg-success/5' : 'border-danger/20 bg-danger/5'}`}>
        <div className="flex items-start gap-2.5">
          {result.success
            ? <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0 mt-0.5" />
            : <XCircle className="h-4.5 w-4.5 text-danger shrink-0 mt-0.5" />}
          <p className="text-sm text-text-secondary leading-relaxed">{result.summary}</p>
        </div>
        {result.error_message && (
          <p className="text-xs text-danger mt-2 pl-7">Error: {result.error_message}</p>
        )}
      </div>

      {/* Screenshot */}
      {result.screenshot && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5" /> Agent Screenshot
            </p>
            <a href={result.screenshot} download className="flex items-center gap-1 text-xs text-accent hover:underline">
              <Download className="h-3 w-3" /> Download
            </a>
          </div>
          <a href={result.screenshot} target="_blank" rel="noreferrer">
            <img
              src={result.screenshot}
              alt="Agent Screenshot"
              className="w-full rounded-xl border border-accent/15 object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
            />
          </a>
        </div>
      )}

      {/* Extracted Data */}
      {data && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-muted">Extracted Data</p>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-accent hover:underline">
              {copied ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto rounded-xl bg-bg-primary/70 border border-accent/12 p-4">
            {renderData()}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────
export default function Dashboard() {
  const [taskInput, setTaskInput]       = useState('');
  const [currentTask, setCurrentTask]   = useState(null);
  const [logs, setLogs]                 = useState([]);
  const [timeline, setTimeline]         = useState([]);
  const [stats, setStats]               = useState(null);
  const [error, setError]               = useState('');
  const [elapsedTime, setElapsedTime]   = useState(0);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const wsRef      = useRef(null);
  const logsEndRef = useRef(null);
  const timerRef   = useRef(null);
  const startTimeRef = useRef(null);

  const scrollLogs = () => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollLogs, [logs]);

  // Stats polling
  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch { /* silent fail */ }
  }, []);

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 4000);
    return () => clearInterval(iv);
  }, [fetchStats]);

  // Elapsed timer
  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };
  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // WebSocket connection
  const connectWs = (taskId) => {
    if (wsRef.current) wsRef.current.close();
    let lastLogIdx  = 0;
    let lastStepIdx = 0;

    try {
      const ws = new WebSocket(api.getWebSocketUrl(taskId));

      ws.onopen = () => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [INFO] WebSocket connected`]);

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);

          if (data.new_logs?.length) {
            setLogs(prev => [...prev, ...data.new_logs]);
          }
          if (data.new_steps?.length) {
            setTimeline(prev => [...prev, ...data.new_steps]);
          }
          if (data.status || data.progress !== undefined) {
            setCurrentTask(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                status:   data.status   ?? prev.status,
                progress: data.progress ?? prev.progress,
                result:   data.result   ?? prev.result,
              };
            });
          }
          if (['completed', 'failed', 'stopped'].includes(data.status)) {
            stopTimer();
            fetchStats();
          }
        } catch { /* ignore parse errors */ }
      };

      ws.onerror  = () => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [WARNING] WebSocket error — retrying via polling`]);
        pollTask(taskId);
      };
      ws.onclose  = () => stopTimer();
      wsRef.current = ws;
    } catch (e) {
      pollTask(taskId);
    }
  };

  // Fallback polling when WebSocket fails
  const pollTask = (taskId) => {
    const iv = setInterval(async () => {
      try {
        const task = await api.getTaskDetails(taskId);
        setCurrentTask(task);
        setLogs(task.logs || []);
        setTimeline(task.timeline || []);
        if (['completed', 'failed', 'stopped'].includes(task.status)) {
          clearInterval(iv);
          stopTimer();
          fetchStats();
        }
      } catch { clearInterval(iv); }
    }, 1500);
  };

  const handleStart = async () => {
    if (!taskInput.trim()) {
      setError('Please enter a task description.');
      return;
    }
    setError('');
    setLogs([]);
    setTimeline([]);
    setElapsedTime(0);
    setCurrentTask(null);
    if (wsRef.current) wsRef.current.close();

    try {
      const task = await api.createTask(taskInput.trim());
      setCurrentTask(task);
      startTimer();
      connectWs(task.id);
    } catch (e) {
      const msg = e.response?.data?.detail || e.message || 'Failed to connect. Is the backend running on port 8000?';
      setError(msg);
    }
  };

  const handleStop = async () => {
    if (!currentTask) return;
    try {
      await api.stopTask(currentTask.id);
      stopTimer();
    } catch { setError('Stop signal failed.'); }
  };

  const handleClear = () => {
    if (wsRef.current) wsRef.current.close();
    stopTimer();
    setCurrentTask(null);
    setLogs([]);
    setTimeline([]);
    setError('');
    setElapsedTime(0);
  };

  const isRunning = currentTask?.status === 'running' || currentTask?.status === 'pending';
  const displaySuggestions = showAllSuggestions ? SUGGESTIONS : SUGGESTIONS.slice(0, 3);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 space-y-7 animate-fade-in">
      <Breadcrumbs />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Command Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Operate your AI browser agent in real-time</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          {isRunning && (
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
              <span className="status-dot active" />
              Running — {elapsedTime}s
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completed_tasks} accent />
          <StatCard icon={Activity} label="Success Rate" value={`${stats.success_rate}%`} accent={stats.success_rate > 80} />
          <StatCard icon={XCircle} label="Failed" value={stats.failed_tasks} />
          <StatCard icon={Clock} label="Avg Duration" value={`${stats.average_time_seconds}s`} />
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Loader2} label="Running" value={stats.running_tasks} pulse={stats.running_tasks > 0} accent={stats.running_tasks > 0} />
          <StatCard icon={Globe} label="Browser" value={stats.browser_status.charAt(0).toUpperCase() + stats.browser_status.slice(1)} accent={stats.browser_status === 'active'} />
          <StatCard icon={Cpu} label="AI Engine" value={stats.ai_status === 'active' ? 'Gemini' : 'Offline'} accent={stats.ai_status === 'active'} />
          <StatCard icon={Globe} label="Current Site" value={
            stats.current_website
              ? (() => { try { return new URL(stats.current_website).hostname; } catch { return stats.current_website; } })()
              : 'None'
          } />
        </div>
      )}

      {/* Main Panel */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* ─── LEFT COLUMN ─── */}
        <div className="space-y-5">

          {/* Task Input */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-text-secondary uppercase tracking-widest">
                Task Input
              </h2>
              <Zap className="h-4 w-4 text-accent" />
            </div>

            <textarea
              value={taskInput}
              onChange={e => { setTaskInput(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleStart(); }}
              placeholder="Describe your task in plain English…&#10;e.g. 'Search Python internships in Lucknow'&#10;Press Ctrl+Enter to start"
              rows={4}
              className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"
            />

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/8 border border-danger/20 text-danger text-xs">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <p className="text-xs text-text-muted mb-2 font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {displaySuggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setTaskInput(s); setError(''); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-bg-primary/60 border border-accent/15 hover:border-accent/40 text-text-muted hover:text-text-secondary transition-all"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllSuggestions(p => !p)}
                  className="text-xs px-3 py-1.5 rounded-lg text-accent hover:underline"
                >
                  {showAllSuggestions ? 'Show less' : `+${SUGGESTIONS.length - 3} more`}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
              >
                {isRunning
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</>
                  : <><Play className="h-4 w-4 fill-current" /> Start Agent</>
                }
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="btn-danger flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
              >
                <Square className="h-4 w-4" /> Stop
              </button>
              <button
                onClick={handleClear}
                className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                <Trash2 className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>

          {/* Status + Progress */}
          {currentTask && (
            <div className="glass-card rounded-2xl p-5 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-heading font-bold text-text-secondary uppercase tracking-widest">Status</h2>
                <StatusBadge status={currentTask.status} />
              </div>
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{currentTask.task}</p>
              <ProgressBar progress={currentTask.progress} status={currentTask.status} />
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Progress: {currentTask.progress}%</span>
                {isRunning && <span>Elapsed: {elapsedTime}s</span>}
              </div>
            </div>
          )}

          {/* Execution Timeline */}
          {timeline.length > 0 && (
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-heading font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" /> Timeline
              </h2>
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {timeline.map((step, i) => {
                  const dotColor = step.status === 'success' ? 'bg-success' : step.status === 'error' ? 'bg-danger' : step.status === 'warning' ? 'bg-warn' : 'bg-accent/50';
                  return (
                    <div key={i} className="flex gap-3 animate-slide-up">
                      <div className="flex flex-col items-center mt-1.5 shrink-0">
                        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                        {i < timeline.length - 1 && <div className="w-px flex-1 bg-accent/10 mt-1" />}
                      </div>
                      <div className="pb-3 min-w-0">
                        <p className="text-xs font-semibold text-text-primary">{step.action}</p>
                        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{step.thought}</p>
                        {step.screenshot && (
                          <a href={step.screenshot} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1">
                            <Camera className="h-3 w-3" /> Screenshot
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="space-y-5">

          {/* Live Console */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Terminal className="h-4 w-4 text-accent" />
                Live Console
                {isRunning && <span className="status-dot active" />}
              </h2>
              {logs.length > 0 && (
                <button
                  onClick={() => navigator.clipboard.writeText(logs.join('\n'))}
                  className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
            <div className="terminal rounded-xl p-4 h-72 overflow-y-auto space-y-0.5">
              {logs.length === 0
                ? <p className="text-text-muted/40 italic text-xs">Agent output will appear here…</p>
                : logs.map((line, i) => <LogLine key={i} line={line} />)
              }
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Result Panel */}
          {currentTask?.result ? (
            <div className="glass-card rounded-2xl p-5 space-y-4 animate-slide-up">
              <h2 className="text-sm font-heading font-bold text-text-secondary uppercase tracking-widest">
                Task Result
              </h2>
              <ResultPanel result={
                typeof currentTask.result === 'string'
                  ? JSON.parse(currentTask.result)
                  : currentTask.result
              } />
            </div>
          ) : currentTask && !isRunning ? (
            <div className="glass-card rounded-2xl p-8 text-center text-text-muted border-dashed border border-accent/10">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-danger/60" />
              <p className="text-sm">No result data returned.</p>
            </div>
          ) : !currentTask ? (
            <div className="glass-card rounded-2xl p-8 text-center border border-dashed border-accent/10">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/8 border border-accent/15 mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-secondary mb-1">Ready to Automate</p>
              <p className="text-xs text-text-muted">Enter a task above and click Start Agent</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
