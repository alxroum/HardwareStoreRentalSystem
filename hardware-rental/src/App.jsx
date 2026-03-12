import { useEffect, useState } from 'react'

// pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
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
    // !! This function assumes that the incoming tool_data is in json format
    //const tools = []; // create list
    //tool_data.forEach(data => { // move data into tools
    //  tools.push(data);
    //});
    //console.log(tools);
    //return tools;

    const [inventory, setInventory] = useState([])
    useEffect(() => {
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
            <Link to="/admin" id="admin-button" style={{marginRight: '10px', cursor: 'pointer'}}>
                Admin
            </Link>
            <Link to="/login" id="login-button" style={{marginRight: '10px', cursor: 'pointer'}}>
                Login
            </Link>
        </div>
        </div>
    </nav>
  )
}

function App() {
  
  return (
    <>
    <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </Router>
    </>
  )
  
}
export default App