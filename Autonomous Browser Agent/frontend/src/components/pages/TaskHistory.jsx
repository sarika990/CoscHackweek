import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw, Calendar, Link2 } from 'lucide-react';
import { api } from '../../services/api';
import Breadcrumbs from '../layouts/Breadcrumbs';

function StatusBadge({ status }) {
  const map = {
    pending:   'text-warn bg-warn/10 border-warn/25',
    running:   'text-accent bg-accent/10 border-accent/25',
    completed: 'text-success bg-success/10 border-success/25',
    failed:    'text-danger bg-danger/10 border-danger/25',
    stopped:   'text-text-muted bg-bg-card border-accent/10',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TaskRow({ task }) {
  const [expanded, setExpanded] = useState(false);

  const duration = (() => {
    if (task.completed_at && task.created_at) {
      try {
        const a = new Date(task.created_at).getTime();
        const b = new Date(task.completed_at).getTime();
        const s = Math.round((b - a) / 1000);
        return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
      } catch { return '—'; }
    }
    return task.status === 'running' ? 'In progress…' : '—';
  })();

  return (
    <>
      <tr
        className="border-b border-accent/8 hover:bg-bg-card/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        <td className="py-3.5 px-5 text-xs text-text-muted whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {task.created_at}
          </div>
        </td>
        <td className="py-3.5 px-5 text-sm text-text-secondary max-w-xs">
          <span className="line-clamp-1">{task.task}</span>
        </td>
        <td className="py-3.5 px-5"><StatusBadge status={task.status} /></td>
        <td className="py-3.5 px-5 text-xs text-text-muted whitespace-nowrap font-mono">{duration}</td>
        <td className="py-3.5 px-5">
          <div className="flex items-center justify-end gap-2">
            {task.status === 'completed'
              ? <CheckCircle2 className="h-4 w-4 text-success" />
              : task.status === 'failed'
              ? <XCircle className="h-4 w-4 text-danger" />
              : <Clock className="h-4 w-4 text-warn" />}
            {expanded
              ? <ChevronUp className="h-4 w-4 text-text-muted" />
              : <ChevronDown className="h-4 w-4 text-text-muted" />}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-bg-primary/40 animate-slide-up">
          <td colSpan={5} className="px-5 py-4">
            <div className="space-y-3 text-xs">
              <p className="font-mono text-text-muted">
                <span className="text-accent font-semibold">ID:</span> {task.id}
              </p>
              {task.result && (
                <div className={`p-3 rounded-lg border ${task.result.success ? 'border-success/20 bg-success/5' : 'border-danger/20 bg-danger/5'}`}>
                  <p className="text-text-secondary leading-relaxed">
                    {task.result.success ? '✅' : '❌'} {task.result.summary}
                  </p>
                  {task.result.error_message && (
                    <p className="text-danger mt-1">Error: {task.result.error_message}</p>
                  )}
                  {task.result.screenshot && (
                    <a href={task.result.screenshot} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline mt-2">
                      <Link2 className="h-3 w-3" /> View Screenshot
                    </a>
                  )}
                </div>
              )}
              {task.timeline?.length > 0 && (
                <div>
                  <p className="text-text-muted font-semibold mb-2">Steps ({task.timeline.length})</p>
                  <div className="space-y-1.5 pl-2">
                    {task.timeline.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full mt-1 shrink-0 ${step.status === 'success' ? 'bg-success' : step.status === 'error' ? 'bg-danger' : 'bg-accent/50'}`} />
                        <span>
                          <span className="font-semibold text-text-secondary">{step.action}</span>
                          <span className="text-text-muted"> — {step.thought}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function TaskHistory() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [clearing, setClearing] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTaskHistory();
      setTasks(data);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleClear = async () => {
    if (!window.confirm('Delete all task history? This cannot be undone.')) return;
    setClearing(true);
    try {
      await api.clearHistory();
      setTasks([]);
    } catch { /* ignore */ }
    setClearing(false);
  };

  const filtered = tasks.filter(t => {
    const matchSearch = !search || t.task.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in">
      <Breadcrumbs />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Task History</h1>
          <p className="text-sm text-text-muted mt-1">{tasks.length} total executions recorded</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleClear}
            disabled={clearing || tasks.length === 0}
            className="btn-danger flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> {clearing ? 'Clearing…' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="input-field w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="input-field px-4 py-2.5 rounded-xl text-sm min-w-[140px]"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-text-muted text-sm">
            <RefreshCw className="h-5 w-5 animate-spin text-accent" /> Loading history…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted text-sm gap-3">
            <Clock className="h-10 w-10 text-accent/30" />
            <p className="font-medium">{tasks.length === 0 ? 'No tasks run yet.' : 'No results match your filter.'}</p>
            {tasks.length === 0 && <p className="text-xs">Go to Dashboard → enter a task → click Start Agent.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-accent/10 bg-bg-primary/30">
                <tr>
                  {['Date & Time', 'Task', 'Status', 'Duration', ''].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => <TaskRow key={task.id} task={task} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
