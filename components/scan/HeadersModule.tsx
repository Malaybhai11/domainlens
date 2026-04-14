"use client";

import { SecurityHeadersData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { ShieldCheck, ShieldAlert, Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface HeadersModuleProps {
  data?: SecurityHeadersData;
  isLoading?: boolean;
  error?: string;
}

export function HeadersModule({ data, isLoading, error }: HeadersModuleProps) {
  return (
    <ModuleCard title="Security Headers Audit" icon={<ShieldCheck className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-8">
          <div className="flex items-center gap-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex flex-col items-center">
              <span className={cn(
                "text-5xl font-black mb-1",
                data.grade === 'A' ? "text-emerald-400" :
                data.grade === 'B' ? "text-blue-400" :
                data.grade === 'C' ? "text-yellow-400" :
                "text-red-400"
              )}>
                {data.grade}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Grade</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold">Security Score</span>
                <span className="text-sm font-bold text-zinc-400">{data.overallScore}/100</span>
              </div>
              <Progress value={data.overallScore} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.headers.map((header) => (
              <div key={header.name} className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-white">{header.name}</h4>
                  {header.present ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{header.explanation}</p>
                {!header.present && (
                  <div className="mt-auto pt-3 border-t border-zinc-800/50">
                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Recommended Fix
                    </p>
                    <p className="text-[10px] text-zinc-400 italic">{header.suggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
