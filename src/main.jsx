import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import App from './App.jsx'
import { AppContextprovider } from './context/AppContext.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <AppContextprovider>      { /*This is our custom context provider. */}
    
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>  {/*This is the provider from the Clerk library. */}
      <App />                              {/*This is the main root component of our application */}
    </ClerkProvider>  
  
  </AppContextprovider>,
)
