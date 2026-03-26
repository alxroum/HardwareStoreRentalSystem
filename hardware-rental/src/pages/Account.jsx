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
                    <div id="sidebar-top">
                        <div className='account-center'>
                            <ProfilePicture/> {/* function call */}
                            <div id="account-username">Alex Rouman</div>
                        </div>
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
                <div id="balance-summary">
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
                </div>
            </div>
        </div>
    );
}