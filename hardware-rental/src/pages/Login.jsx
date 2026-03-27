/* This file contains the code for the login page. */

/* Imports: */
import './Login.css'
import { HashRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { SignUp } from './SignUp'
import { Home } from './Home'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

/* Primary Function: */
export function Login() {

    /* Declares Variables: */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const returnToHome = useNavigate();
    let hasEmptyInput = true;

    /* Gathers Login Information */
    function processLogin() {

        /* Checks for empty input fields: */
        checkFields();

        /* Validates field check: */
        if(hasEmptyInput == false) {
            /* Backend validation should be performed here. */

            /* Brings the user back to the home page. */
            returnToHome("/Home");
        }
        else {
            console.log("Empty input value is true.");
        }
    }

    /* Checks for empty input fields: */
    function checkFields() {
        hasEmptyInput = false;
        if(username === "") {
            console.log("Username field empty.");
            alert("Username field must be filled out.");
            hasEmptyInput = true;
        }
        if(password === "") {
            console.log("Password field empty.");
            alert("Password field must be fileld out.");
            hasEmptyInput = true;
        }
    }

    /* Displays Webpage: */
    return (
        <div id="root-element">
            <div id="login-box">
                <h1 id="login-h1">Login</h1>
                <div id="login-input">
                    <p className="login-label" id="username-label">Username:</p>
                    <div id="username-input"><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input></div>
                    <p className="login-label" id="password-label">Password:</p>
                    <div id="password-input"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input></div>
                    <div id="login-button"><button id="login-button-actual" onClick={() => processLogin()}>Login</button></div>
                </div>
            </div>
            <div id="register-account">
                <p id="sign-up-text">Don't have an account? <Link to="/SignUp" id="sign-up-link">Sign Up</Link>!</p> 
            </div>
        </div>
    )
}