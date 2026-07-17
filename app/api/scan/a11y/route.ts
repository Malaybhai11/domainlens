import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const checks: any[] = [];
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'DomainLens-A11y/1.0' } });
    const html = await resp.text();
    
    // Check viewport meta
    checks.push({
      id: 'viewport-meta',
      name: 'Viewport meta tag',
      passed: /<meta[^>]*name=["']viewport["']/i.test(html),
      detail: /<meta[^>]*name=["']viewport["']/i.test(html) ? 'Present' : 'Missing - mobile accessibility issue',
    });
    
    // Check lang attribute
    checks.push({
      id: 'html-lang',
      name: 'HTML lang attribute',
      passed: /<html[^>]*lang=/i.test(html),
      detail: /<html[^>]*lang=/i.test(html) ? 'Present' : 'Missing - screen reader issue',
    });
    
    // Check alt text on images
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    const withoutAlt = imgTags.filter(t => !/alt=/i.test(t)).length;
    checks.push({
      id: 'img-alt',
      name: 'Image alt text',
      passed: withoutAlt === 0,
      detail: `${imgTags.length} images, ${withoutAlt} missing alt text`,
    });
    
    // Check heading hierarchy
    const h1Tags = html.match(/<h1[^>]*>/gi) || [];
    const h2Tags = html.match(/<h2[^>]*>/gi) || [];
    checks.push({
      id: 'heading-hierarchy',
      name: 'Heading hierarchy',
      passed: h1Tags.length <= 1,
      detail: `${h1Tags.length} h1 tags (should be 1)`,
    });
    
    // Check form labels
    const inputs = html.match(/<input[^>]*>/gi) || [];
    const withLabels = inputs.filter(t => /aria-label|aria-labelledby/i.test(t)).length;
    checks.push({
      id: 'form-labels',
      name: 'Form input labels',
      passed: inputs.length === 0 || withLabels > 0,
      detail: `${inputs.length} inputs, ${withLabels} with labels`,
    });

    return NextResponse.json({
      url,
      totalChecks: checks.length,
      passedChecks: checks.filter(c => c.passed).length,
      failedChecks: checks.filter(c => !c.passed).length,
      checks,
    });
  } catch (e: any) {
    return NextResponse.json({ url, error: e.message });
  }
}
