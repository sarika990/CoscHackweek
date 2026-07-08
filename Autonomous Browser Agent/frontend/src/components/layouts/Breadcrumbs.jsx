import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex items-center gap-1.5 text-xs text-emerald-500/80 mb-6 px-1">
      <Link to="/" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3 w-3 text-emerald-700" />
            {isLast ? (
              <span className="text-emerald-300 font-medium">{formattedName}</span>
            ) : (
              <Link to={to} className="hover:text-emerald-300 transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
