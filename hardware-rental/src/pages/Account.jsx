import './Account.css'

function ProfilePicture(username) {
    return (
        <div id="profile-picture">
            AR
        </div>
    )
}

export function Account() {




    return (
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
                        <button className='account-menu-button'>My Account</button>
                        <button className='account-menu-button'>My Rentals</button>
                        <button className='account-menu-button'>Rental History</button>
                        <hr className='account-hr'></hr>
                        <button id="account-logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <div id="account-info">
                {/* <div id="balance-summary">
                    Account Balance
                </div>
                <div id="personal-info">
                    <div className='account-spacer'></div>
                    <div className="account-group">Username</div>
                    <div className="account-group">Email</div>
                    <div className="account-group">Password</div>
                    <div className="account-group">Phone</div>
                    <div className="account-group">Account Balance</div>
                </div>
                <div id="delete-section">
                    Delete Account
                </div> */}


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
            </div>
        </div>
    );
}