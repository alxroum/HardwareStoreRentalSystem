// This file contains the code that is responsible for the home page.

import { useState } from 'react'

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
    
    function categorize() {
        // only display cards that have the active category

        const filteredTools =
            category === "ALL"
                ? tools // show all tools if category is 'ALL'
                : tools.filter(tool => tool.category === category.toUpperCase()); // otherwise, filter by category

        return (
            filteredTools.map(tool => ( // map the data from a filtered list of tools into a card with each variable set
                <Card key={tool.id} {...tool} />
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
        </>
    )
}