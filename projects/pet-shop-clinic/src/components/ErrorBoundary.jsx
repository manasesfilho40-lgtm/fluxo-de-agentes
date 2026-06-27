import { Component, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

function ErrorFallback({ error, onRetry }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    }
  }, [])

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
          <AlertTriangle className="text-accent" size={40} />
        </div>
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-4">Algo deu errado</h1>
        <p className="font-heading text-dark/60 text-lg mb-8">
          Ops! Encontramos um erro inesperado. Nossa equipe já foi notificada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onRetry} className="btn-magnetic inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
            <RefreshCw size={18} className="relative z-10" />
            <span className="relative z-10">Tentar novamente</span>
          </button>
          <Link to="/" className="btn-magnetic inline-flex items-center justify-center gap-2 border border-dark/20 text-dark px-8 py-4 rounded-full font-heading font-medium text-base hover:bg-dark/5 transition-colors">
            <Home size={18} className="relative z-10" />
            <span className="relative z-10">Voltar ao Início</span>
          </Link>
        </div>
        {import.meta.env.DEV && error && (
          <details className="mt-8 text-left p-4 bg-dark/5 rounded-xl">
            <summary className="font-mono text-accent text-xs cursor-pointer mb-2">Detalhes do erro (dev)</summary>
            <pre className="font-mono text-xs text-dark/70 overflow-auto max-h-64">{error.toString()}</pre>
          </details>
        )}
      </div>
    </section>
  )
}

export default function ErrorBoundary({ children, fallback }) {
  return <ErrorBoundaryInner fallback={fallback}>{children}</ErrorBoundaryInner>
}