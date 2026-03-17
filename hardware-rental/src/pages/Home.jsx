// This file contains the code that is responsible for the home page.

// graphics
import { useEffect, useState } from 'react'
/*
import circularSaw from '../assets/circular-saw.png'
import powerWasher from '../assets/power-washer.png'
import paintSprayer from '../assets/paint-sprayer.png'
import chainsaw from '../assets/chainsaw.png'
*/
/*
const imageMap = {
    "Circular Saw": circularSaw,
    "Power Washer": powerWasher,
    "Paint Sprayer": paintSprayer,
    "Chainsaw": chainsaw
}
*/


// components
import { Card } from '../components/Card'

// functions
import { grabToolData } from '../App.jsx'

// styles
import '../styles/App.css'

// home page function -> displays the cards with the data grabbed from the database
export function Home() {

    const [category, setCategory] = useState("ALL");
    
    const tools = grabToolData(); // call the grab function that sits in App.jsx

    const [selectedTool, setSelectedTool] = useState(null); // holds the tool that has been selected for the detailed popup
    
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };
    
    function categorize() {
        // only display cards that have the active category

        const filteredTools =
            category === "ALL"
                ? tools // show all tools if category is 'ALL'
                : tools.filter(tool => tool.category === category.toUpperCase()); // otherwise, filter by category

        return (
            filteredTools.map(tool => ( // map the data from a filtered list of tools into a card with each variable set
                <Card key={tool.id} onCardClick={() => setSelectedTool(tool)} {...tool} />
            ))
        )
    }

    const categoryButtons  = ["ALL", ...new Set(tools.map(t => t.category))];

    return (
        <>
        <div className='two-parts'>

            <div id='sidebar'>
                <ul id='sidebar-list'>
                    
                        {categoryButtons.map(cat => (
                            <li key={cat}>
                                <div
                                    className={`category-selector ${category === cat ? "active" : ""}`} // conditional class
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat}
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
    
            <div id="item-grid">

                {categorize() /* call categorize function */}

            </div>
        </div>

        {selectedTool && (
            <div className="overlay" onClick={() => setSelectedTool(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <button className="close-btn" onClick={() => setSelectedTool(null)}>✕</button>
                    <img src={`/assets/${selectedTool.image_icon}`} alt={selectedTool.equipment_name} />
                    <h2>{selectedTool.equipment_name}</h2>
                    <p>{selectedTool.category}</p>
                    <p>Condition: {selectedTool.quality}</p>
                    <p>Daily: ${selectedTool.daily_rate.toFixed(2)}</p>
                    <p>Weekly: ${selectedTool.weekly_rate.toFixed(2)}</p>
                    <button className="reserve-button">Reserve Now</button>
                </div>
            </div>
        )}

        </>
    )
}