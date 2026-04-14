"use client";

import { BlacklistData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlacklistModuleProps {
  data?: BlacklistData;
  isLoading?: boolean;
  error?: string;
}

export function BlacklistModule({ data, isLoading, error }: BlacklistModuleProps) {
  const isSafe = data?.overallStatus === "safe";

  return (
    <ModuleCard title="Blacklist & Reputation" icon={<Shield className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className={cn(
            "p-6 rounded-xl border flex items-center gap-6",
            isSafe ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
          )}>
            <div className={cn(
              "p-4 rounded-full",
              isSafe ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {isSafe ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
            </div>
            <div>
              <h4 className={cn("text-2xl font-black uppercase tracking-wider", isSafe ? "text-emerald-400" : "text-red-400")}>
                {isSafe ? "Domain is Clean" : "Threat Detected"}
              </h4>
              <p className="text-zinc-500 text-sm">Checked against Google Safe Browsing and common blacklists.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-zinc-500" />
                <span className="text-sm">Google Safe Browsing</span>
              </div>
              <span className={cn("text-xs font-bold", data.googleSafeBrowsing?.safe ? "text-emerald-500" : "text-red-500")}>
                {data.googleSafeBrowsing?.safe ? "Clean" : "Flagged"}
              </span>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-zinc-500" />
                <span className="text-sm">Phishing Databases</span>
              </div>
              <span className="text-xs font-bold text-emerald-500">Not Found</span>
            </div>
          </div>

          {!isSafe && data.googleSafeBrowsing?.threats && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Detected Threats:</p>
              <ul className="list-disc list-inside text-sm text-red-300">
                {data.googleSafeBrowsing.threats.map((t, i) => <li key={i}>{t.replace(/_/g, " ")}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </ModuleCard>
  );
}
