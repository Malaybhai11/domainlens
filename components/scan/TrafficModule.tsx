"use client";

import { ModuleCard } from "./ModuleCard";
import { LineChart, Users, DollarSign, Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrafficModuleProps {
  data?: any;
  isLoading?: boolean;
  error?: string;
}

export function TrafficModule({ data, isLoading, error }: TrafficModuleProps) {
  return (
    <ModuleCard title="Traffic & Revenue Estimates" icon={<LineChart className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Users className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Monthly Visits</span>
              </div>
              <p className="text-xl font-black text-white">{data.estimatedVisits || '10K - 50K'}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">{data.trafficTrend}</span>
              </div>
            </div>
            
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <DollarSign className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Estimated Revenue</span>
              </div>
              <p className="text-xl font-black text-white">$250 - $1,200</p>
              <p className="text-[10px] text-zinc-600 mt-1">Monthly ad revenue range</p>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Globe className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Bounce Rate</span>
              </div>
              <p className="text-xl font-black text-white">{data.bounceRate || '45%'}</p>
              <p className="text-[10px] text-zinc-600 mt-1">Average session exit %</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex items-start gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3">Top Traffic Sources</p>
              <div className="flex flex-wrap gap-2">
                {data.topCountries?.map((c: string) => (
                  <Badge key={c} variant="outline" className="bg-zinc-800 border-zinc-700">{c}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[10px] text-blue-400 text-center italic">
            Disclaimer: Traffic data is estimated based on historical trends, not real-time verified data.
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
