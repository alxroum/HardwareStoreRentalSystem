// This file contains the code that is responsible for the home page.

// graphics
import circularSaw from '../assets/circular-saw.png'
import powerWasher from '../assets/power-washer.png'
import paintSprayer from '../assets/paint-sprayer.png'
import chainsaw from '../assets/chainsaw.png'

// components
import { Card } from '../components/Card'

import '../App.css'


function categorize(category) {
    switch(category) {
        case "powertools":
            break;
        case "cleaning":
            break;
        case "access":
            break;
        case "masonry":
            break;
        case "yard-garden":
            break;
        case "painting":
            break;
        case "demolition":
            break;
        default:
            break;

    }
}


export function Home() {

    return (
        <>
        <div className='two-parts'>

            <div id='sidebar'>
                <table id='sidebar-table'>
                    
                    <tr>
                        <td><div className='category-selector'>All Categories</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Powertools</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Cleaning</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Access</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Masonry</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Yard & Garden</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Painting</div></td>
                    </tr>
                    <tr>
                        <td><div className='category-selector'>Demolition</div></td>
                    </tr>
                </table>
            </div>
    
            <div id="item-grid">

                {/* Cards are defined in the following way */}
                <Card category={"POWER TOOLS"} name={"Circular Saw"} condition={"Excellent"} daily_rate={25.00} weekly_rate={100.00} image={circularSaw}/>
                <Card category={"CLEANING"} name={"Power Washer"} condition={"Good"} daily_rate={45.00} weekly_rate={180.00} image={powerWasher}/>
                <Card category={"PAINTING"} name={"Paint Sprayer"} condition={"Okay"} daily_rate={35.00} weekly_rate={140.00} image={paintSprayer}/>
                <Card category={"YARD AND GARDEN"} name={"Chainsaw"} condition={"Good"} daily_rate={30.00} weekly_rate={120.00} image={chainsaw}/>
                <Card category={"YARD AND GARDEN"} name={"Chainsaw"} condition={"Good"} daily_rate={30.00} weekly_rate={120.00} image={chainsaw}/>
                <Card category={"YARD AND GARDEN"} name={"Chainsaw"} condition={"Good"} daily_rate={30.00} weekly_rate={120.00} image={chainsaw}/>


            </div>
        </div>
        </>
    )
}