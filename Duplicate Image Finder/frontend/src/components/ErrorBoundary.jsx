import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-500 mb-2">
              <AlertOctagon className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Something Went Wrong
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A rendering or runtime exception occurred in the application.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 text-left">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Error Details:
                </p>
                <p className="text-xs font-mono text-rose-600 dark:text-rose-400 break-all leading-relaxed whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold transition-all active:scale-98"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
