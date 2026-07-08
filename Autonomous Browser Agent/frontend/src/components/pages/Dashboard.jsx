import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Trash2, Copy, Download, CheckCircle2, XCircle, Clock, Loader2, Globe, Cpu, Activity, Camera } from 'lucide-react';
import { api } from '../../services/api';
import Breadcrumbs from '../layouts/Breadcrumbs';

const SUGGESTIONS = [
  'Search Python internships in Lucknow',
  'Search YouTube tutorials for machine learning',
  'Compare headphone prices across websites',
  'Find scholarships for B.Tech students in India',
  'Search GitHub repositories for React dashboard',
  'Summarize the Python.org website',
  'Search Google News for AI developments',
  'Find Google internships for computer science students',
];

function StatCard({ icon: Icon, label, value, color, pulse = false }) {
  return (
    <div className="glass-panel rounded-xl p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${color} border border-emerald-900/30`}>
        <Icon className={`h-5 w-5 ${pulse ? 'animate-pulse' : ''}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-emerald-500/70 mb-0.5 truncate">{label}</p>
        <p className="text-xl font-bold text-white font-heading">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ progress, status }) {
  const colorMap = {
    running: 'bg-neonGreen',
    completed: 'bg-emerald-500',
    failed: 'bg-red-500',
    stopped: 'bg-yellow-500',
    pending: 'bg-emerald-800',
  };
  const color = colorMap[status] || 'bg-emerald-700';

  return (
    <div className="w-full h-2 bg-emerald-950/80 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500 ${status === 'running' ? 'rounded-full animate-pulse' : 'rounded-full'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', cls: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30' },
    running: { label: 'Running', cls: 'text-neonGreen bg-emerald-900/20 border-emerald-700/30', pulse: true },
    completed: { label: 'Completed', cls: 'text-emerald-300 bg-emerald-900/20 border-emerald-700/30' },
    failed: { label: 'Failed', cls: 'text-red-400 bg-red-900/20 border-red-700/30' },
    stopped: { label: 'Stopped', cls: 'text-gray-400 bg-gray-900/20 border-gray-700/30' },
  };
  const { label, cls, pulse } = map[status] || map.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-neonGreen animate-ping" />}
      {label}
    </span>
  );
}

function ResultPanel({ result }) {
  if (!result) return null;
  const data = result.extracted_data;

  const renderData = () => {
    if (!data) return null;

    // Internships
    if (data.internships) return (
      <div className="space-y-3">
        {data.internships.map((item, i) => (
          <div key={i} className="glass-panel rounded-lg p-4">
            <p className="font-semibold text-emerald-200 text-sm">{item.role}</p>
            <p className="text-xs text-emerald-400/70 mt-1 leading-relaxed">{item.description}</p>
            {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-neonGreen hover:underline mt-1 block">View Listing →</a>}
          </div>
        ))}
      </div>
    );

    // Scholarships
    if (data.scholarships) return (
      <div className="space-y-3">
        {data.scholarships.map((s, i) => (
          <div key={i} className="glass-panel rounded-lg p-4">
            <p className="font-semibold text-emerald-200 text-sm">{s.name}</p>
            <p className="text-xs text-emerald-400/70 mt-1">Eligibility: {s.eligibility}</p>
            <p className="text-xs text-neonGreen font-semibold mt-1">Amount: {s.amount}</p>
          </div>
        ))}
      </div>
    );

    // Price comparison
    if (data.comparison) return (
      <table className="w-full text-xs border-collapse">
        <thead><tr className="border-b border-emerald-900/40 text-emerald-400/70">
          <th className="text-left py-2">Platform</th>
          <th className="text-left py-2">Product</th>
          <th className="text-right py-2">Price</th>
        </tr></thead>
        <tbody>
          {data.comparison.map((item, i) => (
            <tr key={i} className="border-b border-emerald-900/20 hover:bg-emerald-900/10">
              <td className="py-2 text-neonGreen font-medium">{item.platform}</td>
              <td className="py-2 text-emerald-200 pr-2">{item.title}</td>
              <td className="py-2 text-right font-bold text-white">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    // YouTube videos
    if (data.videos) return (
      <div className="space-y-3">
        {data.videos.map((v, i) => (
          <div key={i} className="glass-panel rounded-lg p-4">
            <p className="font-semibold text-emerald-200 text-sm">{v.title}</p>
            <p className="text-xs text-emerald-500/70 mt-1">Channel: {v.channel}</p>
            <a href={v.link} target="_blank" rel="noreferrer" className="text-xs text-neonGreen hover:underline mt-1 block">Watch on YouTube →</a>
          </div>
        ))}
      </div>
    );

    // Google Search results
    if (data.results) return (
      <div className="space-y-3">
        {data.results.map((r, i) => (
          <div key={i} className="glass-panel rounded-lg p-4">
            <p className="font-semibold text-emerald-200 text-sm">{r.title}</p>
            <p className="text-xs text-emerald-400/70 mt-1 leading-relaxed">{r.snippet}</p>
            {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="text-xs text-neonGreen hover:underline mt-1 block truncate">{r.link}</a>}
          </div>
        ))}
      </div>
    );

    // Headlines
    if (data.headlines) return (
      <ul className="space-y-2">
        {data.headlines.map((h, i) => (
          <li key={i}>
            <a href={h.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-300 hover:text-white hover:underline block leading-snug">{h.headline}</a>
          </li>
        ))}
      </ul>
    );

    // GitHub repos
    if (data.repositories) return (
      <div className="space-y-3">
        {data.repositories.map((r, i) => (
          <div key={i} className="glass-panel rounded-lg p-4">
            <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold text-neonGreen text-sm hover:underline">{r.name}</a>
            <p className="text-xs text-emerald-400/70 mt-1">{r.description}</p>
          </div>
        ))}
      </div>
    );

    // Generic key-value fallback
    return (
      <pre className="text-xs text-emerald-300 whitespace-pre-wrap break-words font-mono leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`p-4 rounded-xl border ${result.success ? 'border-emerald-500/30 bg-emerald-950/60' : 'border-red-500/30 bg-red-950/30'}`}>
        <div className="flex items-start gap-2">
          {result.success
            ? <CheckCircle2 className="h-4 w-4 text-neonGreen shrink-0 mt-0.5" />
            : <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
          <p className="text-sm leading-relaxed text-emerald-100">{result.summary}</p>
        </div>
        {result.error_message && (
          <p className="text-xs text-red-400 mt-2">Error: {result.error_message}</p>
        )}
      </div>

      {/* Screenshot */}
      {result.screenshot && (
        <div>
          <p className="text-xs text-emerald-500/70 mb-2 flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" />Agent Screenshot</p>
          <a href={result.screenshot} target="_blank" rel="noreferrer">
            <img
              src={result.screenshot}
              alt="Agent Screenshot"
              className="rounded-lg border border-emerald-900/30 w-full object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
            />
          </a>
          <a
            href={result.screenshot}
            download
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-neonGreen hover:underline"
          >
            <Download className="h-3 w-3" /> Download Screenshot
          </a>
        </div>
      )}

      {/* Data */}
      {data && (
        <div>
          <p className="text-xs text-emerald-500/70 mb-2">Extracted Data</p>
          <div className="max-h-96 overflow-y-auto rounded-xl bg-emerald-950/40 border border-emerald-900/30 p-4">
            {renderData()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [taskInput, setTaskInput] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const wsRef = useRef(null);
  const logsEndRef = useRef(null);

  const scrollLogs = () => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollLogs, [logs]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const connectWebSocket = (taskId) => {
    if (wsRef.current) wsRef.current.close();
    const wsUrl = api.getWebSocketUrl(taskId);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.new_logs) setLogs(prev => [...prev, ...data.new_logs]);
        if (data.new_steps) setTimeline(prev => [...prev, ...data.new_steps]);
        if (data.status || data.progress !== undefined || data.result !== undefined) {
          setCurrentTask(prev => prev ? {
            ...prev,
            status: data.status ?? prev.status,
            progress: data.progress ?? prev.progress,
            result: data.result ?? prev.result,
          } : prev);
        }
        if (['completed', 'failed', 'stopped'].includes(data.status)) {
          fetchStats();
          ws.close();
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onerror = () => setError('WebSocket connection failed. Polling instead.');
    wsRef.current = ws;
  };

  const handleStart = async () => {
    if (!taskInput.trim()) {
      setError('Please enter a task description.');
      return;
    }
    setError('');
    setLogs([]);
    setTimeline([]);
    setCurrentTask(null);

    try {
      const task = await api.createTask(taskInput.trim());
      setCurrentTask(task);
      connectWebSocket(task.id);
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to create task. Is the backend running?');
    }
  };

  const handleStop = async () => {
    if (!currentTask) return;
    try {
      await api.stopTask(currentTask.id);
    } catch (e) {
      setError('Failed to send stop signal.');
    }
  };

  const handleClear = () => {
    if (wsRef.current) wsRef.current.close();
    setCurrentTask(null);
    setLogs([]);
    setTimeline([]);
    setError('');
  };

  const handleCopyResult = () => {
    if (currentTask?.result) {
      navigator.clipboard.writeText(JSON.stringify(currentTask.result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isRunning = currentTask?.status === 'running' || currentTask?.status === 'pending';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <Breadcrumbs />

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Command Dashboard</h1>
          <p className="text-sm text-emerald-500/70 mt-0.5">Operate your AI browser agent in real-time</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-500/70">
          <Activity className="h-4 w-4 text-neonGreen animate-pulse" />
          <span>Live Mode</span>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle2} label="Completed Tasks" value={stats.completed_tasks} color="bg-emerald-900/30 text-neonGreen" />
          <StatCard icon={Loader2} label="Running Tasks" value={stats.running_tasks} color="bg-blue-900/30 text-blue-400" pulse={stats.running_tasks > 0} />
          <StatCard icon={XCircle} label="Failed Tasks" value={stats.failed_tasks} color="bg-red-900/30 text-red-400" />
          <StatCard icon={Clock} label="Avg Duration" value={`${stats.average_time_seconds}s`} color="bg-purple-900/30 text-purple-400" />
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Success Rate" value={`${stats.success_rate}%`} color="bg-emerald-900/30 text-neonGreen" />
          <StatCard icon={Globe} label="Browser Status" value={stats.browser_status.charAt(0).toUpperCase() + stats.browser_status.slice(1)} color={stats.browser_status === 'active' ? 'bg-emerald-900/30 text-neonGreen' : 'bg-gray-900/30 text-gray-400'} pulse={stats.browser_status === 'active'} />
          <StatCard icon={Cpu} label="AI Status" value={stats.ai_status.charAt(0).toUpperCase() + stats.ai_status.slice(1)} color={stats.ai_status === 'active' ? 'bg-emerald-900/30 text-neonGreen' : 'bg-yellow-900/30 text-yellow-400'} />
          <StatCard icon={Globe} label="Current Website" value={stats.current_website ? new URL(stats.current_website).hostname : 'None'} color="bg-gray-900/30 text-gray-300" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Task Control */}
        <div className="space-y-4">
          {/* Task Input */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Task Input</h2>

            <textarea
              value={taskInput}
              onChange={e => { setTaskInput(e.target.value); setError(''); }}
              placeholder="Describe a task in plain English, e.g. 'Search Python internships in Lucknow'"
              rows={3}
              className="w-full bg-emerald-950/60 border border-emerald-900/50 text-emerald-100 placeholder-emerald-700 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}

            {/* Prompt suggestions */}
            <div>
              <p className="text-xs text-emerald-600 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => setTaskInput(s)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/20 border border-emerald-800/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-200 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2.5 bg-neonGreen hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon-strong"
              >
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                {isRunning ? 'Running...' : 'Start Agent'}
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Square className="h-4 w-4" /> Stop
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 rounded-xl font-semibold text-sm transition-all"
              >
                <Trash2 className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>

          {/* Status + Progress */}
          {currentTask && (
            <div className="glass-panel rounded-2xl p-5 space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Status</h2>
                <StatusBadge status={currentTask.status} />
              </div>
              <p className="text-xs text-emerald-500/70 truncate">{currentTask.task}</p>
              <ProgressBar progress={currentTask.progress} status={currentTask.status} />
              <p className="text-right text-xs text-emerald-500/60">{currentTask.progress}%</p>
            </div>
          )}

          {/* Execution Timeline */}
          {timeline.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Execution Timeline</h2>
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {timeline.map((step, i) => (
                  <div key={i} className="flex gap-3 animate-slide-up">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full mt-1 shrink-0 ${step.status === 'success' ? 'bg-neonGreen' : step.status === 'error' ? 'bg-red-500' : step.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-700'}`} />
                      {i < timeline.length - 1 && <div className="w-0.5 h-full bg-emerald-900/30 mt-1" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-xs font-semibold text-emerald-200 truncate">{step.action}</p>
                      <p className="text-xs text-emerald-500/60 mt-0.5 leading-relaxed">{step.thought}</p>
                      <p className="text-xs text-emerald-700/60 mt-0.5">{step.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Logs + Results */}
        <div className="space-y-4">
          {/* Live Logs */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-neonGreen animate-ping' : 'bg-emerald-700'}`} />
                Live Console
              </h2>
              {logs.length > 0 && (
                <button
                  onClick={() => { navigator.clipboard.writeText(logs.join('\n')); }}
                  className="text-xs text-emerald-500 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy Logs
                </button>
              )}
            </div>
            <div className="h-64 overflow-y-auto bg-emerald-950/70 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1 border border-emerald-900/30">
              {logs.length === 0 ? (
                <p className="text-emerald-700 italic">Waiting for agent output...</p>
              ) : (
                logs.map((line, i) => (
                  <p key={i} className="leading-relaxed break-all">{line}</p>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Results Panel */}
          {currentTask?.result && (
            <div className="glass-panel rounded-2xl p-5 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Task Result</h2>
                <button
                  onClick={handleCopyResult}
                  className="text-xs text-emerald-500 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="h-3 w-3 text-neonGreen" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <ResultPanel result={currentTask.result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
