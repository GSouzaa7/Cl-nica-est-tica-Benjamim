import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<void> | void;
  isDarkMode?: boolean;
  className?: string;
  defaultText?: string;
  savedText?: string;
  savingText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isDarkMode = true,
  className = '',
  defaultText = 'Salvar',
  savedText = 'Salvo com sucesso',
  savingText = 'Salvando...',
  disabled = false,
  icon
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = async () => {
    if (disabled || isSaving || isSaved) return;
    
    setIsSaving(true);
    try {
      await Promise.resolve(onClick()); // Ensures both async and sync functions are awaited
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error in SaveButton:', error);
      // Optional: Add an error state visualization if desired later
    } finally {
      setIsSaving(false);
    }
  };

  const baseClasses = "px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2";
  
  let stateClasses = `bg-orange-500 hover:bg-orange-600 ${isDarkMode ? "text-white" : "text-zinc-900"}`;
  
  if (disabled) {
    stateClasses = "bg-orange-500/50 cursor-not-allowed text-white/50";
  } else if (isSaving) {
    stateClasses = "bg-orange-500/70 cursor-wait text-white";
  } else if (isSaved) {
    stateClasses = "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 cursor-default";
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isSaving || isSaved}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      {isSaved ? (
        <>
          <CheckCircle2 size={16} />
          {savedText}
        </>
      ) : isSaving ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {savingText}
        </>
      ) : (
        <>
          {icon}
          {defaultText}
        </>
      )}
    </button>
  );
};
