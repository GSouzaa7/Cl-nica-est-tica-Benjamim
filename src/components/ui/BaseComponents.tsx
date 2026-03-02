import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card = ({ children, className = '', title, subtitle }: CardProps) => {
  return (
    <div className={`bg-neutral-900 border border-white/10 rounded-xl shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-white/10">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
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
    primary: 'bg-gradient-to-t from-yellow-200 via-orange-400 to-orange-500 text-[#2c1306] shadow-[0_0_40px_-5px_rgba(249,115,22,0.6)] hover:scale-105 hover:shadow-[0_0_60px_-5px_rgba(249,115,22,0.8)] border-none',
    secondary: 'bg-white text-black hover:bg-neutral-200',
    outline: 'bg-transparent border border-white/10 text-neutral-300 hover:bg-white/5',
    ghost: 'bg-transparent text-neutral-400 hover:bg-white/5 hover:text-white'
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
