import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  let currentUrl = domain.startsWith("http") ? domain : `http://${domain}`;
  const steps: any[] = [];
  let hasLoop = false;
  const visited = new Set<string>();
  let totalTime = 0;

  try {
    for (let i = 0; i < 5; i++) { // Max 5 redirects
      if (visited.has(currentUrl)) {
        hasLoop = true;
        break;
      }
      visited.add(currentUrl);

      const start = Date.now();
      const response = await axios.get(currentUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
        headers: { 'User-Agent': 'DomainLens/1.0' }
      });
      const duration = Date.now() - start;
      totalTime += duration;

      steps.push({
        url: currentUrl,
        statusCode: response.status,
        responseTime: duration
      });

      if (response.status >= 300 && response.status < 400 && response.headers.location) {
        let nextUrl = response.headers.location;
        if (!nextUrl.startsWith("http")) {
          const base = new URL(currentUrl);
          nextUrl = new URL(nextUrl, base.origin).href;
        }
        currentUrl = nextUrl;
      } else {
        break;
      }
    }

    return NextResponse.json({
      steps,
      hasLoop,
      totalTime,
      httpToHttps: steps.some(s => s.url.startsWith("https://"))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      steps: steps.length > 0 ? steps : [{ url: currentUrl, statusCode: 500, responseTime: 0 }],
      error: error.message 
    });
  }
}
