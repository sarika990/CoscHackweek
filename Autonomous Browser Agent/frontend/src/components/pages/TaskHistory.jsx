import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import Breadcrumbs from '../layouts/Breadcrumbs';

function StatusBadge({ status }) {
  const map = {
    pending: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
    running: 'text-neonGreen bg-emerald-900/20 border-emerald-700/30',
    completed: 'text-emerald-300 bg-emerald-900/20 border-emerald-700/30',
    failed: 'text-red-400 bg-red-900/20 border-red-700/30',
    stopped: 'text-gray-400 bg-gray-900/20 border-gray-700/30',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || map.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TaskRow({ task }) {
  const [expanded, setExpanded] = useState(false);
  const duration = task.completed_at && task.created_at
    ? (() => {
        try {
          const a = new Date(task.created_at).getTime();
          const b = new Date(task.completed_at).getTime();
          const secs = Math.round((b - a) / 1000);
          return `${secs}s`;
        } catch { return '—'; }
      })()
    : task.status === 'running' ? 'In Progress...' : '—';

  return (
    <>
      <tr className="border-b border-emerald-900/20 hover:bg-emerald-900/10 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="py-3 px-4 text-xs text-emerald-500/60 whitespace-nowrap">{task.created_at}</td>
        <td className="py-3 px-4 text-sm text-emerald-200 max-w-xs">
          <span className="line-clamp-1">{task.task}</span>
        </td>
        <td className="py-3 px-4"><StatusBadge status={task.status} /></td>
        <td className="py-3 px-4 text-xs text-emerald-400/60 whitespace-nowrap">{duration}</td>
        <td className="py-3 px-4">
          <div className="flex items-center justify-end gap-2 text-emerald-500">
            {task.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-neonGreen" /> : task.status === 'failed' ? <XCircle className="h-4 w-4 text-red-400" /> : <Clock className="h-4 w-4 text-yellow-500" />}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-emerald-950/30">
          <td colSpan={5} className="px-4 py-4">
            <div className="space-y-3 text-xs">
              <p className="text-emerald-500/70"><span className="text-emerald-400 font-semibold">Task ID:</span> {task.id}</p>
              {task.result && (
                <>
                  <p className={`${task.result.success ? 'text-emerald-300' : 'text-red-400'} leading-relaxed`}>{task.result.summary}</p>
                  {task.result.error_message && <p className="text-red-400">Error: {task.result.error_message}</p>}
                </>
              )}
              {task.timeline && task.timeline.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  <p className="text-emerald-500/60 font-semibold uppercase tracking-wider text-xs">Execution Steps</p>
                  {task.timeline.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${step.status === 'success' ? 'bg-neonGreen' : step.status === 'error' ? 'bg-red-500' : 'bg-emerald-700'}`} />
                      <span className="text-emerald-400 font-medium">{step.action}</span>
                      <span className="text-emerald-500/50">—</span>
                      <span className="text-emerald-500/60">{step.thought}</span>
                    </div>
                  ))}
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [clearing, setClearing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getTaskHistory();
      setTasks(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleClear = async () => {
    if (!window.confirm('Clear all task history? This action cannot be undone.')) return;
    setClearing(true);
    try {
      await api.clearHistory();
      setTasks([]);
    } catch { /* ignore */ }
    setClearing(false);
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.task.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Task History</h1>
          <p className="text-sm text-emerald-500/70 mt-0.5">{tasks.length} total runs recorded</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadHistory} className="p-2.5 bg-emerald-900/20 border border-emerald-900/30 hover:border-emerald-500/30 text-emerald-400 rounded-xl transition-all" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={handleClear} disabled={clearing || tasks.length === 0} className="flex items-center gap-1.5 px-4 py-2 bg-red-900/20 border border-red-900/30 hover:border-red-500/30 text-red-400 text-sm rounded-xl transition-all disabled:opacity-40">
            <Trash2 className="h-4 w-4" /> {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search task history..."
            className="w-full pl-9 pr-4 py-2.5 bg-emerald-950/60 border border-emerald-900/40 text-emerald-100 placeholder-emerald-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-emerald-950/60 border border-emerald-900/40 text-emerald-300 rounded-xl text-sm focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-emerald-500">
            <RefreshCw className="h-5 w-5 animate-spin" /> Loading history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-emerald-500/50">
            <Clock className="h-10 w-10" />
            <p className="font-medium">{tasks.length === 0 ? 'No tasks run yet.' : 'No results match your filter.'}</p>
            {tasks.length === 0 && <p className="text-xs">Go to the Dashboard and run your first task!</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-emerald-900/40 bg-emerald-950/40">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Task</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Duration</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Details</th>
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
