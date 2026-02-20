// This file contains the code that is responsible for the home page.

// graphics
import circularSaw from '../assets/circular-saw.png'
import powerWasher from '../assets/power-washer.png'
import paintSprayer from '../assets/paint-sprayer.png'
import chainsaw from '../assets/chainsaw.png'

// components
import { Card } from '../components/Card'

import '../App.css'

export function Home() {

    return (
        <>
        <div className='two-parts'>

            <div id='sidebar'>

            </div>
    
            <div id="item-grid">

                {/* Cards are defined in the following way */}
                <Card category={"POWER TOOLS"} name={"Circular Saw"} condition={"Excellent"} daily_rate={25.00} weekly_rate={100.00} image={circularSaw}/>
                <Card category={"CLEANING"} name={"Power Washer"} condition={"Good"} daily_rate={45.00} weekly_rate={180.00} image={powerWasher}/>
                <Card category={"PAINTING"} name={"Paint Sprayer"} condition={"Okay"} daily_rate={35.00} weekly_rate={140.00} image={paintSprayer}/>
                <Card category={"YARD AND GARDEN"} name={"Chainsaw"} condition={"Good"} daily_rate={30.00} weekly_rate={120.00} image={chainsaw}/>


            </div>
        </div>
        </>
    )
}