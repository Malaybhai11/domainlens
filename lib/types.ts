export interface WhoisData {
  domain: string;
  registered: boolean;
  created?: string;
  updated?: string;
  expires?: string;
  registrar?: {
    name?: string;
    url?: string;
    email?: string;
  };
  registrant?: {
    name?: string;
    org?: string;
    country?: string;
  };
  nameservers?: string[];
  status?: string[];
  privacyProtected?: boolean;
}

export interface DnsRecord {
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
}

export interface DnsData {
  a?: DnsRecord[];
  aaaa?: DnsRecord[];
  mx?: DnsRecord[];
  txt?: DnsRecord[];
  cname?: DnsRecord[];
  ns?: DnsRecord[];
  soa?: DnsRecord[];
  ptr?: DnsRecord[];
  caa?: DnsRecord[];
  srv?: DnsRecord[];
}

export interface SslData {
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  selfSigned?: boolean;
  chainLength?: number;
  sans?: string[];
  tlsVersions?: string[];
  hsts?: boolean;
}

export interface SubdomainData {
  subdomains: {
    name: string;
    firstSeen?: string;
    lastSeen?: string;
    hasCertificate?: boolean;
  }[];
  totalCount: number;
}

export interface HostingData {
  ipAddresses?: string[];
  reverseDns?: string;
  asn?: string;
  asnOrg?: string;
  provider?: string;
  country?: string;
  city?: string;
  countryFlag?: string;
  ipv6Support?: boolean;
  cdn?: string;
}

export interface SecurityHeader {
  name: string;
  present: boolean;
  value?: string;
  score: number;
  maxScore: number;
  explanation: string;
  suggestion?: string;
}

export interface SecurityHeadersData {
  headers: SecurityHeader[];
  overallScore: number;
  grade: string;
  cspDetails?: string;
  hstsDetails?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
}

export interface EmailSecurityData {
  spf?: {
    present: boolean;
    policy?: string;
    explanation: string;
  };
  dkim?: {
    present: boolean;
    selector?: string;
    explanation: string;
  };
  dmarc?: {
    present: boolean;
    policy?: string;
    reportingEmail?: string;
    explanation: string;
  };
  mtaSts?: {
    present: boolean;
    explanation: string;
  };
  bimi?: {
    present: boolean;
    explanation: string;
  };
  overallScore: number;
}

export interface TechnologyData {
  technologies: {
    name: string;
    category: string;
    confidence: number;
  }[];
  server?: string;
  cms?: string;
  javascript?: string[];
  analytics?: string[];
  ecommerce?: string[];
}

export interface SeoData {
  title?: {
    present: boolean;
    content?: string;
    length?: number;
    warning?: string;
  };
  metaDescription?: {
    present: boolean;
    content?: string;
    length?: number;
  };
  h1?: {
    count: number;
    content?: string[];
  };
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  canonical?: {
    present: boolean;
    url?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  twitterCard?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  robots?: {
    content?: string;
    index?: boolean;
    follow?: boolean;
  };
  robotsTxt?: {
    present: boolean;
    rules?: string[];
    disallows?: string[];
  };
  sitemap?: {
    present: boolean;
    urlCount?: number;
    lastModified?: string;
  };
  imagesWithoutAlt?: number;
  internalLinks?: number;
  externalLinks?: number;
  wordCount?: number;
  structuredData?: string[];
  viewport?: boolean;
}

export interface PageSpeedData {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
    };
    audits?: any[];
  };
  loadingExperience?: {
    metrics?: {
      LCP?: { percentile: number };
      FID?: { percentile: number };
      CLS?: { percentile: number };
      FCP?: { percentile: number };
      TTFB?: { percentile: number };
    };
  };
  mobileScore?: number;
  desktopScore?: number;
}

export interface BlacklistData {
  googleSafeBrowsing?: {
    safe: boolean;
    threats?: string[];
  };
  spamhaus?: {
    listed: boolean;
    details?: string;
  };
  surbl?: {
    listed: boolean;
    details?: string;
  };
  overallStatus: "safe" | "suspicious" | "dangerous";
  score: number;
}

export interface WaybackData {
  firstArchive?: string;
  lastArchive?: string;
  totalSnapshots?: number;
  snapshotsByYear?: { year: string; count: number }[];
  latestUrl?: string;
}

export interface TyposquatData {
  variations: {
    domain: string;
    registered: boolean;
    ip?: string;
  }[];
}

export interface RedirectStep {
  url: string;
  statusCode: number;
  responseTime: number;
}

export interface RedirectsData {
  steps: RedirectStep[];
  hasLoop: boolean;
  totalTime: number;
  httpToHttps: boolean;
}

export interface HealthScoreData {
  overallScore: number;
  letterGrade: string;
  breakdown: {
    ssl: { score: number; maxScore: number };
    securityHeaders: { score: number; maxScore: number };
    emailSecurity: { score: number; maxScore: number };
    pageSpeed: { score: number; maxScore: number };
    blacklist: { score: number; maxScore: number };
    httpsRedirect: { score: number; maxScore: number };
  };
}

export interface ScanResult {
  domain: string;
  timestamp: string;
  healthScore?: HealthScoreData;
  whois?: WhoisData;
  dns?: DnsData;
  ssl?: SslData;
  subdomains?: SubdomainData;
  hosting?: HostingData;
  headers?: SecurityHeadersData;
  email?: EmailSecurityData;
  tech?: TechnologyData;
  seo?: SeoData;
  pagespeed?: PageSpeedData;
  blacklist?: BlacklistData;
  wayback?: WaybackData;
  typosquat?: TyposquatData;
  redirects?: RedirectsData;
}

export interface ScanHistoryItem {
  id: string;
  domain: string;
  timestamp: string;
  healthScore?: number;
  letterGrade?: string;
}
