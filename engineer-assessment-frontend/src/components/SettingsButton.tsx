import { Check, Settings } from "lucide-react";
import { useState } from "react";
import { PROVIDERS } from "../types/constants";

interface SettingsButtonProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

export function SettingsButton({ selectedProvider, onProviderChange }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg border transition-all outline-none group relative ${
          isOpen ? "bg-blue-600 border-blue-600 text-white rotate-90" : "bg-white/80 backdrop-blur-md border-slate-200 text-slate-600 hover:text-blue-600 hover:scale-105"
        }`}
      >
        <Settings className="w-5 h-5" />

        {/* Tooltip */}
        {!isOpen && <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">AI Settings</span>}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Your AI</div>
            <div className="space-y-1">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onProviderChange(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedProvider === p.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  {p.name}
                  {selectedProvider === p.id && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
