import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store' 
import { PersistGate } from 'redux-persist/integration/react' 
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- Add this import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* --- Add this Google wrapper with your specific key! --- */}
        <GoogleOAuthProvider clientId="605480101966-9reqb4thtt6dviu853ol9tshqp931dou.apps.googleusercontent.com">
          
          <PayPalScriptProvider deferLoading={true}>
            <App />
          </PayPalScriptProvider>

        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)