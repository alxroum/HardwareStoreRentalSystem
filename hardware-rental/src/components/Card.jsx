// This file contains the template code for each item card. Data is passed into the function and the card can be rendered on the page.
import React from "react";

export function Card(props) {
    const [card, setCard] = React.useState({
        category: props.category || "UNCATEGORIZED",
        name: props.name || "Unnamed",
        condition: props.condition || "Unspecified",
        daily_rate: props.daily_rate || 0,
        weekly_rate: props.weekly_rate || 0,
        image: props.image || "/"
    });

    return (
        <div id="card_001" className="card">
            <div className='top-half'>
                <img className="item-image" src={card.image}></img>
            </div>
            <div className='bottom-half'>
                <div className="category">{card.category}</div>
                <div className="name">{card.name}</div>
                <div className="condition">Condition: {card.condition}</div>
                <hr id="hr-01"></hr>
                <div className="pricing-info">
                    <div className='left'>
                        Daily rate:<br></br>
                        Weekly rate:
                    </div>
                    <div className='right'>
                        ${card.daily_rate.toFixed(2)}<br></br>
                        ${card.weekly_rate.toFixed(2)}
                    </div>
                </div>
                <button className="reserve-button">Reserve Now</button>
                <button className="cart-button">Add to Cart</button>
            </div>
        </div>
    )
}