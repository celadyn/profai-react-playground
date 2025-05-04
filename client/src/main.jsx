import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Modal from 'react-modal'; // Import Modal

// Set the app element for react-modal
Modal.setAppElement('#root'); // Use the selector for your app's root DOM node

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);