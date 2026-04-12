
import { useState, useEffect } from 'react';
import './Cart.css';
import { Checkout } from './Checkout';

const ACCOUNT_BALANCE = 124.50;

export function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/inventory')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch inventory');
        return res.json();
      })
      .then(data => {
        const withDefaults = data.map(item => ({
          ...item,
          qty: item.qty ?? 1,
          duration: item.duration ?? '1',
        }));
        setItems(withDefaults);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getRate = (item) => item.dailyRate * parseInt(item.duration);

  const subtotal = items.reduce((sum, i) => sum + getRate(i) * i.qty, 0);
  const deposit  = items.reduce((sum, i) => sum + i.deposit * i.qty, 0);
  const delivery = 15;
  const total    = subtotal + deposit + delivery;

  const updateQty = (id, delta) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const updateDuration = (id, duration) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, duration } : i));

  const removeItem = (id) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const handleOrderConfirmed = () => {
    setItems([]);
    setShowCheckout(false);
  };

  if (loading) return <div className="cart-page"><p style={{ textAlign: 'center' }}>Loading cart...</p></div>;
  if (error)   return <div className="cart-page"><p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p></div>;

  return (
    <div className="cart-page">
      <h2 className="cart-title">My Cart</h2>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a href="#">← Browse equipment</a>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>CATEGORY</th>
                  <th>DURATION</th>
                  <th>RATE</th>
                  <th>QTY</th>
                  <th>SUBTOTAL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      <select
                        className="cart-select"
                        value={item.duration}
                        onChange={e => updateDuration(item.id, e.target.value)}
                      >
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="4">4 Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="7">1 Week</option>
                        <option value="30">1 Month</option>
                      </select>
                    </td>
                    <td>${getRate(item).toFixed(2)}</td>
                    <td>
                      <div className="cart-qty">
                        <button onClick={() => updateQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </td>
                    <td>${(getRate(item) * item.qty).toFixed(2)}</td>
                    <td>
                      <button className="cart-btn-remove" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-summary-line">
              <span>Rental Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line deposit">
              <span>Security Deposit</span>
              <span>${deposit.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Delivery Fee</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <hr className="cart-summary-hr" />
            <div className="cart-summary-total">
              <span>Total Due Today</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="cart-deposit-note">* Deposit refunded upon return</p>
            <button className="cart-btn-checkout" onClick={() => setShowCheckout(true)}>
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}

      {showCheckout && (
        <Checkout
          items={items}
          accountBalance={ACCOUNT_BALANCE}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleOrderConfirmed}
        />
      )}
    </div>
  );
}
