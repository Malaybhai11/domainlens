"use client";

import { SubdomainData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Globe, ExternalLink, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubdomainsModuleProps {
  data?: SubdomainData;
  isLoading?: boolean;
  error?: string;
}

export function SubdomainsModule({ data, isLoading, error }: SubdomainsModuleProps) {
  return (
    <ModuleCard title="Subdomain Enumerator" icon={<Globe className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none">
              {data.totalCount} Subdomains Discovered
            </Badge>
            <Button size="sm" variant="outline" className="h-8 text-xs bg-zinc-900 border-zinc-800">
              <Download className="w-3 h-3 mr-2" /> Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data.subdomains.slice(0, 50).map((sub) => (
              <div key={sub.name} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded border border-zinc-800/50 hover:bg-zinc-800 transition-colors group">
                <span className="text-xs font-mono truncate mr-2">{sub.name}</span>
                <a 
                  href={`https://${sub.name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-emerald-400 transition-opacity"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
            {data.totalCount > 50 && (
              <div className="col-span-full p-4 text-center text-zinc-600 text-xs italic">
                Showing first 50 results. {(data.totalCount - 50)} more concealed.
              </div>
            )}
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
