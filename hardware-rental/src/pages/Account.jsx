import { useState } from 'react';
import './Account.css'
import { useEffect } from 'react';
import { Login, validateLogin } from './Login';

function ProfilePicture(username) {
    return (
        <div id="profile-picture">
            AR
        </div>
    )
}

const DEFAULT_DATA = {
  username: "Username",
  email: "Email",
  phone: "Phone",
  password: "Password",
  address: "Address",
};

function logout() {
    localStorage.setItem("USER", null);
    localStorage.setItem("LOGGEDIN", false);
}

export default function PersonalInfo({ initialData = DEFAULT_DATA, onSave }) {
    //   const [editing, setEditing] = useState(false);
    const [saveData, setsaveData] = useState(initialData);

    const val = (field) => (saveData[field]);

    return (
        <div id="pi-root">
            <div id="pi-card">

            <div id="pi-header">
                <div id="pi-title">Personal Information</div>
            </div>

            <div id="pi-body">
                <div id="pi-grid">

                <div id="pi-field-username">
                    <label htmlFor="pi-username">Username</label>
                    <div id="pi-username">
                        {val("username")}
                    </div>
                </div>

                <div id="pi-field-email">
                    <label htmlFor="pi-email">Email Address</label>
                    <div id="pi-email">
                        {val("email")}
                    </div>
                </div>

                <div id="pi-field-phone">
                    <label htmlFor="pi-phone">Phone Number</label>
                    <div id="pi-phone">
                        {val("phone")}
                    </div>
                </div>

                <div id="pi-field-address">
                    <label htmlFor="pi-address">Street Address</label>
                    <div id="pi-address">
                        {val("address")}
                    </div>
                </div>

                </div>

                {/* {editing && (
                <div id="pi-save-row">
                    <button id="pi-btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button id="pi-btn-save" onClick={handleSave}>Save Changes</button>
                </div>
                )} */}
            </div>
            </div>

            {/* <div id="pi-toast" className={toast ? "show" : ""}>
            Changes saved successfully
            </div> */}
        </div>
    );
}


export function Account() {

    // import global states from context provider in App.jsx
    const [loggedIn] = useState(localStorage.getItem("LOGGEDIN"));
    const dataString = localStorage.getItem("USER");
    const userData = JSON.parse(dataString);
    const [funds, setFunds] = useState('');

    const addFunds = async () => {
        // 1. Frontend Validation
        if (!funds || isNaN(parseFloat(funds)) || parseFloat(funds) <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        try {
            // 2. The API Call
            const response = await fetch(`http://localhost:8080/users/${userData.username}/funds`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "deposit", // Telling the backend to add money
                    amount: funds      // The string from your state
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Success! New balance: $${data.newBalance}`);
                var temp = JSON.parse(dataString); // object
                temp.account_balance = "" + data.newBalance;
                console.log(temp);
                
                localStorage.setItem("USER", JSON.stringify(temp));
                // userData.account_balance = data.newBalance;
            // 3. CLEAR the input to reveal the placeholder
            setFunds(""); 
            } else {
            alert(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Could not connect to the server.");
        }
    };

    console.log(userData);

    return (
        <>
        {true && ( /* TODO needs to be changed to loggedIn instead of true */
            <div id="account-page">
                <div id="account-sidebar-section">
                    <div id="account-sidebar">
                        {/* <div id="sidebar-top">
                            <div className='account-center'>
                                <ProfilePicture/> 
                                <div id="account-username">Alex Rouman</div>
                            </div>
                        </div> */}
                        <div id="sidebar-top">
                            <div className="avatar-circle">AR</div>
                            <div className="sidebar-name">Alex Rouman</div>
                        </div>
                        <div id="sidebar-bottom">
                            <button id="account-logout-button">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div id="account-info">
                    
                    <div className="balance-card">
                        <div className="balance-top">
                            <div>
                                <div className="balance-main-label">Account Balance</div>
                                <div className="balance-main-amount">{"$" + userData.account_balance}</div>
                            </div>
                            <div className="balance-actions">
                                {/* <button className="btn-withdraw">Withdraw</button> */}
                                <input 
                                    id='btn-input'
                                    placeholder="Enter amount..." // This shows up when funds === ""
                                    value={funds}               // This links the UI to your state
                                    onChange={(e) => {
                                        if (e.target.value === "" || /^\d*\.?\d{0,2}$/.test(e.target.value)) {
                                        setFunds(e.target.value);
                                        }
                                    }} 
                                />
                                
                                <button className="btn-add" onClick={addFunds}>
                                + Add Funds
                                </button>
                            </div>
                        </div>
                        
                    </div>

                    {/* make sure that if the userdata is null, this doesn't error out */}
                    <PersonalInfo initialData={{
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone,
                        password: "",
                        address: userData.address
                    }}></PersonalInfo>

                </div>
            </div>
        )}
        </>
    );
}