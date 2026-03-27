/* This file contains the code for the Signup page. */

/* Imports: */
import './SignUp.css'
import { HashRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from './Login'

/* Primary Function: */
export function SignUp() {

    /* Declares Variables: */
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const returnToLogin = useNavigate();
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasEmptyInput = true;
    let emailEmpty = false;
    let phoneNumberEmpty = false;
    let passwordValidated = false;
    let emailValidated = false;
    let phoneNumberValidated = false;

    /* Gathers Account Information: */
    function createAccount() {
        /* Debug stuff: */
       /*
        console.log("Username: ", username);
        console.log("E-mail: ", email);
        console.log("Phone Number: ", phone);
        console.log("Address: ", address);
        console.log("Password: ", password);
        console.log("Confirm Password: ", confirmpassword);
        */

        /* Checks if any input boxes are empty: */
        checkEmptyInput();

        /* Confirm Password Check: */
        confirmPassword();

        /* Valid E-mail Check: */
        validateEmail();

        /* Valid Phone Number Check: */
        validatePhoneNumber();

        /* Checks empty field confirmation success: */
        if(hasEmptyInput == false) {
            /* Checks email confirmation success: */
            if(emailValidated == true) {
                /* Checks phone number confirmation success: */
                if(phoneNumberValidated == true) {
                    /* Checks password confirmation success: */
                    if(passwordValidated == true) {
                        console.log("Password verification value is true.");
            
                        /* Backend account creation should be performed here. */

                        /* Brings the user back to the login page: */
                        returnToLogin("/Login");
                    }
                    else {
                        console.log("Password verification value is false.");
                    }
                }
                else {
                    console.log("Phone Numeber verification value is false.");
                }
            }
            else {
                console.log("E-mail verification value is false.");
            }
        }
        else {
            console.log("Empty input value is true.");
        }
    }

    /* Checks for password accuracy: */
    function confirmPassword() {
        passwordValidated = false;
        if(password != confirmpassword) {
            console.log("Password Verification Failed.");
            alert("Passwords do not match.");
        }
        else {
            console.log("Password Verification Succeeded.");
            passwordValidated = true;
        }
    }

    /* Checks for valid e-mail address format: */
    function validateEmail() {
        emailValidated = false;
        if(emailEmpty == false) {
            if(emailRegex.test(email) == true) {
                console.log("Valid e-mail address.");
                emailValidated = true;
            }
            else {
                console.log("Invalid e-mail address.");
                alert("Invalid E-mail address. Must follow format: example@website.extension");
            }
        }
    }

    /* Checks for valid phone number: */
    function validatePhoneNumber() {
        phoneNumberValidated = false;
        if(phoneNumberEmpty == false) {
            if(phoneRegex.test(phone) == false) {
                console.log("Phone number is invalid.");
                alert("Invalid Phone Number. Must follow format: XXX-XXX-XXXX");
            }
            else {
                console.log("Phone number is valid.");
                phoneNumberValidated = true;
            }
        }
    }

    /* Checks if the user left any input boxes empty: */
    function checkEmptyInput() {
        hasEmptyInput = false;
        emailEmpty = false;
        phoneNumberEmpty = false;
        if(username === "") {
            console.log("Username input box is empty.");
            alert("Username field must be filled out.");
            hasEmptyInput = true;
        }
        if(email === "") {
            console.log("E-mail input box is empty.");
            alert("E-mail field must be filled out.");
            hasEmptyInput = true;
            emailEmpty = true;
        }
        if(phone === "") {
            console.log("Phone number input box is empty.");
            alert("Phone Number field must be filled out.");
            hasEmptyInput = true;
            phoneNumberEmpty = true;
        }
        if(address === "") {
            console.log("Address input box is empty.");
            alert("Address field must be filled out.");
            hasEmptyInput = true;
        }
        if(password === "") {
            console.log("Password input box is empty.");
            alert("Password field must be filled out.");
            hasEmptyInput = true;
        }
        if(confirmpassword === "") {
            console.log("Confirm Password input box is empty.");
            alert("Password must be confirmed.");
            hasEmptyInput = true;
        }
    }

    /* Displays Webpage: */
    return (
        <div id="root-element">
            <div id="signup-box">
                <h1 id="signup-h1">Sign Up</h1>
                <h5 id="signup-h5">*All fields are required*</h5>
                <div id="signup-input">
                    <p className="signup-label" id="username-label">Username:</p>
                    <div id="username-input"><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input></div>
                    <p className="signup-label" id="email-label">E-mail:</p>
                    <div id="email-input"><input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}></input></div>
                    <p className="signup-label" id="phone-label">Phone Number:</p>
                    <div id="phone-input"><input type="text" placeholder="Phone #" value={phone} onChange={(e) => setPhoneNumber(e.target.value)}></input></div>
                    <p className="signup-label" id="address-label">Address:</p>
                    <div id="address-input"><input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></input></div>
                    <p className="signup-label" id="password-label">Password:</p>
                    <div id="password-input"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input></div>
                    <p className="signup-label" id="confirm-password-label">Confirm Password:</p>
                    <div id="confirm-password-input"><input type="password" placeholder="Password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)}></input></div>
                    <div id="signup-button"><button onClick={() => createAccount()}>Create Account</button></div>
                </div>
            </div>
            <div id="disclaimer">
                <p id="disclaimer-text">By clicking Create Account, you agree to the terms of service.</p> 
            </div>
        </div>
    )
}