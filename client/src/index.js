// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Импорт createRoot из react-dom/client
import App from './App';
import setupAxios from './setupAxios';

setupAxios();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
