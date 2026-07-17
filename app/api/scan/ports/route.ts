import { NextRequest, NextResponse } from 'next/server';
import * as net from 'net';

const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 445, service: 'SMB' },
  { port: 993, service: 'IMAPS' },
  { port: 995, service: 'POP3S' },
  { port: 1433, service: 'MSSQL' },
  { port: 3306, service: 'MySQL' },
  { port: 3389, service: 'RDP' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 5900, service: 'VNC' },
  { port: 6379, service: 'Redis' },
  { port: 8080, service: 'HTTP-Alt' },
  { port: 8443, service: 'HTTPS-Alt' },
  { port: 27017, service: 'MongoDB' },
];

async function checkPort(host: string, port: number, timeout = 3000): Promise<boolean> {
  return new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.connect(port, host);
  });
}

export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  try {
    const results = [];
    for (const { port, service } of COMMON_PORTS) {
      const isOpen = await checkPort(domain, port);
      results.push({ port, service, status: isOpen ? 'open' : 'closed' });
    }
    const openPorts = results.filter(r => r.status === 'open');
    return NextResponse.json({
      domain,
      scanResults: results,
      openPorts,
      openCount: openPorts.length,
      risk: openPorts.length > 5 ? 'high' : openPorts.length > 2 ? 'medium' : 'low',
    });
  } catch (e: any) {
    return NextResponse.json({ domain, error: e.message });
  }
}
