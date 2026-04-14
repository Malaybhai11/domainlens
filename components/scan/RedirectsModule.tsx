"use client";

import { RedirectsData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { ArrowDown, Link2, ExternalLink, AlertCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedirectsModuleProps {
  data?: RedirectsData;
  isLoading?: boolean;
  error?: string;
}

export function RedirectsModule({ data, isLoading, error }: RedirectsModuleProps) {
  return (
    <ModuleCard title="Redirect Chain Analyzer" icon={<ArrowDown className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Delay</p>
                <p className="text-xl font-black">{data.totalTime}ms</p>
              </div>
            </div>
            <div className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
              <div className={cn("p-3 rounded-full", data.httpToHttps ? "bg-emerald-500/10" : "bg-red-500/10")}>
                <Zap className={cn("w-5 h-5", data.httpToHttps ? "text-emerald-400" : "text-red-400")} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">HTTP → HTTPS</p>
                <p className="text-xl font-black">{data.httpToHttps ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <div className="relative pl-8 space-y-4">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-zinc-800" />
            
            {data.steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={cn(
                  "absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-zinc-900",
                  index === data.steps.length - 1 ? "bg-emerald-500" : "bg-zinc-800"
                )} />
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest",
                      step.statusCode >= 200 && step.statusCode < 300 ? "bg-emerald-500/10 text-emerald-500" :
                      step.statusCode >= 300 && step.statusCode < 400 ? "bg-blue-500/10 text-blue-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {step.statusCode}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{step.responseTime}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3 h-3 text-zinc-600 shrink-0" />
                    <p className="text-xs font-mono text-zinc-300 truncate">{step.url}</p>
                    <a href={step.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-zinc-600 hover:text-white">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                {index < data.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="w-4 h-4 text-zinc-700" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {data.hasLoop && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm font-bold text-red-400">Redirect loop detected! The chain was truncated.</p>
            </div>
          )}
        </div>
      )}
    </ModuleCard>
  );
}
