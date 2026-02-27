// This file contains the code that is responsible for the home page.

// graphics
import circularSaw from '../assets/circular-saw.png'
import powerWasher from '../assets/power-washer.png'
import paintSprayer from '../assets/paint-sprayer.png'
import chainsaw from '../assets/chainsaw.png'
import jackhammer from '../assets/jackhammer.png'
import powerAuger from '../assets/power-auger.png'

import { useState } from 'react'

// components
import { Card } from '../components/Card'

import '../styles/App.css'

const tools = [
    {
        id: 1,
        category: "POWER TOOLS",
        name: "Circular Saw",
        condition: "Excellent",
        daily_rate: 25.00,
        weekly_rate: 100.00,
        image: circularSaw
    },
    {
        id: 2,
        category: "CLEANING",
        name: "Power Washer",
        condition: "Good",
        daily_rate: 45.00,
        weekly_rate: 180.00,
        image: powerWasher
    },
    {
        id: 3,
        category: "PAINTING",
        name: "Paint Sprayer",
        condition: "Okay",
        daily_rate: 35.00,
        weekly_rate: 140.00,
        image: paintSprayer
    },
    {
        id: 4,
        category: "YARD & GARDEN",
        name: "Chainsaw",
        condition: "Good",
        daily_rate: 30.00,
        weekly_rate: 120.00,
        image: chainsaw
    },
    {
        id: 5,
        category: "DEMOLITION",
        name: "Jackhammer",
        condition: "Excellent",
        daily_rate: 40.00,
        weekly_rate: 135.00,
        image: jackhammer
    },
    {
        id: 6,
        category: "YARD & GARDEN",
        name: "Power Auger",
        condition: "Good",
        daily_rate: 50.00,
        weekly_rate: 140.00,
        image: powerAuger
    }
];

export function Home() {

    const [category, setCategory] = useState("YARD & GARDEN");
    
    function categorize() {
        // only display cards that have the active category

        const filteredTools =
        category === "ALL"
            ? tools // show all tools if category is 'ALL'
            : tools.filter(tool => tool.category === category.toUpperCase()); // otherwise, filter by category

        return (
            filteredTools.map(tool => (
                <Card key={tool.id} {...tool} />
            ))
        )
    }

    return (
        <>
        <div className='two-parts'>

            <div id='sidebar'>
                <table id='sidebar-table'>
                    <tbody>
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
                    </tbody>
                </table>
            </div>
    
            <div id="item-grid">

                {categorize() /* call categorize function */}

            </div>
        </div>
        </>
    )
}