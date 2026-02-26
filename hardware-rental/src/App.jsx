import { useState } from 'react'

// pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
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
            <Link to="/admin" id="admin-button" style={{marginRight: '10px', cursor: 'pointer'}}>
                Admin
            </Link>
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
    <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </Router>
    </>
  )
  
}
export default App