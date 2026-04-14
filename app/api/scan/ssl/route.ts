import { NextRequest, NextResponse } from "next/server";
import { connect } from "tls";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    const certInfo = await getCertificateInfo(domain);
    return NextResponse.json(certInfo);
  } catch (error: any) {
    return NextResponse.json({ 
      valid: false, 
      error: error.message 
    });
  }
}

async function getCertificateInfo(domain: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const socket = connect(443, domain, { servername: domain }, () => {
        const cert = socket.getPeerCertificate();
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve({ valid: false, error: "No certificate found" });
          return;
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const now = new Date();
        const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        const result = {
          valid: socket.authorized,
          issuer: cert.issuer.O || cert.issuer.CN,
          subject: cert.subject.CN,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining: daysRemaining,
          selfSigned: cert.issuer.CN === cert.subject.CN,
          sans: cert.subjectaltname ? cert.subjectaltname.split(', ').map(s => s.replace('DNS:', '')) : [],
          protocol: socket.getProtocol(),
          authorized: socket.authorized,
          authorizationError: socket.authorizationError
        };

        socket.destroy();
        resolve(result);
      });

      socket.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });

      socket.setTimeout(5000, () => {
        socket.destroy();
        resolve({ valid: false, error: "Connection timeout" });
      });
    } catch (e: any) {
      resolve({ valid: false, error: e.message });
    }
  });
}
