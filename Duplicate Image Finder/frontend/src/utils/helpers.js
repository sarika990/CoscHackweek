export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getMatchBadgeColor = (matchLevel) => {
  switch (matchLevel) {
    case 'Duplicate Found':
      return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    case 'Very Similar':
      return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
    case 'Similar':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'Partially Similar':
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
};
