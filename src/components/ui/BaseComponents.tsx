import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card = ({ children, className = '', title, subtitle }: CardProps) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white',
    outline: 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'orange' }: { children: React.ReactNode, variant?: 'orange' | 'slate' | 'emerald' | 'red' }) => {
  const variants = {
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${variants[variant]}`}>
      {children}
    </span>
  );
};
