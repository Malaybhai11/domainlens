"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  icon: ReactNode;
  isLoading?: boolean;
  error?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ModuleCard({ title, icon, isLoading, error, children, defaultOpen = true }: ModuleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg text-emerald-400">
            {icon}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
        </div>
        <div className="flex items-center gap-3">
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
          {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-zinc-800 bg-black/20">
          {error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6" />
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}
