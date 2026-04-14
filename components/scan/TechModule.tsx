"use client";

import { TechnologyData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Cpu, Server, Code2, LineChart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechModuleProps {
  data?: TechnologyData;
  isLoading?: boolean;
  error?: string;
}

export function TechModule({ data, isLoading, error }: TechModuleProps) {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cms': return <Database className="w-3 h-3" />;
      case 'web server': return <Server className="w-3 h-3" />;
      case 'analytics': return <LineChart className="w-3 h-3" />;
      case 'ecommerce': return <ShoppingCart className="w-3 h-3" />;
      default: return <Code2 className="w-3 h-3" />;
    }
  };

  return (
    <ModuleCard title="Technology Stack Detector" icon={<Cpu className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {data.technologies.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No specific technologies detected beyond standard web server.</p>
            ) : (
              data.technologies.map((tech) => (
                <div key={tech.name} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg min-w-[150px]">
                  <div className="p-2 bg-zinc-800 rounded-md text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{tech.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>Primary Server: <span className="text-zinc-300 font-mono">{data.server || 'Unknown'}</span></span>
            {data.cms && <span>CMS: <span className="text-zinc-300 font-mono">{data.cms}</span></span>}
          </div>
        </div>
      )}
    </ModuleCard>
  );
}

function Database({ className }: { className?: string }) {
  return <Server className={className} />; // Fallback icon
}
