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
import { useNavigate } from 'react-router-dom'

// styles
import '../styles/App.css'

// home page function -> displays the cards with the data grabbed from the database
export function Home() {

    const [category, setCategory] = useState("ALL");
    const navigateToCart = useNavigate();
        
    useEffect(() => {
            document.body.classList.add('home-page')
            return () => document.body.classList.remove('home-page')
        }, [])


    const tools = grabToolData(); // call the grab function that sits in App.jsx

    const [selectedTool, setSelectedTool] = useState(null); // holds the tool that has been selected for the detailed popup

    const addToCart = (tool) => {

        const signedIn = localStorage.getItem("LOGGEDIN") === "true";

        if(signedIn) {
            const cartItem = {
                id: tool.idinventory,
                name: tool.equipment_name,
                category: tool.category,
                dailyRate: Number(tool.daily_rate),
                deposit: Number(tool.daily_rate) * 2,
                qty: 1,
                duration: '1'
            };

            // Get existing cart from localStorage
            const cartJSON = localStorage.getItem("CART");
            let cart = [];
            if (cartJSON) {
                try {
                    cart = JSON.parse(cartJSON);
                } catch (err) {
                    console.error("Error parsing cart:", err);
                }
            }

            // Check if item already in cart
            const existingItem = cart.find(item => item.id === cartItem.id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push(cartItem);
            }

            // Save back to localStorage
            localStorage.setItem("CART", JSON.stringify(cart));
            alert(`${tool.equipment_name} added to cart!`);
            return true;
        } else {
            alert("Sign in first!");
            navigateToCart("/login"); // despite the name, this will take the user to the login page
            return false;
        }
    };

    // adds the item to the cart and takes the user to the cart page
    const reserveItem = (tool) => {
        const result = addToCart(tool);
        if (result) navigateToCart("/cart");
    }

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
                <Card
                    key={tool.idinventory}
                    onCardClick={() => setSelectedTool(tool)}
                    onCartButton={() => addToCart(tool)}
                    onReserveButton={() => reserveItem(tool)}
                    {...tool}
                />
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
                
                <div className="modal-body">
                    {/* Left Side: Visuals */}
                    <div className="modal-image-section">
                    <img 
                        src={`/assets/${selectedTool.image_icon}`} 
                        alt={selectedTool.equipment_name} 
                        className="modal-img"
                    />
                    <span className="category-badge">{selectedTool.category}</span>
                    </div>

                    {/* Right Side: Information */}
                    <div className="modal-info-section">
                    <h2>{selectedTool.equipment_name}</h2>
                    <p className="description">{selectedTool.equipment_description}</p>
                    
                    <div className="details-grid">
                        <div className="detail-item">
                        <span className="label">Condition</span>
                        <span className="value">{selectedTool.quality}</span>
                        </div>
                        <div className="detail-item">
                        <span className="label">Daily Rate</span>
                        <span className="value primary">${selectedTool.daily_rate.toFixed(2)}</span>
                        </div>
                        <div className="detail-item">
                        <span className="label">Weekly Rate</span>
                        <span className="value">${selectedTool.weekly_rate.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="reserve-button" onClick={reserveItem}>Reserve Now</button>
                    </div>
                </div>
                </div>
            </div>
        )}

        </>
    )
}