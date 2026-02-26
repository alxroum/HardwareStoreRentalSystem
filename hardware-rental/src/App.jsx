import { useState } from 'react'

// pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { HashRouter as Router, Routes, Route, Link} from 'react-router-dom'

import './App.css'

function Nav() {
  return (
    <nav>
        <div className='nav-left'>
        <h2>Hardware Rental</h2>
        </div>
        
        <div className='nav-right'>
        <div id="login-area">
            <div id="login-button">
                Login
            </div>
        </div>
        </div>
    </nav>
  )
}

function App() {
  
  return (
    <>
    <Nav/>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
    </>
  )
  
}
export default App
