// index.js - Entry point for your React app

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Main App component

// Find the root div in index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
