import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
