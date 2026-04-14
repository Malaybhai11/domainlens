"use client";

import { SeoData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Search, Type, List, Link as LinkIcon, Image as ImageIcon, Smartphone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SeoModuleProps {
  data?: SeoData;
  isLoading?: boolean;
  error?: string;
}

export function SeoModule({ data, isLoading, error }: SeoModuleProps) {
  return (
    <ModuleCard title="SEO Analyzer" icon={<Search className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Type className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Title Tag</span>
                  </div>
                  <Badge variant={data.title?.warning ? "destructive" : "secondary"} className="text-[10px] h-5">
                    {data.title?.length} chars
                  </Badge>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <p className="text-sm font-bold text-white">{data.title?.content || 'Missing Title'}</p>
                </div>
                {data.title?.warning && <p className="text-[10px] text-red-400 mt-1 italic">{data.title.warning}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <List className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Meta Description</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {data.metaDescription?.length} chars
                  </Badge>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-400 leading-relaxed">{data.metaDescription?.content || 'Missing Meta Description'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <List className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Heading Hierarchy</span>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">H1 Tag Count</span>
                    <span className={cn("font-bold px-2 py-0.5 rounded", data.h1?.count === 1 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                      {data.h1?.count}
                    </span>
                  </div>
                  {data.h1?.count === 1 && <p className="text-[10px] text-zinc-500 truncate italic">"{data.h1.content?.[0]}"</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Links</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Internal</span>
                    <span className="font-bold">{data.internalLinks}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-zinc-500">External</span>
                    <span className="font-bold">{data.externalLinks}</span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Images</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">No Alt Tags</span>
                    <span className={cn("font-bold", data.imagesWithoutAlt === 0 ? "text-emerald-500" : "text-red-400")}>{data.imagesWithoutAlt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
            <SeoFeature icon={<Smartphone className="w-3 h-3" />} label="Mobile Ready" active={data.viewport} />
            <SeoFeature icon={<Globe className="w-3 h-3" />} label="Canonical" active={data.canonical?.present} />
            <SeoFeature icon={<Search className="w-3 h-3" />} label="Open Graph" active={!!data.openGraph?.title} />
            <SeoFeature icon={<Globe className="w-3 h-3" />} label="Sitemap" active={!!data.sitemap?.present} />
          </div>
        </div>
      )}
    </ModuleCard>
  );
}

function SeoFeature({ icon, label, active }: any) {
  return (
    <div className="flex items-center gap-2 opacity-80">
      <div className={cn("p-1.5 rounded-full", active ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-600")}>
        {icon}
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-wider", active ? "text-zinc-300" : "text-zinc-600")}>{label}</span>
    </div>
  );
}
