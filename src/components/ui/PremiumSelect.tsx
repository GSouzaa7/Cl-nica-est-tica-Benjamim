import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface PremiumSelectOption {
  value: string;
  label: string;
  category?: string;
  icon?: React.ElementType;
}

interface PremiumSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: PremiumSelectOption[];
  label?: string;
  isDarkMode?: boolean;
  className?: string;
  placeholder?: string;
}

export const PremiumSelect: React.FC<PremiumSelectProps> = ({
  value,
  onChange,
  options,
  label,
  isDarkMode = true,
  className = "",
  placeholder = "Selecione..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`flex flex-col gap-2 relative ${className}`} ref={dropdownRef}>
      {label && (
        <span className={`text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${isDarkMode ? 'text-zinc-500' : 'text-neutral-400'}`}>
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-5 pr-10 py-3 rounded-xl border text-sm transition-all flex items-center justify-between group
            ${isDarkMode
              ? 'bg-[#050505] border-zinc-800 text-white focus:border-orange-500 transition-colors'
              : 'bg-white border-neutral-200 text-neutral-900 focus:border-orange-400'}
            outline-none active:scale-[0.98]
            ${isOpen ? 'border-orange-500' : ''}
          `}
        >
          <div className="flex items-center gap-3">
             {selectedOption?.icon && <selectedOption.icon size={16} className="text-orange-500" />}
             <span className={`truncate ${selectedOption ? 'font-medium' : 'text-zinc-500'}`}>
               {selectedOption?.label || placeholder}
             </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-zinc-400 transition-transform duration-300 group-hover:text-orange-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className={`
            absolute top-full left-0 right-0 mt-1 z-[150] rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200
            ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-700/50 shadow-black/80' : 'bg-white border-neutral-200 shadow-xl'}
          `}>
            <div className="flex flex-col max-h-72 overflow-y-auto custom-scrollbar">
              {options.map((opt, idx) => {
                const isSelected = value === opt.value;
                const Icon = opt.icon;
                
                return (
                  <button
                    key={opt.value + idx}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between group
                      ${isSelected
                        ? 'bg-gradient-to-r from-orange-600/30 to-transparent text-orange-500 font-medium'
                        : isDarkMode 
                          ? 'text-white hover:bg-white/5' 
                          : 'text-zinc-600 hover:bg-neutral-50 hover:text-neutral-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={14} className={isSelected ? 'text-orange-500' : 'text-zinc-400 group-hover:text-white'} />}
                      {opt.label}
                    </div>
                    {isSelected && <Check size={14} className="text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
