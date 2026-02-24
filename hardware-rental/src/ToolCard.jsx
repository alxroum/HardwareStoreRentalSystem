// reusable card func for displaying tools (as i assume we'll use alot)
function ToolCard({ id, image, category, name, condition, dailyRate, weeklyRate }) {
  return (
    <div id={id} className="card">
      <div className='top-half'>
        <img className="item-image" src={image}></img>
      </div>
      {/*  info, pricing, and action btns */}
      <div className='bottom-half'>
        <div className="category">{category}</div>
        <div className="name">{name}</div>
        <div className="condition">Condition: {condition}</div>
        <hr id="hr-01"></hr>
        {/*  pricing uses toFixed(2) */}
        <div className="pricing-info">
          <div className='left'>
            Daily rate:<br></br>
            Weekly rate:
          </div>
          <div className='right'>
            ${dailyRate.toFixed(2)}<br></br>
            ${weeklyRate.toFixed(2)}
          </div>
        </div>
        {/*  btns */}
        <button className="reserve-button">Reserve Now</button>
        <button className="cart-button">Add to Cart</button>
      </div>
    </div>
  )
}

/*
usage: 
make sure to import where-ever
import ToolCard from './ToolCard' like so

then

just call the func

<div id="content">
        <ToolCard
          id="card_001"
          image={circularSaw}
          category="POWER TOOLS"
          name="Circular Saw"
          condition="Excellent"
          dailyRate={25}
          weeklyRate={100}
        />
  </div>
*/

export default ToolCard