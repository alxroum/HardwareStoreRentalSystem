import './Account.css'

function ProfilePicture(username) {
    return (
        <div id="profile-picture">
            test
        </div>
    )
}

export function Account() {




    return (
        <div id="account-page">
            <div id="account-sidebar-section">
                <div id="account-sidebar">
                    <div id="sidebar-top">
                        <ProfilePicture/> {/* function call */}
                        <span id="account-username">John</span>
                    </div>
                    <div id="sidebar-mid">

                    </div>
                    <div id="sidebar-bottom">
                        <button id="account-logout-button"></button>
                    </div>
                </div>
            </div>
            <div id="account-info">
                <div id="balance-summary">

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