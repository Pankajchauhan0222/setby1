import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'success' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600",
    success: "bg-accent-500 text-white hover:bg-accent-600 shadow-md",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ current: number; total: number; className?: string }> = ({ current, total, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className={`w-full bg-slate-100 rounded-full h-3 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input 
      className={`border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors ${className}`} 
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, className = '', ...props }) => (
   <div className="flex flex-col gap-1 mb-4">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <select 
      className={`border border-slate-300 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors ${className}`} 
      {...props} 
    >
      {children}
    </select>
  </div>
);