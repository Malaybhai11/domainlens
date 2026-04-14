"use client";

import { EmailSecurityData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Mail, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailModuleProps {
  data?: EmailSecurityData;
  isLoading?: boolean;
  error?: string;
}

export function EmailModule({ data, isLoading, error }: EmailModuleProps) {
  return (
    <ModuleCard title="Email Security Checker" icon={<Mail className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <SecurityCard title="SPF" present={data.spf?.present} policy={data.spf?.policy} explanation={data.spf?.explanation} />
            <SecurityCard title="DMARC" present={data.dmarc?.present} policy={data.dmarc?.policy} explanation={data.dmarc?.explanation} />
            <SecurityCard title="BIMI" present={data.bimi?.present} explanation={data.bimi?.explanation} />
          </div>
          
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Email Security Score: {data.overallScore}/100</p>
              <p className="text-xs text-zinc-500 mt-1">Based on presence of SPF, DMARC, and BIMI records.</p>
            </div>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}

function SecurityCard({ title, present, policy, explanation }: any) {
  return (
    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500">{title}</h4>
        {present ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className={cn("text-xs font-bold", present ? "text-white" : "text-red-400")}>
          {present ? "Records Found" : "Missing Record"}
        </span>
        {policy && (
          <p className="text-[10px] text-zinc-500 truncate bg-black/40 p-1.5 rounded">{policy}</p>
        )}
      </div>
      <p className="text-[10px] text-zinc-400 leading-relaxed italic border-t border-zinc-800 pt-2">{explanation}</p>
    </div>
  );
}
