import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import favicon from './assets/favicon.png'
import circularSaw from './assets/circular-saw.png'
import powerWasher from './assets/power-washer.png'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  var logged_in = false;

  // if(!logged_in) {
  //   return (
  //     <>

  //       <nav>
  //         <h2>Rental Shack</h2>
  //       </nav>

  //       Please Login
  //     </>
  //   )
  // }

  return (
    <>

      <nav>
        <div className='nav-left'>
          <h2>Hardware Rental</h2>
        </div>
        
        <div className='nav-right'>
          <div id="login-area">
            <div id="login-button">Login</div>
          </div>
        </div>
        
      </nav>

      <div id="content">


        
        <div id="card_001" className="card">
          <div className='top-half'>
            <img className="item-image" src={circularSaw}></img>
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

        <div id="card_001" className="card">
          <div className='top-half'>
            <img className="item-image" src={powerWasher}></img>
          </div>
          <div className='bottom-half'>
            <div className="category">POWER TOOLS</div>
            <div className="name">Power Washer</div>
            <div className="condition">Condition: Good</div>
            <hr id="hr-01"></hr>
            <div className="pricing-info">
              <div className='left'>
                Daily rate:<br></br>
                Weekly rate:
              </div>
              <div className='right'>
                $30.00<br></br>
                $110.00
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
