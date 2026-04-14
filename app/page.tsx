"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/scan/Sidebar";
import { HealthScore } from "../components/scan/HealthScore";
import { useScan } from "../hooks/useScan";
import { WhoisModule } from "../components/scan/WhoisModule";
import { DnsModule } from "../components/scan/DnsModule";
import { SslModule } from "../components/scan/SslModule";
import { SubdomainsModule } from "../components/scan/SubdomainsModule";
import { HostingModule } from "../components/scan/HostingModule";
import { HeadersModule } from "../components/scan/HeadersModule";
import { EmailModule } from "../components/scan/EmailModule";
import { TechModule } from "../components/scan/TechModule";
import { SeoModule } from "../components/scan/SeoModule";
import { PageSpeedModule } from "../components/scan/PageSpeedModule";
import { BlacklistModule } from "../components/scan/BlacklistModule";
import { WaybackModule } from "../components/scan/WaybackModule";
import { TyposquatModule } from "../components/scan/TyposquatModule";
import { RedirectsModule } from "../components/scan/RedirectsModule";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2, Shield, Globe, Sparkles } from "lucide-react";

const modules = [
  { id: "whois", Component: WhoisModule },
  { id: "dns", Component: DnsModule },
  { id: "ssl", Component: SslModule },
  { id: "subdomains", Component: SubdomainsModule },
  { id: "hosting", Component: HostingModule },
  { id: "headers", Component: HeadersModule },
  { id: "email", Component: EmailModule },
  { id: "tech", Component: TechModule },
  { id: "seo", Component: SeoModule },
  { id: "pagespeed", Component: PageSpeedModule },
  { id: "blacklist", Component: BlacklistModule },
  { id: "wayback", Component: WaybackModule },
  { id: "typosquat", Component: TyposquatModule },
  { id: "redirects", Component: RedirectsModule },
];

export default function Home() {
  const { domain, isScanning, results, healthScore, loadingStates, errors, startScan, saveToHistory } = useScan();
  const [currentDomain, setCurrentDomain] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleScan = useCallback(async (newDomain: string) => {
    setCurrentDomain(newDomain);
    await startScan(newDomain);
  }, [startScan]);

  useEffect(() => {
    if (healthScore && domain) saveToHistory();
  }, [healthScore, domain, saveToHistory]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Sidebar onSelectDomain={handleScan} currentDomain={currentDomain} />
      <main className="pl-64">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {!currentDomain ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-10 h-10 text-emerald-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">DomainLens</h1>
              </div>
              <p className="text-zinc-400 mb-8 text-center max-w-md">Comprehensive domain intelligence for developers, agencies & security researchers.</p>
              <form onSubmit={(e) => { e.preventDefault(); if (inputValue) handleScan(inputValue.trim()); }} className="flex gap-2 w-full max-w-md">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter domain (e.g. example.com)" className="h-14 pl-11 bg-zinc-900 border-zinc-800" />
                </div>
                <Button type="submit" size="lg" className="h-14 bg-emerald-600 hover:bg-emerald-700" disabled={isScanning || !inputValue.trim()}>
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" />Scan</>}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-6 h-6 text-emerald-400" />
                    <h1 className="text-2xl font-bold">{currentDomain}</h1>
                  </div>
                  <p className="text-sm text-zinc-500">Scan completed</p>
                </div>
                <Button onClick={() => handleScan(currentDomain)} disabled={isScanning} variant="outline">
                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rescan"}
                </Button>
              </div>
              <HealthScore data={healthScore} isLoading={isScanning} />
              {isScanning && (
                <div className="flex items-center justify-center gap-2 p-4 bg-zinc-900/50 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  <span className="text-zinc-400">Running 14 parallel scans...</span>
                </div>
              )}
              <div className="space-y-4">
                {modules.map(({ id, Component }) => (
                  <Component key={id} data={results?.[id as keyof typeof results] as any} isLoading={loadingStates[id]} error={errors[id]} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
