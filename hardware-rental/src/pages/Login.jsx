import './Login.css'
import { Link } from 'react-router-dom'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export async function validateLogin(username, password) {
    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();
        return data.user;

    } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message);
        return null;
    }
}

export function Login({ onLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const returnToHome = useNavigate();
    let hasEmptyInput = true;

    async function processLogin() {
        checkFields();

        if (hasEmptyInput == false) {
            const userData = await validateLogin(username, password);

            if (userData) {
                localStorage.setItem("LOGGEDIN", "true");
                localStorage.setItem("USER", JSON.stringify(userData));
                if (onLogin) onLogin();
                returnToHome("/");
            } else {
                localStorage.setItem("LOGGEDIN", "false");
            }
        }
    }

    function checkFields() {
        hasEmptyInput = false;
        if (username === "") {
            alert("Username field must be filled out.");
            hasEmptyInput = true;
        }
        if (password === "") {
            alert("Password field must be filled out.");
            hasEmptyInput = true;
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Orange accent bar at top of card */}
                <div className="login-card-accent"></div>

                <div className="login-card-body">
                    <h2 className="login-title">Sign In</h2>
                    <p className="login-subtitle">Welcome back to Hardware Rental</p>

                    <div className="login-field">
                        <label className="login-label">Username</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="login-btn" onClick={() => processLogin()}>
                        Sign In
                    </button>

                    <p className="login-footer">
                        Don't have an account?{' '}
                        <Link to="/SignUp" className="login-footer-link">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}