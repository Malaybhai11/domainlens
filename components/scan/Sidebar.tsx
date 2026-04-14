"use client";

import { useEffect, useState } from "react";
import { Search, History, Settings, Shield, Globe, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScanHistoryItem } from "@/lib/types";

interface SidebarProps {
  onSelectDomain: (domain: string) => void;
  currentDomain: string;
}

export function Sidebar({ onSelectDomain, currentDomain }: SidebarProps) {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem("domainlens_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    };

    loadHistory();
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, [currentDomain]);

  const clearHistory = () => {
    localStorage.removeItem("domainlens_history");
    setHistory([]);
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-full border-r border-zinc-800 bg-black z-40 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold">DomainLens</span>
        </div>

        <nav className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-4">
              <span>Main Navigation</span>
            </div>
            <div className="space-y-1">
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors">
                <Search className="w-4 h-4" />
                New Scan
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg text-zinc-400 hover:bg-zinc-900 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-4">
              <span className="flex items-center gap-2">
                <History className="w-3 h-3" />
                Recent Scans
              </span>
              <button onClick={clearHistory} className="hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              {history.length === 0 ? (
                <p className="px-3 py-4 text-xs text-zinc-600 text-center italic">No history yet</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectDomain(item.domain)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors text-left",
                      currentDomain === item.domain ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900/50"
                    )}
                  >
                    <span className="truncate">{item.domain}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      item.letterGrade === 'A' ? "text-emerald-400 bg-emerald-400/10" :
                      item.letterGrade === 'B' ? "text-blue-400 bg-blue-400/10" :
                      item.letterGrade === 'C' ? "text-yellow-400 bg-yellow-400/10" :
                      "text-red-400 bg-red-400/10"
                    )}>
                      {item.letterGrade}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
