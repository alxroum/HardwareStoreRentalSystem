// This file contains the template code for each item card. Data is passed into the function and the card can be rendered on the page.

export function Card({category, name, condition, daily_rate, weekly_rate, image}) {
    
    return (
        <div id="card_001" className="card">
            <div className='top-half'>
                <img className="item-image" src={image}></img>
            </div>
            <div className='bottom-half'>
                <div className="category">{category}</div>
                <div className="name">{name}</div>
                <div className="condition">Condition: {condition}</div>
                <hr id="hr-01"></hr>
                <div className="pricing-info">
                    <div className='left'>
                        Daily rate:<br></br>
                        Weekly rate:
                    </div>
                    <div className='right'>
                        ${daily_rate}<br></br>
                        ${weekly_rate}
                    </div>
                </div>
                <button className="reserve-button">Reserve Now</button>
                <button className="cart-button">Add to Cart</button>
            </div>
        </div>
    )
}