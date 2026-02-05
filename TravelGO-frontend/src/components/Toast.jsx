import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = React.createContext();

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        layout
                        style={{
                            background: toast.type === 'error' ? '#fee2e2' : toast.type === 'success' ? '#dcfce7' : '#e0f2fe',
                            color: toast.type === 'error' ? '#991b1b' : toast.type === 'success' ? '#166534' : '#075985',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            minWidth: '300px',
                            border: `1px solid ${toast.type === 'error' ? '#f87171' : toast.type === 'success' ? '#4ade80' : '#38bdf8'}`
                        }}
                    >
                        {toast.type === 'success' && <CheckCircle size={20} />}
                        {toast.type === 'error' && <AlertCircle size={20} />}
                        {toast.type === 'info' && <Info size={20} />}

                        <span style={{ flex: 1, fontWeight: '600', fontSize: '0.95rem' }}>{toast.message}</span>

                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Singleton to manage toasts from non-React files
let toastManager = null;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    useEffect(() => {
        toastManager = addToast;
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const toast = {
    success: (msg) => toastManager && toastManager(msg, 'success'),
    error: (msg) => toastManager && toastManager(msg, 'error'),
    info: (msg) => toastManager && toastManager(msg, 'info'),
};
