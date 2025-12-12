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
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(30, 41, 59, 0.95)',
          color: '#f8fafc',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#f8fafc',
          },
          style: {
            borderColor: 'rgba(16, 185, 129, 0.3)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#f8fafc',
          },
          style: {
            borderColor: 'rgba(239, 68, 68, 0.3)',
          },
        },
        loading: {
          iconTheme: {
            primary: '#0ea5e9',
            secondary: '#f8fafc',
          },
          style: {
            borderColor: 'rgba(14, 165, 233, 0.3)',
          },
        },
      }}
    />
  </React.StrictMode>
);
