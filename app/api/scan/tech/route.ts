import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const url = domain.startsWith("http") ? domain : `https://${domain}`;

  try {
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const headers = response.headers;
    const technologies = [];

    // Simple fingerprinting
    if (html.includes("wp-content")) technologies.push({ name: "WordPress", category: "CMS", confidence: 100 });
    if (html.includes("next-container") || html.includes("_next/static")) technologies.push({ name: "Next.js", category: "Web Framework", confidence: 100 });
    if (html.includes("react-root") || html.includes("__REACT_DEVTOOLS_GLOBAL_HOOK__")) technologies.push({ name: "React", category: "Frontend Library", confidence: 90 });
    if (html.includes("googletagmanager.com")) technologies.push({ name: "Google Tag Manager", category: "Tag Management", confidence: 100 });
    if (html.includes("google-analytics.com") || html.includes("gtag(")) technologies.push({ name: "Google Analytics", category: "Analytics", confidence: 100 });
    if (html.includes("Shopify.shop")) technologies.push({ name: "Shopify", category: "Ecommerce", confidence: 100 });
    
    if (headers["server"]) technologies.push({ name: headers["server"], category: "Web Server", confidence: 100 });
    if (headers["x-powered-by"]) technologies.push({ name: headers["x-powered-by"], category: "Framework", confidence: 100 });

    return NextResponse.json({
      technologies,
      server: headers["server"],
      cms: technologies.find(t => t.category === "CMS")?.name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch technology data", details: error.message }, { status: 500 });
  }
}
