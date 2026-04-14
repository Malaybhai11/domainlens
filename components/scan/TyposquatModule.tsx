"use client";

import { TyposquatData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { ShieldAlert, CheckCircle2, AlertTriangle, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TyposquatModuleProps {
  data?: TyposquatData;
  isLoading?: boolean;
  error?: string;
}

export function TyposquatModule({ data, isLoading, error }: TyposquatModuleProps) {
  const registeredCount = data?.variations.filter(v => v.registered).length || 0;

  return (
    <ModuleCard title="Typosquat & Brand Protection" icon={<ShieldAlert className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", registeredCount > 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Potential Brand Threats</h4>
                <p className="text-xs text-zinc-500">{registeredCount} of {data.variations.length} variations are registered.</p>
              </div>
            </div>
            <Badge variant={registeredCount > 0 ? "destructive" : "secondary"}>
              {registeredCount > 0 ? "Risk Detected" : "Low Risk"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.variations.map((variant) => (
              <div key={variant.domain} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 flex justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-white">{variant.domain}</span>
                  <span className="text-[10px] text-zinc-500">{variant.ip ? `IP: ${variant.ip}` : 'Not Pointed'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest",
                    variant.registered ? "bg-red-500/10 text-red-500" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {variant.registered ? "Registered" : "Available"}
                  </span>
                  {variant.registered && (
                    <a href={`http://${variant.domain}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-zinc-600 italic">
            Common variations generated include homoglyphs, character substitutions (rn → m), missing letters, and TLD swaps.
          </p>
        </div>
      )}
    </ModuleCard>
  );
}
