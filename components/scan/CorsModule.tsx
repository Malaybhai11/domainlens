'use client';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CorsModule({ data }: { data: any }) {
  if (!data) return <div className="p-4 text-zinc-500">Run CORS scan to see results</div>;
  return (
    <div className="space-y-3">
      <div className={`p-3 rounded-lg ${data.risk === 'low' ? 'bg-emerald-500/10' : data.risk === 'medium' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
        <div className="flex items-center gap-2 mb-2">
          {data.risk === 'low' ? <CheckCircle size={16} className="text-emerald-400" /> : <AlertTriangle size={16} className="text-amber-400" />}
          <span className="font-medium text-sm">{data.risk.toUpperCase()} Risk</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {Object.entries(data.headers || {}).map(([key, val]: any) => (
          <div key={key} className="flex justify-between p-2 bg-zinc-800/50 rounded">
            <span className="text-zinc-400">{key}</span>
            <span className="text-zinc-200 font-mono text-xs">{String(val)}</span>
          </div>
        ))}
      </div>
      {data.issues?.length > 0 && (
        <div className="p-3 bg-red-500/5 rounded-lg">
          <p className="text-xs text-red-400 mb-1">Issues:</p>
          {data.issues.map((issue: string, i: number) => (
            <p key={i} className="text-sm text-zinc-300">• {issue}</p>
          ))}
        </div>
      )}
    </div>
  );
}
