import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  var logged_in = false;

  return (
    <>
      <div id="nav">
        test nav
      </div>
      <div id="content">
        <div className='card'>
          test card
        </div>
      </div>
    </>
  )
}

export default App
