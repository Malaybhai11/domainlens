"use client";

import { useState, useCallback } from "react";
import { ScanResult, HealthScoreData } from "@/lib/types";

export function useScan() {
  const [domain, setDomain] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<Partial<ScanResult>>({});
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchModule = async (module: string, domainName: string) => {
    setLoadingStates((prev) => ({ ...prev, [module]: true }));
    setErrors((prev) => {
      const { [module]: _, ...rest } = prev;
      return rest;
    });

    try {
      const response = await fetch(`/api/scan/${module}?domain=${domainName}`);
      if (!response.ok) throw new Error(`Failed to fetch ${module}`);
      const data = await response.json();
      
      setResults((prev) => ({ ...prev, [module]: data }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [module]: err.message }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [module]: false }));
    }
  };

  const startScan = useCallback(async (domainName: string) => {
    setDomain(domainName);
    setIsScanning(true);
    setResults({});
    setErrors({});
    
    const modules = [
      "whois", "dns", "ssl", "subdomains", "hosting", 
      "headers", "email", "tech", "seo", "pagespeed", 
      "traffic", "blacklist", "wayback", "typosquat", "redirects",
      "health-score"
    ];

    const initialLoading: Record<string, boolean> = {};
    modules.forEach(m => initialLoading[m] = true);
    setLoadingStates(initialLoading);

    // Fetch all in parallel
    await Promise.all(modules.map(async (m) => {
      if (m === "health-score") return; // Fetch this last or calculate from results
      return fetchModule(m, domainName);
    }));

    // Finally fetch health score or calculate it
    await fetchModule("health-score", domainName);

    setIsScanning(false);
  }, []);

  const saveToHistory = useCallback(() => {
    if (!domain || !healthScore) return;
    const history = JSON.parse(localStorage.getItem("domainlens_history") || "[]");
    const newItem = {
      id: crypto.randomUUID(),
      domain,
      timestamp: new Date().toISOString(),
      healthScore: healthScore.overallScore,
      letterGrade: healthScore.letterGrade
    };
    localStorage.setItem("domainlens_history", JSON.stringify([newItem, ...history].slice(0, 10)));
  }, [domain, healthScore]);

  return {
    domain,
    isScanning,
    results,
    healthScore: results.healthScore || null,
    loadingStates,
    errors,
    startScan,
    saveToHistory
  };
}
