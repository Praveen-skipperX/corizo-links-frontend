import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1E153D',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: { primary: '#8860B7', secondary: '#fff' },
        },
        error: {
          style: { background: '#7f1d1d', color: '#fff' },
        },
      }}
    />
  </React.StrictMode>
);
