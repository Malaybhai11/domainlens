"use client";

import { PageSpeedData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Zap, Smartphone, Monitor, Info, Timer, Layout, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PageSpeedModuleProps {
  data?: PageSpeedData;
  isLoading?: boolean;
  error?: string;
}

export function PageSpeedModule({ data, isLoading, error }: PageSpeedModuleProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getMetrics = () => {
    const audits = data?.lighthouseResult?.audits as any;
    if (!audits) return [];
    
    return [
      { label: "LCP", value: audits["largest-contentful-paint"]?.displayValue, desc: "Largest Contentful Paint", icon: <Layout className="w-3 h-3" /> },
      { label: "FCP", value: audits["first-contentful-paint"]?.displayValue, desc: "First Contentful Paint", icon: <Zap className="w-3 h-3" /> },
      { label: "CLS", value: audits["cumulative-layout-shift"]?.displayValue, desc: "Cumulative Layout Shift", icon: <Smartphone className="w-3 h-3" /> },
      { label: "TTFB", value: audits["server-response-time"]?.displayValue, desc: "Time to First Byte", icon: <Clock className="w-3 h-3" /> },
    ];
  };

  return (
    <ModuleCard title="PageSpeed & Core Web Vitals" icon={<Zap className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-6">
              <div className="p-4 bg-emerald-500/10 rounded-full">
                <Smartphone className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">Mobile Score</span>
                  <span className={cn("text-2xl font-black", getScoreColor(data.mobileScore || 0))}>{data.mobileScore}</span>
                </div>
                <Progress value={data.mobileScore} className="h-2" />
              </div>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-6">
              <div className="p-4 bg-blue-500/10 rounded-full">
                <Monitor className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">Desktop Score</span>
                  <span className={cn("text-2xl font-black", getScoreColor(data.desktopScore || 0))}>{data.desktopScore}</span>
                </div>
                <Progress value={data.desktopScore} className="h-2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {getMetrics().map((metric) => (
              <div key={metric.label} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-zinc-500">
                  {metric.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{metric.label}</span>
                </div>
                <p className="text-lg font-bold text-white">{metric.value}</p>
                <p className="text-[10px] text-zinc-600 truncate">{metric.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed italic">
              Data sourced from Google PageSpeed Insights API using Lighthouse v11. Metrics represent simulated load conditions from Vercel Edge.
            </p>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
