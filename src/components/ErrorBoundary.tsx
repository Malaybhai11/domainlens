import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false } }
  
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Scan error caught:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Scan Error</h3>
          <p className="text-red-600 text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700 text-sm">
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
