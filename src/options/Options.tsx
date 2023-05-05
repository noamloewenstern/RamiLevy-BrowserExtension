import { createRoot } from 'react-dom/client';
import EnableReportErrorPage from './config/EnableReportErrorPage';
import React from 'react';

export default function Options() {
  return (
    <div className='rcet-main-cointainer'>
      {/* Basic simple styles settings page */}
      <h1>Rami Levy Chrome Extension Options</h1>
      <p>Some options</p>
      <EnableReportErrorPage />
      <br />
    </div>
  );
}

const rootContainer = document.getElementById('root-om-chrome-ext');
if (rootContainer) {
  const root = createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>,
  );
}
