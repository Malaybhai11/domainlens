"use client";

import { HostingData } from "@/lib/types";
import { ModuleCard } from "./ModuleCard";
import { Server, MapPin, Database, Zap, Globe } from "lucide-react";

interface HostingModuleProps {
  data?: HostingData;
  isLoading?: boolean;
  error?: string;
}

export function HostingModule({ data, isLoading, error }: HostingModuleProps) {
  return (
    <ModuleCard title="Hosting & Infrastructure" icon={<Server className="w-5 h-5" />} isLoading={isLoading} error={error}>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Server Details</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-900/50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-zinc-500">IP Addresses</span>
                  <div className="flex flex-col items-end">
                    {data.ipAddresses?.map(ip => <span key={ip} className="font-mono text-sm">{ip}</span>)}
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Provider</span>
                  <span className="font-bold text-sm text-white">{data.provider || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Network</span>
              </div>
              <div className="p-3 bg-zinc-900/50 rounded-lg flex justify-between items-center">
                <span className="text-sm text-zinc-500">ASN</span>
                <span className="font-mono text-sm">{data.asn} - {data.asnOrg}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Location</span>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center gap-4">
                <span className="text-4xl">{data.countryFlag}</span>
                <div>
                  <h4 className="font-bold">{data.city}, {data.country}</h4>
                  <p className="text-xs text-zinc-500">Node data location</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Features</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded-lg flex-1">
                  <div className={`w-2 h-2 rounded-full ${data.ipv6Support ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-sm">IPv6 Support</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded-lg flex-1">
                  <div className={`w-2 h-2 rounded-full ${data.cdn !== 'None Detected' ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                  <span className="text-sm truncate">CDN: {data.cdn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleCard>
  );
}
