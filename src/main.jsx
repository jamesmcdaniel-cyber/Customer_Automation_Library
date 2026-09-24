import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './index.css';

// Links shared before the React rewrite used hash routes (#/example/deal-risk).
if (location.hash.startsWith('#/')) {
  history.replaceState(null, '', location.hash.slice(1));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
