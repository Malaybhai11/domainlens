import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const url = domain.startsWith("http") ? domain : `https://${domain}`;

  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    const headers = response.headers;

    const securityHeaders = [
      {
        name: "Content-Security-Policy",
        present: headers.has("content-security-policy"),
        value: headers.get("content-security-policy"),
        maxScore: 25,
        explanation: "Restricts where content can be loaded from, preventing XSS.",
        suggestion: "Add a CSP header to specify trusted domains for scripts, styles, and other resources."
      },
      {
        name: "Strict-Transport-Security",
        present: headers.has("strict-transport-security"),
        value: headers.get("strict-transport-security"),
        maxScore: 20,
        explanation: "Tells browsers to only interact with the site over HTTPS.",
        suggestion: "Set 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'."
      },
      {
        name: "X-Frame-Options",
        present: headers.has("x-frame-options"),
        value: headers.get("x-frame-options"),
        maxScore: 15,
        explanation: "Prevents clickjacking by controlling if the page can be put in a frame.",
        suggestion: "Set 'X-Frame-Options: DENY' or 'SAMEORIGIN'."
      },
      {
        name: "X-Content-Type-Options",
        present: headers.has("x-content-type-options"),
        value: headers.get("x-content-type-options"),
        maxScore: 15,
        explanation: "Prevents browsers from MIME-sniffing the response away from the declared content-type.",
        suggestion: "Set 'X-Content-Type-Options: nosniff'."
      },
      {
        name: "Referrer-Policy",
        present: headers.has("referrer-policy"),
        value: headers.get("referrer-policy"),
        maxScore: 15,
        explanation: "Controls how much referrer information is passed to other sites.",
        suggestion: "Set 'Referrer-Policy: strict-origin-when-cross-origin'."
      },
      {
        name: "Permissions-Policy",
        present: headers.has("permissions-policy"),
        value: headers.get("permissions-policy"),
        maxScore: 10,
        explanation: "Restricts which browser features the page can use (camera, geolocation, etc.).",
        suggestion: "Add a Permissions-Policy header to disable unused features."
      }
    ];

    let totalScore = 0;
    const scoredHeaders = securityHeaders.map(h => {
      const score = h.present ? h.maxScore : 0;
      totalScore += score;
      return { ...h, score };
    });

    const grade = totalScore >= 90 ? "A" : totalScore >= 70 ? "B" : totalScore >= 50 ? "C" : totalScore >= 30 ? "D" : "F";

    return NextResponse.json({
      headers: scoredHeaders,
      overallScore: totalScore,
      grade: grade
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch security headers", details: error.message }, { status: 500 });
  }
}
