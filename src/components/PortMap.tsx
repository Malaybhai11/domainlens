import React from 'react'

interface PortResult { port: number; service: string; status: 'open' | 'closed' | 'filtered' }
interface PortMapProps { ports: PortResult[] }

const SERVICE_COLORS: Record<string, string> = {
  'http': 'bg-green-500', 'https': 'bg-green-600', 'ssh': 'bg-yellow-500',
  'smtp': 'bg-orange-500', 'mysql': 'bg-blue-500', 'postgresql': 'bg-blue-600',
  'redis': 'bg-red-500', 'mongodb': 'bg-green-400',
}

export function PortMap({ ports }: PortMapProps) {
  const openPorts = ports.filter(p => p.status === 'open')
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Open Ports ({openPorts.length})</h3>
      <div className="flex flex-wrap gap-2">
        {openPorts.map(p => (
          <div key={p.port} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded border text-xs">
            <span className={'w-2 h-2 rounded-full ' + (SERVICE_COLORS[p.service] || 'bg-gray-400')} />
            <span className="font-mono">{p.port}</span>
            <span className="text-gray-500">{p.service}</span>
          </div>
        ))}
      </div>
      {openPorts.length === 0 && <p className="text-xs text-gray-400 italic">No open ports detected</p>}
    </div>
  )
}
