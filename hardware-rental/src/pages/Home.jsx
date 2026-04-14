import { useEffect, useState } from 'react'

import { Card } from '../components/Card'
import { grabToolData } from '../App.jsx'
import { useNavigate } from 'react-router-dom'

// styles
import '../styles/App.css'

export function Home() {

    const [category, setCategory] = useState("ALL");
    const navigateToCart = useNavigate();
        
    useEffect(() => {
        document.body.classList.add('home-page')
        return () => document.body.classList.remove('home-page')
    }, [])

    const tools = grabToolData();

    const [selectedTool, setSelectedTool] = useState(null);
    
    function categorize() {
        const filteredTools =
            category === "ALL"
                ? tools
                : tools.filter(tool => tool.category === category.toUpperCase());

        return (
            filteredTools.map(tool => (
                <Card 
                    key={tool.idinventory} 
                    idinventory={tool.idinventory}
                    onCardClick={() => setSelectedTool(tool)} 
                    {...tool} 
                />
            ))
        )
    }

    const categoryButtons = ["ALL", ...new Set(tools.map(t => t.category))];

    return (
        <>
        <div className='two-parts'>

            <div id='sidebar'>
                <ul id='sidebar-list'>
                    {categoryButtons.map(cat => (
                        <li key={cat}>
                            <div
                                className={`category-selector ${category === cat ? "active" : ""}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    
            <div id="item-grid">
                {categorize()}
            </div>
        </div>

        {selectedTool && (
            <div className="overlay" onClick={() => setSelectedTool(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedTool(null)}>✕</button>
                
                <div className="modal-body">
                    <div className="modal-image-section">
                    <img 
                        src={selectedTool.image_icon?.startsWith('/uploads/') 
                            ? `http://localhost:8080${selectedTool.image_icon}` 
                            : `/assets/${selectedTool.image_icon}`} 
                        alt={selectedTool.equipment_name} 
                        className="modal-img"
                    />
                    <span className="category-badge">{selectedTool.category}</span>
                    </div>

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