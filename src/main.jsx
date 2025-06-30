import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PickupProvider } from './contexts/PickupContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <PickupProvider>
          <App />
        </PickupProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)


