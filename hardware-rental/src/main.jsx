// This is the main file that runs the whole program and calls the App function

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Login } from './pages/Login.jsx'
import { SignUp } from './pages/SignUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     {/*<App />   {/* Un-comment to display default page. */}
      <Login />       {/* Call to Login for testing purposes. */}
      {/*<SignUp />     {/* Call to SignUp for testing purposes. */}
  </StrictMode>,
)
