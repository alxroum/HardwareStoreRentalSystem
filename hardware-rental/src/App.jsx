import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import favicon from './assets/favicon.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  var logged_in = false;

  return (
    <>
      <div id="content">
        <div id="card_001" className="card">

          <div className='top-half'>
            <img className="item-image" src={favicon}></img>
          </div>
          <div className='bottom-half'>
            <div className="category">POWER TOOLS</div>
            <div className="name">Circular Saw</div>
            <div className="condition">Condition: Excellent</div>
            <hr id="hr-01"></hr>
            <div className="pricing-info">
              <div className='left'>
                Daily rate:<br></br>
                Weekly rate:
              </div>
              <div className='right'>
                $25.00<br></br>
                $100.00
              </div>
            </div>
            <button className="reserve-button">Reserve Now</button>
            <button className="cart-button">Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
