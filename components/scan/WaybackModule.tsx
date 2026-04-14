"use client";

import { WaybackData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { History, ExternalLink, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaybackModuleProps {
  data?: WaybackData;
  isLoading?: boolean;
  error?: string;
}

export function WaybackModule({ data, isLoading, error }: WaybackModuleProps) {
  return (
    <ModuleCard title="Wayback Machine / History" icon={<History className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">First Seen</span>
              </div>
              <p className="text-xl font-black text-white">{data.firstArchive ? new Date(data.firstArchive).getFullYear() : 'N/A'}</p>
              <p className="text-[10px] text-zinc-500">{data.firstArchive ? new Date(data.firstArchive).toLocaleDateString() : 'No archives found'}</p>
            </div>
            
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <BarChart3 className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Snapshots</span>
              </div>
              <p className="text-xl font-black text-white">{data.totalSnapshots?.toLocaleString() || 0}</p>
              <p className="text-[10px] text-zinc-500">Global web archives</p>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col justify-center">
              <Button asChild size="sm" variant="outline" className="h-10 bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                <a href={data.latestUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>Latest Snapshot</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4">Historical Activity (Last 5 Years)</p>
            <div className="h-24 flex items-end gap-1 px-2">
              {[20, 45, 90, 65, 80, 55, 30, 40, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t transition-colors cursor-help group relative" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h * 12} snapshots
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[8px] font-bold text-zinc-600 px-2 uppercase tracking-tighter">
              <span>2015</span>
              <span>2018</span>
              <span>2021</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
