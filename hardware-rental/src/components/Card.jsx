import React from "react";
import { useId } from "react";

export function Card({
    idinventory,
    category = "UNCATEGORIZED",
    equipment_name = "Unnamed",
    equipment_description = "No description",
    quality = "Unspecified",
    daily_rate = 0,
    weekly_rate = 0,
    image_icon = "power-auger.png",
    onCardClick,
}) {

    const c_id = "card_" + useId();

    function handleAddToCart() {
        // get cart from localStorage
        const existing = JSON.parse(localStorage.getItem("CART") || "[]");

        // item chk
        const index = existing.findIndex(item => item.id === idinventory);

        if (index >= 0) {
            existing[index].qty += 1;
        } else {
            // add item via push
            existing.push({
                id: idinventory,
                name: equipment_name,
                category: category,
                dailyRate: Number(daily_rate),
                weeklyRate: Number(weekly_rate),
                deposit: Number(daily_rate) * 2,
                qty: 1,
                duration: '1',
            });
        }

        localStorage.setItem("CART", JSON.stringify(existing));
        alert(`${equipment_name} added to cart!`);
    }

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
                <button className="reserve-button" onClick={onCardClick}>View Details</button>
                <button className="cart-button" onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    )
}