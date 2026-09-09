"use client";

import React from "react";
import { Clock } from "lucide-react";

interface PremiumTimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function PremiumTimeInput({ value, onChange, disabled = false }: PremiumTimeInputProps) {
  return (
    <div className="relative flex items-center group w-36">
      {/* Royal Left Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Clock className={`h-4 w-4 transition-colors duration-300 ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-[#0F766E]'}`} />
      </div>
      
      {/* Premium Input Styling */}
      <input
        type="time"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 border rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#14B8A6]/10 focus:border-[#0F766E]
          ${disabled 
            ? 'opacity-50 cursor-not-allowed border-slate-100 text-slate-400' 
            : 'border-slate-200 text-slate-800 hover:border-[#14B8A6] dark:text-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 shadow-[0_2px_10px_-3px_rgba(20,184,166,0.15)]'
          }
        `}
        style={{ colorScheme: 'light' }}
      />

      {/* Hide the default browser ugly clock icon */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            input[type="time"]::-webkit-calendar-picker-indicator {
              background: transparent;
              bottom: 0;
              color: transparent;
              cursor: pointer;
              height: auto;
              left: 0;
              position: absolute;
              right: 0;
              top: 0;
              width: auto;
            }
          `,
        }}
      />
    </div>
  );
}