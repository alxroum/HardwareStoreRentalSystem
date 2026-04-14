import { useEffect, useState } from 'react'

// pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Cart } from './pages/Cart'
import { SignUp } from './pages/SignUp'
import { Account } from './pages/Account'
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

import cartIcon from '/assets/cart-icon.png'
import logo from '/assets/logo.png'

import './styles/App.css'

import tool_data from './tool_data.json'

// this function should ideally be moved to a dedicated database file with the read and write functions
export function grabToolData() {
    const [inventory, setInventory] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/inventory")
            .then(res => res.json())
            .then(data => {
                console.log("INVENTORY FROM BACKEND:", data)
                setInventory(data)
            })
            .catch(err => console.error("Error fetching inventory:", err))
    }, [])

    return inventory;
}

function Nav({ loggedIn, onLogout }) {
    return (
        <nav>
            <div className='nav-left'>
                <Link className="hidden-link" to="/" style={{ cursor: 'pointer' }}>
                    <div id="nav-header">
                        <img id="nav-logo" src={logo}></img>
                        <h2 id="header-text">Hardware Rental</h2>
                    </div>
                </Link>
            </div>

            {/* Only show nav links when logged in */}
            {loggedIn && (
                <div className='nav-right'>
                    <div id="login-area">
                        <Link className="hidden-link" to="/admin" style={{ cursor: 'pointer' }}>
                            <div id="admin-page-button">Admin</div>
                        </Link>
                        <Link className="hidden-link" to="/account" style={{ cursor: 'pointer' }}>
                            <div id="account-page-button">Account</div>
                        </Link>
                        <Link className="hidden-link" to="/cart" style={{ cursor: 'pointer' }}>
                            <div id="cart-page-button">Cart</div>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

function App() {
    // Check localStorage on mount to persist login across refreshes
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("LOGGEDIN") === "true");

    // Listen for login state changes (e.g. from Account logout)
    useEffect(() => {
        const handleStorageChange = () => {
            setLoggedIn(localStorage.getItem("LOGGEDIN") === "true");
        };
        window.addEventListener("loginStateChanged", handleStorageChange);
        return () => window.removeEventListener("loginStateChanged", handleStorageChange);
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.setItem("USER", null);
        localStorage.setItem("LOGGEDIN", "false");
        setLoggedIn(false);
    };

    return (
        <>
            <Router>
                <Nav loggedIn={loggedIn} onLogout={handleLogout} />
                <Routes>
                    {/* Login and SignUp are always accessible */}
                    <Route path='/login' element={
                        loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                    } />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/signUp' element={<SignUp />} />

                    {/* Everything else requires login */}
                    <Route path='/' element={
                        loggedIn ? <Home /> : <Navigate to="/login" />
                    } />
                    <Route path='/admin' element={
                        loggedIn ? <Admin /> : <Navigate to="/login" />
                    } />
                    <Route path='/cart' element={
                        loggedIn ? <Cart /> : <Navigate to="/login" />
                    } />
                    <Route path='/account' element={
                        loggedIn ? <Account onLogout={handleLogout} /> : <Navigate to="/login" />
                    } />
                </Routes>
            </Router>
        </>
    )
}

export default App