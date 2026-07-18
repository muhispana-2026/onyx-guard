import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

const originalError = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('BloomFilter')) return;
    if (args[0] && args[0].message && args[0].message.includes('BloomFilter')) return;
    originalError(...args);
};

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
