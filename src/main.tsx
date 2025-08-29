import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TaxProvider } from './contexts/TaxContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById("root")!).render(
  <TaxProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </TaxProvider>
);
