// This file contains the template code for each item card. Data is passed into the function and the card can be rendered on the page.
import React from "react";
import { useId } from "react";

export function Card({
    category = "UNCATEGORIZED",
    equipment_name = "Unnamed",
    equipment_description = "No description",
    quality = "Unspecified",
    daily_rate = 0,
    weekly_rate = 0,
    image_icon = "power-auger.png",
    onCardClick,
    onReserveButton,
    onCartButton
}) {

    const c_id = "card_" + useId(); // assign a unique id to be used as the card's id html parameter

    return (
        <div id={c_id} className="card">
            <div className='top-half' onClick={onCardClick}>
                {/* had to swap image rendering to backend rendering */}
                <img 
                    className="item-image" 
                    src={image_icon?.startsWith('/uploads/') ? `http://localhost:8080${image_icon}` : `/assets/${image_icon}`} 
                    alt={equipment_name}
                />
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
                <button className="reserve-button" onClick={onReserveButton}>Reserve Now</button>
                <button className="cart-button" onClick={onCartButton}>Add to Cart</button>
            </div>
        </div>
    )
}