import { useEffect, useState } from 'react'

// pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { Cart } from './pages/Cart'
import { HashRouter as Router, Routes, Route, Link} from 'react-router-dom'

// // graphics
// import circularSaw from './assets/circular-saw.png'
// import powerWasher from './assets/power-washer.png'
// import paintSprayer from './assets/paint-sprayer.png'
// import chainsaw from './assets/chainsaw.png'
// import jackhammer from './assets/jackhammer.png'
// import powerAuger from './assets/power-auger.png'

import './styles/App.css'

// represents the data that will be stored in each card (acts as the database until we implement it)
import tool_data from './tool_data.json'

// this function should ideally be moved to a dedicated database file with the read and write functions
export function grabToolData() { // grabs the card and tool data from the database into the tools list

    const [inventory, setInventory] = useState([])

    useEffect(() => { // fetch the tool data from the database
    fetch("http://localhost:8080/inventory")
        .then(res => res.json())
        .then(data => {
            console.log("INVENTORY FROM BACKEND:", data)   // 👈 ADDED
            setInventory(data)
        })
        .catch(err => console.error("Error fetching inventory:", err))
    }, [])
    console.log(inventory);
    return inventory;
}

function Nav() {
  return (
    <nav>
        <div className='nav-left'>
        <h2>Hardware Rental</h2>
        </div>
        
        <div className='nav-right'>
        <div id="login-area">
            <div id="admin-button">
              <Link to="/admin" style={{marginRight: '10px', cursor: 'pointer'}}>
                  Admin
              </Link>
            </div>
            <div id="login-button">
              <Link to="/login" style={{marginRight: '10px', cursor: 'pointer'}}>
                  Login
              </Link>
            </div>
            <div id="cart-button">
              <Link to="/cart" style={{marginRight: '10px', cursor: 'pointer'}}>
                  Cart
              </Link>
            </div>
        </div>
        </div>
    </nav>
  )
}

function App() {
  
  return (
    <>
    <Router>
      <Nav/> {/* Display the navigation on all pages */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/cart' element={<Cart/>}/>
      </Routes>
    </Router>
    </>
  )
  
}
export default App