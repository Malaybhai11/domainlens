"use client";

import { SslData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Shield, ShieldAlert, ShieldCheck, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SslModuleProps {
  data?: SslData;
  isLoading?: boolean;
  error?: string;
}

export function SslModule({ data, isLoading, error }: SslModuleProps) {
  return (
    <ModuleCard title="SSL/TLS Certificate" icon={<Shield className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className={cn(
                "p-3 rounded-full",
                data.valid ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {data.valid ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Status</p>
                <h4 className="text-xl font-bold">{data.valid ? "Valid & Secure" : "Invalid / Expired"}</h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">Issuer</p>
                <p className="font-bold text-sm truncate">{data.issuer || 'N/A'}</p>
              </div>
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">Remaining</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <p className="font-bold text-sm">{data.daysRemaining} days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Subject Alt Names (SANs)</p>
              <div className="flex flex-wrap gap-1">
                {data.sans?.slice(0, 10).map((san) => (
                  <Badge key={san} variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-none">
                    {san}
                  </Badge>
                ))}
                {(data.sans?.length || 0) > 10 && (
                  <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-none">
                    +{(data.sans?.length || 0) - 10} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-500" />
                <span className="text-sm">Chain Depth</span>
              </div>
              <span className="font-bold">{data.chainLength || 1}</span>
            </div>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
