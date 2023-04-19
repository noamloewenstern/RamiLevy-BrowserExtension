import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootContainer = document.getElementById('root-om-chrome-ext');
if (rootContainer) {
  const root = createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
