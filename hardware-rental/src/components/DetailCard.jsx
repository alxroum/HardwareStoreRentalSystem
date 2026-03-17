// This file contains the template code for the item details
import React from "react";

export function Card({
    category = "UNCATEGORIZED",
    equipment_name = "Unnamed",
    quality = "Unspecified",
    daily_rate = 0,
    weekly_rate = 0,
    image_icon = "power-auger.png"
}) {

    return (
        <div id="card_001" className="card">
            <div className='top-half'>
                <img className="item-image" src={`/assets/${image_icon}`} alt={image_icon}></img>
            </div>
            <div className='bottom-half'>
                <div className="category">{category}</div>
                <div className="name">{equipment_name}</div>
                <div className="condition">Condition: {quality}</div>
                <hr id="hr-01"></hr>
                <div className="pricing-info">
                    <div className='left'>
                        Daily rate:<br></br>
                        Weekly rate:
                    </div>
                    <div className='right'>
                        ${daily_rate.toFixed(2)}<br></br>
                        ${weekly_rate.toFixed(2)}
                    </div>
                </div>
                <button className="reserve-button">View Details</button>
                <button className="cart-button">Add to Cart</button>
            </div>
        </div>
    )
}