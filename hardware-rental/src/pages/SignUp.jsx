// This file contains the code for the Sign page.

import './SignUp.css'

export function SignUp() {
    return (
        <div id="root-element">
            <div id="signup-nav">
            <nav>
                <div className='nav-left'>
                    <h2>Hardware Rental</h2>
                </div>
            </nav>
            </div>
            <div id="signup-box">
                <h1>Sign Up</h1>
                <div id="signup-input">
                    <p className="signup-label" id="username-label">Username:</p>
                    <div id="username-input"><input type="text"></input></div>
                    <p className="signup-label" id="password-label">Password:</p>
                    <div id="password-input"><input type="text"></input></div>
                    <p className="signup-label" id="confirm-password-label">Confirm Password:</p>
                    <div id="confirm-password-input"><input type="text"></input></div>
                    <div id="signup-button"><button>Create Account</button></div>
                </div>
            </div>
        </div>
    )
}