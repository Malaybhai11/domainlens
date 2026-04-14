"use client";

import { HealthScoreData } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface HealthScoreProps {
  data?: HealthScoreData | null;
  isLoading: boolean;
}

export function HealthScore({ data, isLoading }: HealthScoreProps) {
  if (isLoading && !data) {
    return (
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center animate-pulse">
        <div className="w-32 h-32 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { name: "Score", value: data.overallScore },
    { name: "Remaining", value: 100 - data.overallScore },
  ];

  const getColor = (score: number) => {
    if (score >= 90) return "#10b981"; // Emerald-500
    if (score >= 70) return "#3b82f6"; // Blue-500
    if (score >= 50) return "#f59e0b"; // Amber-500
    return "#ef4444"; // Red-500
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={getColor(data.overallScore)} stroke="none" />
                  <Cell fill="#18181b" stroke="none" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{data.overallScore}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-1">
              Grade <span className={cn(
                "px-3 py-0.5 rounded-lg",
                data.overallScore >= 90 ? "text-emerald-400 bg-emerald-400/10" :
                data.overallScore >= 70 ? "text-blue-400 bg-blue-400/10" :
                data.overallScore >= 50 ? "text-yellow-400 bg-yellow-400/10" :
                "text-red-400 bg-red-400/10"
              )}>{data.letterGrade}</span>
            </h2>
            <p className="text-zinc-500 max-w-sm">Domain health is calculated based on SSL, security headers, email security, page speed, and blacklists.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(data.breakdown).map(([key, value]) => (
            <div key={key} className="p-3 bg-black/40 border border-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate mr-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {value.score === value.maxScore ? (
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                ) : value.score > 0 ? (
                  <Info className="w-3 h-3 text-zinc-500" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                )}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-lg font-bold">{value.score}</span>
                <span className="text-xs text-zinc-600 mb-0.5">/ {value.maxScore}</span>
              </div>
              <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${(value.score / value.maxScore) * 100}%`,
                    backgroundColor: getColor((value.score / value.maxScore) * 100)
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col justify-center">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Security Overview</h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Shield className={cn("w-5 h-5", data.overallScore > 80 ? "text-emerald-400" : "text-zinc-600")} />
            <span>Robust Encryption</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className={cn("w-5 h-5", data.breakdown.httpsRedirect.score > 0 ? "text-emerald-400" : "text-red-400")} />
            <span>HTTPS Redirection</span>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className={cn("w-5 h-5", data.breakdown.blacklist.score === 15 ? "text-emerald-400" : "text-red-400")} />
            <span>Reputation Status: {data.breakdown.blacklist.score === 15 ? 'Clean' : 'Risky'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
