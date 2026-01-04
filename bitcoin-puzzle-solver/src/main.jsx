import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx loaded');

try {
  const root = document.getElementById('root');
  console.log('Root element:', root);
  
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('App rendered');
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
}
