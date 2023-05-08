import ShoppingList from './ShoppingList/ShoppingList';
import './Popup.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

function Popup() {
  return (
    <div className='main-container'>
      <ShoppingList />
    </div>
  );
}

const rootContainer = document.getElementById('root-om-chrome-ext');
if (rootContainer) {
  const root = createRoot(rootContainer);
  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
