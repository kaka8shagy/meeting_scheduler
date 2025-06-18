// app/javascript/application.js (or main.js)
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+

import App from './components/App'; // Import your React component

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('react-root'); // The ID of the div where React will take over

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});