"use client";

import { WhoisData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Info, Calendar, User, Globe, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WhoisModuleProps {
  data?: WhoisData;
  isLoading?: boolean;
  error?: string;
}

export function WhoisModule({ data, isLoading, error }: WhoisModuleProps) {
  const getExpiryColor = (days: number) => {
    if (days < 30) return "text-red-400 bg-red-400/10";
    if (days < 90) return "text-yellow-400 bg-yellow-400/10";
    return "text-emerald-400 bg-emerald-400/10";
  };

  const daysToExpiry = data?.expires 
    ? Math.floor((new Date(data.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <ModuleCard title="WHOIS & Registration" icon={<Info className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Dates</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-900/50 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Registered</p>
                  <p className="font-mono text-sm">{data.created ? new Date(data.created).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Expires</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{data.expires ? new Date(data.expires).toLocaleDateString() : 'N/A'}</p>
                    {data.expires && (
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", getExpiryColor(daysToExpiry))}>
                        {daysToExpiry}d
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Registrar</span>
              </div>
              <div className="p-3 bg-zinc-900/50 rounded-lg">
                <p className="font-bold">{data.registrar?.name || 'Unknown Registrar'}</p>
                <p className="text-xs text-zinc-500 truncate">{data.registrar?.url}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Name Servers</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.nameservers?.map((ns) => (
                  <Badge key={ns} variant="outline" className="font-mono bg-zinc-900/50 border-zinc-800">
                    {ns}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Privacy & Protection</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", data.privacyProtected ? "bg-emerald-500" : "bg-zinc-700")} />
                  <span className="text-sm">WHOIS Privacy</span>
                </div>
                {data.registrant?.country && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Country: </span>
                    <span className="text-sm font-bold">{data.registrant.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
