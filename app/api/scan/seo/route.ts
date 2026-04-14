import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

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
    
    const $ = cheerio.load(response.data);
    
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const h1s = $("h1").map((i, el) => $(el).text()).get();
    
    const seoData = {
      title: {
        present: !!title,
        content: title,
        length: title.length,
        warning: title.length > 60 ? "Title too long" : title.length < 30 ? "Title too short" : undefined
      },
      metaDescription: {
        present: !!description,
        content: description,
        length: description?.length || 0
      },
      h1: {
        count: h1s.length,
        content: h1s
      },
      canonical: {
        present: !!$('link[rel="canonical"]').attr("href"),
        url: $('link[rel="canonical"]').attr("href")
      },
      openGraph: {
        title: $('meta[property="og:title"]').attr("content"),
        description: $('meta[property="og:description"]').attr("content"),
        image: $('meta[property="og:image"]').attr("content")
      },
      imagesWithoutAlt: $("img:not([alt])").length,
      viewport: !!$('meta[name="viewport"]').attr("content"),
      internalLinks: $(`a[href^="/"], a[href^="${url}"]`).length,
      externalLinks: $(`a[href^="http"]:not([href^="${url}"])`).length
    };

    return NextResponse.json(seoData);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch SEO data", details: error.message }, { status: 500 });
  }
}
