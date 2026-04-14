import { useState } from 'react';
import './Checkout.css';

export function Checkout({ items, onClose, onConfirm }) {
  const [status, setStatus] = useState('idle');

  // get user data and bal from localStorage
  const userData = JSON.parse(localStorage.getItem("USER") || "{}");
  const accountBalance = parseFloat(userData.account_balance) || 0;

  const getRate = (item) => {
    const days = parseInt(item.duration);
    if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const extraDays = days % 7;
      return (item.weeklyRate * weeks) + (item.dailyRate * extraDays);
    }
    return item.dailyRate * days;
  };

  const subtotal = items.reduce((s, i) => s + getRate(i) * i.qty, 0);
  const deposit  = items.reduce((s, i) => s + i.deposit * i.qty, 0);
  const delivery = 15;
  const total    = subtotal + deposit + delivery;
  const balanceAfter = accountBalance - total;
  const canPay = accountBalance >= total;

  //  longest duration across all items for the order due date
  const maxDuration = Math.max(...items.map(i => parseInt(i.duration)));

  const handleConfirm = async () => {
    setStatus('processing');
    try {
      const response = await fetch("http://localhost:8080/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          items: items.map(i => ({ id: i.id, qty: i.qty })),
          totalCost: total,
          durationDays: maxDuration
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      setStatus('success');

      // pass new bal back to Cart so it can update localStoragee
      setTimeout(() => {
        if (onConfirm) onConfirm(data.newBalance);
      }, 1500);

    } catch (err) {
      console.error("Checkout error:", err);
      setStatus('error');
    }
  };

  const confirmLabel = () => {
    if (status === 'processing') return 'Processing…';
    if (status === 'success')    return '✓ Order placed!';
    if (status === 'error')      return 'Something went wrong — try again';
    if (!canPay)                 return 'Insufficient balance';
    return 'Confirm & place order';
  };

  return (
    <div className="co-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="co-modal" role="dialog" aria-modal="true" aria-label="Checkout">

        <div className="co-header">
          <span className="co-header-logo">Hardware Rental</span>
          <h2 className="co-header-title">Checkout</h2>
          <button className="co-close-btn" onClick={onClose} aria-label="Close checkout">✕</button>
        </div>

        <div className="co-body">

          <p className="co-section-label">Your items</p>
          <div className="co-items">
            {items.map(item => {
              const lineRental  = getRate(item) * item.qty;
              const lineDeposit = item.deposit * item.qty;
              return (
                <div className="co-item-row" key={item.id}>
                  <div className="co-item-left">
                    <div className="co-item-icon">{item.name.charAt(0)}</div>
                    <div>
                      <div className="co-item-name">{item.name}</div>
                      <div className="co-item-meta">
                        {item.duration === '7'  ? '1 week'
                         : item.duration === '30' ? '1 month'
                         : `${item.duration} day${parseInt(item.duration) > 1 ? 's' : ''}`}
                        {item.qty > 1 && ` · qty ${item.qty}`}
                      </div>
                    </div>
                  </div>
                  <div className="co-item-right">
                    <div className="co-item-price">${lineRental.toFixed(2)}</div>
                    <div className="co-item-deposit">+${lineDeposit.toFixed(2)} dep.</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`co-balance-panel ${!canPay ? 'insufficient' : ''}`}>
            <div className="co-balance-col">
              <div className="co-balance-label">Available balance</div>
              <div className="co-balance-amount">${accountBalance.toFixed(2)}</div>
            </div>
            <div className="co-balance-arrow">→</div>
            <div className="co-balance-col right">
              <div className="co-balance-label">After checkout</div>
              <div className={`co-balance-after ${balanceAfter < 0 ? 'negative' : ''}`}>
                {balanceAfter >= 0
                  ? `$${balanceAfter.toFixed(2)}`
                  : `-$${Math.abs(balanceAfter).toFixed(2)}`}
              </div>
            </div>
            {!canPay && (
              <div className="co-balance-warning">
                Balance is ${(total - accountBalance).toFixed(2)} short.{' '}
                <a href="#/account" className="co-balance-add-link" onClick={onClose}>Add funds →</a>
              </div>
            )}
          </div>

          <div className="co-summary">
            <div className="co-summary-row">
              <span>Rental subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="co-summary-row deposit">
              <span>Security deposit *</span>
              <span>${deposit.toFixed(2)}</span>
            </div>
            <div className="co-summary-row">
              <span>Delivery fee</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="co-summary-divider" />
            <div className="co-summary-row total">
              <span>Total due today</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="co-deposit-note">* Deposit is fully refunded upon return</p>
          </div>

          <button
            className={`co-confirm-btn ${status}`}
            onClick={handleConfirm}
            disabled={!canPay || status === 'processing' || status === 'success'}
          >
            {confirmLabel()}
          </button>

        </div>
      </div>
    </div>
  );
}