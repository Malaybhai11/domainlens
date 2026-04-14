"use client";

import { DnsData, DnsRecord } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Search, Copy, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DnsModuleProps {
  data?: DnsData;
  isLoading?: boolean;
  error?: string;
}

export function DnsModule({ data, isLoading, error }: DnsModuleProps) {
  const allRecords: DnsRecord[] = data ? [
    ...(data.a || []),
    ...(data.aaaa || []),
    ...(data.mx || []),
    ...(data.txt || []),
    ...(data.cname || []),
    ...(data.ns || []),
    ...(data.soa || []),
    ...(data.caa || []),
    ...(data.ptr || []),
    ...(data.srv || []),
  ] : [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTTL = (ttl: number) => {
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`;
    return `${Math.floor(ttl / 86400)}d`;
  };

  return (
    <ModuleCard title="DNS Records Explorer" icon={<Search className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none">
                {allRecords.length} Records Found
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs bg-zinc-900 border-zinc-800" onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}>
                <Copy className="w-3 h-3 mr-2" /> Copy JSON
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Host / Name</th>
                  <th className="pb-3 px-2">Value / Content</th>
                  <th className="pb-3 px-2">TTL</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {allRecords.map((record, i) => (
                  <tr key={`${record.type}-${record.name}-${i}`} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-3 px-2">
                      <Badge className={cn(
                        "font-mono text-[10px]",
                        record.type === 'A' ? "bg-blue-500/10 text-blue-400" :
                        record.type === 'MX' ? "bg-purple-500/10 text-purple-400" :
                        record.type === 'TXT' ? "bg-orange-500/10 text-orange-400" :
                        "bg-zinc-800 text-zinc-400"
                      )}>
                        {record.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-mono text-zinc-400 truncate max-w-[150px]">{record.name}</td>
                    <td className="py-3 px-2 font-mono text-white truncate max-w-[300px]">
                      {record.type === 'MX' && <span className="text-zinc-500 mr-2 text-[10px]">[{record.priority}]</span>}
                      {record.content}
                    </td>
                    <td className="py-3 px-2 text-zinc-500 text-xs">{formatTTL(record.ttl)}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => copyToClipboard(record.content)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-emerald-400 transition-opacity">
                        <Copy className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
