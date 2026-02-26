// This file contains the code for the login page.

import './Login.css'

export function Login() {
    return (
        <div id="root-element">
            <div id="login-nav">
            <nav>
                <div className='nav-left'>
                    <h2>Hardware Rental</h2>
                </div>
            </nav>
            </div>
            <div id="login-box">
                <h1>Login</h1>
                <div id="login-input">
                    <p className="login-label" id="username-label">Username:</p>
                    <div id="username-input"><input type="text"></input></div>
                    <p className="login-label" id="password-label">Password:</p>
                    <div id="password-input"><input type="text"></input></div>
                    <div id="login-button"><button>Login</button></div>
                </div>
            </div>
            <div id="register-account">
                <p>Don't have an account? <a href="#">Sign Up</a>!</p> 
            </div>
        </div>
    )
}