import { useState } from 'react';
import './Account.css'

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
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialData);
  const [draft, setDraft] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(false);

  const handleEdit = () => {
    setDraft(form);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(form);
    setEditing(false);
    setShowPassword(false);
  };

  const handleSave = () => {
    setForm(draft);
    setEditing(false);
    setShowPassword(false);
    onSave?.(draft);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const handleChange = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const val = (field) => (editing ? draft[field] : form[field]);

  return (
    <div id="pi-root">
      <div id="pi-card">

        <div id="pi-header">
          <div id="pi-title">Personal Information</div>
          <button id="pi-edit-btn" onClick={editing ? handleCancel : handleEdit}>
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div id="pi-body">
          <div id="pi-grid">

            <div id="pi-field-username">
              <label htmlFor="pi-username">Username</label>
              <input
                id="pi-username"
                type="text"
                value={val("username")}
                onChange={handleChange("username")}
                disabled={!editing}
              />
            </div>

            <div id="pi-field-email">
              <label htmlFor="pi-email">Email Address</label>
              <input
                id="pi-email"
                type="email"
                value={val("email")}
                onChange={handleChange("email")}
                disabled={!editing}
              />
            </div>

            <div id="pi-field-phone">
              <label htmlFor="pi-phone">Phone Number</label>
              <input
                id="pi-phone"
                type="tel"
                value={val("phone")}
                onChange={handleChange("phone")}
                disabled={!editing}
              />
            </div>

            <div id="pi-field-password">
              <label htmlFor="pi-password">Password</label>
              <div id="pi-pw-wrap">
                <input
                  id="pi-password"
                  type={showPassword ? "text" : "password"}
                  value={val("password")}
                  onChange={handleChange("password")}
                  disabled={!editing}
                />
                <button
                  id="pi-pw-toggle"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? ">" : "0"}
                </button>
              </div>
            </div>

            <div id="pi-field-address">
              <label htmlFor="pi-address">Street Address</label>
              <input
                id="pi-address"
                type="text"
                value={val("address")}
                onChange={handleChange("address")}
                disabled={!editing}
              />
            </div>

          </div>

          {editing && (
            <div id="pi-save-row">
              <button id="pi-btn-cancel" onClick={handleCancel}>Cancel</button>
              <button id="pi-btn-save" onClick={handleSave}>Save Changes</button>
            </div>
          )}
        </div>
      </div>

      <div id="pi-toast" className={toast ? "show" : ""}>
        Changes saved successfully
      </div>
    </div>
  );
}


export function Account() {

    // import global states from context provider in App.jsx
    const [loggedIn] = useState(localStorage.getItem("LOGGEDIN"));
    const [user] = useState(localStorage.getItem("USER"));

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
                                <div className="balance-main-amount">$124.50</div>
                            </div>
                            <div className="balance-actions">
                                <button className="btn-withdraw">Withdraw</button>
                                <button className="btn-add">+ Add Funds</button>
                            </div>
                        </div>
                        <div className="balance-stats">
                            <div className="stat">
                                <div className="stat-label">Total Spent</div>
                                <div className="stat-value">$842.00</div>
                            </div>
                            <div className="stat">
                                <div className="stat-label">Active Rentals</div>
                                <div className="stat-value green">3</div>
                            </div>
                        </div>
                    </div>

                    <PersonalInfo></PersonalInfo>

                </div>
            </div>
        )}
        </>
    );
}