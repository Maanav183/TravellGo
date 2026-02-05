import React from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a', // Dark slate background matching typical modern dark themes
                    color: '#f8fafc',
                    fontFamily: "'Inter', sans-serif",
                    padding: '20px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.7)',
                        backdropFilter: 'blur(10px)',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                        maxWidth: '600px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}>
                            <AlertTriangle size={40} color="#ef4444" />
                        </div>

                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
                            Something went wrong
                        </h1>

                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
                            We encountered an unexpected error. Please try reloading the page or return to the homepage.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
                            <button
                                onClick={this.handleReload}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 24px', borderRadius: '12px',
                                    border: 'none', cursor: 'pointer',
                                    background: '#3b82f6', color: 'white',
                                    fontSize: '1rem', fontWeight: '600',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <RefreshCw size={18} /> Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 24px', borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.05)', color: 'white',
                                    fontSize: '1rem', fontWeight: '600',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Home size={18} /> Go Home
                            </button>
                        </div>

                        <details style={{ textAlign: 'left', marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
                            <summary style={{ cursor: 'pointer', color: '#64748b', fontWeight: '600', marginBottom: '10px' }}>Error Details</summary>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ef4444', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
