import { useState } from 'react';
import './Account.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function PersonalInfo({ initialData = DEFAULT_DATA, onSave }) {
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
                            <div id="pi-username">{val("username")}</div>
                        </div>
                        <div id="pi-field-email">
                            <label htmlFor="pi-email">Email Address</label>
                            <div id="pi-email">{val("email")}</div>
                        </div>
                        <div id="pi-field-phone">
                            <label htmlFor="pi-phone">Phone Number</label>
                            <div id="pi-phone">{val("phone")}</div>
                        </div>
                        <div id="pi-field-address">
                            <label htmlFor="pi-address">Street Address</label>
                            <div id="pi-address">{val("address")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function Account({ onLogout }) {

    const dataString = localStorage.getItem("USER");
    const userData = JSON.parse(dataString);
    const [funds, setFunds] = useState('');
    const navigateHome = useNavigate();

    // usee the shared logout handler from App.jsx
    const logout = () => {
        if (onLogout) onLogout();
        navigateHome("/login");
    }

    const addFunds = async () => {
        if (!funds || isNaN(parseFloat(funds)) || parseFloat(funds) <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${userData.username}/funds`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "deposit",
                    amount: funds
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Success! New balance: $${data.newBalance}`);
                var temp = JSON.parse(dataString);
                temp.account_balance = "" + data.newBalance;
                console.log(temp);

                localStorage.setItem("USER", JSON.stringify(temp));
                setFunds("");
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Could not connect to the server.");
        }
    };

    // get initials from username for the avatar
    const getInitials = (name) => {
        if (!name) return "??";
        return name.substring(0, 2).toUpperCase();
    };

    console.log(userData);

    return (
        <div id="account-page">
            <div id="account-sidebar-section">
                <div id="account-sidebar">
                    <div id="sidebar-top">
                        <div className="avatar-circle">{getInitials(userData?.username)}</div>
                        <div className="sidebar-name">{userData?.username || "User"}</div>
                    </div>
                    <div id="sidebar-bottom">
                        <button id="account-logout-button" onClick={logout}>
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
                            <div className="balance-main-amount">{"$" + (userData?.account_balance || "0.00")}</div>
                        </div>
                        <div className="balance-actions">
                            <input
                                id='btn-input'
                                placeholder="Enter amount..."
                                value={funds}
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

                {userData && (
                    <PersonalInfo initialData={{
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone,
                        password: "",
                        address: userData.address
                    }}></PersonalInfo>
                )}

            </div>
        </div>
    );
}