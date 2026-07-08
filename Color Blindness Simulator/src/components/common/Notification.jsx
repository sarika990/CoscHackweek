import React, { useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notification() {
  const { notification, clearNotification } = useSimulator();
  const { type, message } = notification;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, clearNotification]);

  if (!message) return null;

  const styles = {
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    error: 'bg-rose-950/80 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
    info: 'bg-blue-950/80 border-blue-500/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md pointer-events-auto ${styles[type] || styles.info}`}
        >
          {icons[type] || icons.info}
          <p className="text-sm font-medium pr-2 max-w-[320px]">{message}</p>
          <button
            onClick={clearNotification}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 opacity-75" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
