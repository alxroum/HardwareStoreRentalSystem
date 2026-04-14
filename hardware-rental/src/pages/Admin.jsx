import { useState, useEffect } from 'react'
import './Admin.css'

const CATEGORIES = [
    "Power Tools", "Cleaning", "Painting",
    "Yard and Garden", "Masonry", "Access", "Demolition"
]

const QUALITY_MAP = {
    "New":       "",
    "Excellent": "",
    "Good":      "",
    "Okay":      ""
}

function validateItem(item) {
    const errors = []
    if (!item.name || item.name.trim() === '')
        errors.push("Item name is required.")
    if (!item.category || item.category === '')
        errors.push("Category is required.")
    if (!Number.isInteger(Number(item.total)) || Number(item.total) <= 0)
        errors.push("Quantity must be a positive whole number.")
    if (isNaN(item.dailyRate) || Number(item.dailyRate) <= 0)
        errors.push("Daily rate must be a positive number.")
    if (isNaN(item.weeklyRate) || Number(item.weeklyRate) <= 0)
        errors.push("Weekly rate must be a positive number.")
    if (Number(item.weeklyRate) < Number(item.dailyRate))
        errors.push("Weekly rate should be greater than or equal to daily rate.")
    return errors
}

function AvailCell({ remaining, total }) {
    const ratio = total > 0 ? remaining / total : 0
    const cls = remaining === 0 ? 'avail-none' : ratio <= 0.25 ? 'avail-low' : 'avail-ok'
    return <span className={cls}>{remaining} / {total}</span>
}

export function Admin() {
    const [activeTab, setActiveTab]   = useState('inventory')
    const [inventory, setInventory]   = useState([])
    const [orders, setOrders]         = useState([])
    const [showModal, setShowModal]   = useState(false)
    const [formErrors, setFormErrors] = useState([])

    const [newItem, setNewItem] = useState({
        name: '', category: '', description: '',
        total: '', dailyRate: '', weeklyRate: '',
        quality: 'Good', image: null
    })

    const [editingId, setEditingId] = useState(null)
    const [editItem, setEditItem]   = useState({})

    useEffect(() => {
        fetch("http://localhost:8080/inventory")
            .then(res => res.json())
            .then(data => setInventory(data.map(item => ({
                id:          item.idinventory,
                name:        item.equipment_name,
                category:    item.category,
                description: item.equipment_description,
                total:       item.total_equipment,
                remaining:   item.remaining_equipment,
                dailyRate:   item.daily_rate,
                weeklyRate:  item.weekly_rate,
                quality:     item.quality,
                image:       item.image_icon
            }))))
            .catch(err => console.error("Fetch error:", err))

        // Fetch orders
        fetch("http://localhost:8080/orders")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
            })
            .catch(err => console.error("Orders fetch error:", err))
    }, [])

    // derived stats
    const totalItems       = inventory.reduce((s, i) => s + (i.total || 0), 0)
    const totalAvailable   = inventory.reduce((s, i) => s + (i.remaining || 0), 0)
    const uniqueCategories = new Set(inventory.map(i => i.category)).size
    const avgDaily = inventory.length
        ? (inventory.reduce((s, i) => s + Number(i.dailyRate || 0), 0) / inventory.length).toFixed(2)
        : "0.00"

    const handleAddItem = async () => {
        const errors = validateItem(newItem)
        if (errors.length > 0) { setFormErrors(errors); return }
        setFormErrors([])

        const formData = new FormData()
        formData.append("equipment_name",        newItem.name)
        formData.append("equipment_description", newItem.description)
        formData.append("category",              newItem.category)
        formData.append("total_equipment",       newItem.total)
        formData.append("remaining_equipment",   newItem.total)
        formData.append("daily_rate",            newItem.dailyRate)
        formData.append("weekly_rate",           newItem.weeklyRate)
        formData.append("quality",               newItem.quality)
        if (newItem.image) formData.append("image", newItem.image)

        const res  = await fetch("http://localhost:8080/inventory", { method: "POST", body: formData })
        const data = await res.json()

        setInventory(prev => [...prev, {
            id:          data.idinventory,
            name:        data.equipment_name,
            category:    data.category,
            description: data.equipment_description,
            total:       data.total_equipment,
            remaining:   data.remaining_equipment,
            dailyRate:   data.daily_rate,
            weeklyRate:  data.weekly_rate,
            quality:     data.quality,
            image:       data.image_icon
        }])

        setNewItem({ name:'', category:'', description:'', total:'', dailyRate:'', weeklyRate:'', quality:'Good', image:null })
        setShowModal(false)
    }

    async function handleRemoveItem(id) {
        await fetch(`http://localhost:8080/inventory/${id}`, { method: "DELETE" })
        setInventory(prev => prev.filter(item => item.id !== id))
    }

    function handleStartEdit(item) {
        setEditingId(item.id)
        setEditItem({ ...item })
        setFormErrors([])
    }

    async function handleSaveEdit() {
        const errors = validateItem(editItem)
        if (errors.length > 0) { setFormErrors(errors); return }
        setFormErrors([])

        const res = await fetch(`http://localhost:8080/inventory/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                equipment_name:        editItem.name,
                equipment_description: editItem.description,
                category:              editItem.category,
                total_equipment:       editItem.total,
                daily_rate:            editItem.dailyRate,
                weekly_rate:           editItem.weeklyRate,
                quality:               editItem.quality ?? "Good"
            })
        })
        const data = await res.json()
        setInventory(prev => prev.map(item => item.id === editingId ? {
            id:          data.idinventory,
            name:        data.equipment_name,
            category:    data.category,
            description: data.equipment_description,
            total:       data.total_equipment,
            remaining:   data.remaining_equipment,
            dailyRate:   data.daily_rate,
            weeklyRate:  data.weekly_rate,
            quality:     data.quality,
            image:       data.image_icon
        } : item))
        setEditingId(null)
        setEditItem({})
    }

    function handleCancelEdit() {
        setEditingId(null)
        setEditItem({})
        setFormErrors([])
    }

    async function handleRefund(order) {
        const maxRefund = Number(order.total_cost || 0);
        const input = prompt(`Enter refund amount for order #${order.idorders} (max $${maxRefund.toFixed(2)}):`);
        if (input === null) return; // cancelled

        const amount = parseFloat(input);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }
        if (amount > maxRefund) {
            alert(`Refund cannot exceed the order total of $${maxRefund.toFixed(2)}.`);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/orders/${order.idorders}/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Refund failed");

            alert(`Refunded $${amount.toFixed(2)} to ${order.username}.`);
        } catch (err) {
            console.error("Refund error:", err);
            alert("Refund failed: " + err.message);
        }
    }

    async function handleDeleteOrder(orderId) {
        if (!confirm(`Delete order #${orderId}? This will remove the order and restore inventory. No refund will be issued.`)) return;

        try {
            const res = await fetch(`http://localhost:8080/orders/${orderId}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");

            setOrders(prev => prev.filter(o => o.idorders !== orderId));
            alert("Order deleted.");
        } catch (err) {
            console.error("Delete order error:", err);
            alert("Failed to delete order: " + err.message);
        }
    }

    function handleImageUpload(e) {
        const file = e.target.files[0]
        if (file) setNewItem({ ...newItem, image: file })
    }

    function openModal() {
        setFormErrors([])
        setShowModal(true)
    }

    return (
        <div className="admin-page">

            <div className="admin-header">
                <div className="admin-header-icon"></div>
                <h1><span>Admin</span> Dashboard</h1>
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-label">Total Items</div>
                    <div className="stat-value">{totalItems}</div>
                    <div className="stat-sub">{inventory.length} product types</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Available Now</div>
                    <div className="stat-value">{totalAvailable}</div>
                    <div className="stat-sub">units in stock</div>
                </div>
                <div className="stat-card accent">
                    <div className="stat-label">Avg Daily Rate</div>
                    <div className="stat-value">${avgDaily}</div>
                    <div className="stat-sub">across all items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Categories</div>
                    <div className="stat-value">{uniqueCategories}</div>
                    <div className="stat-sub">active categories</div>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'inventory' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('inventory')}>
                    Inventory
                </button>
                <button className={activeTab === 'orders' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('orders')}>
                    View Orders
                </button>
            </div>

            {activeTab === 'inventory' && (
                <div className="admin-section">
                    <div className="section-toolbar">
                        <h3>
                            All Equipment
                            <span className="item-count-badge">{inventory.length}</span>
                        </h3>
                        <button className="add-button" onClick={openModal}>+ Add New Item</button>
                    </div>

                    {editingId && formErrors.length > 0 && (
                        <div className="form-errors" style={{ marginBottom: 14 }}>
                            {formErrors.map((e, i) => <p key={i}>! {e}</p>)}
                        </div>
                    )}

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Condition</th>
                                <th>Available</th>
                                <th>Daily</th>
                                <th>Weekly</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length === 0 && (
                                <tr><td colSpan={7}>
                                    <div className="empty-state">
                                        <span></span>No items yet. Add one above.
                                    </div>
                                </td></tr>
                            )}
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    {editingId === item.id ? (
                                        <>
                                            <td>
                                                <div className="item-name-cell">
                                                    {item.image
                                                        ? <img className="item-thumb" src={`http://localhost:8080${item.image}`} alt="item" /> : <div></div>
                                                    }
                                                    <input value={editItem.name ?? ''} onChange={e => setEditItem({...editItem, name: e.target.value})} placeholder="Name" />
                                                </div>
                                            </td>
                                            <td>
                                                <select value={editItem.category ?? ''} onChange={e => setEditItem({...editItem, category: e.target.value})}>
                                                    <option value="">Select…</option>
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={editItem.quality ?? 'Good'} onChange={e => setEditItem({...editItem, quality: e.target.value})}>
                                                    {Object.keys(QUALITY_MAP).map(q => <option key={q} value={q}>{q}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <input type="number" min="1" value={editItem.total ?? ''} onChange={e => setEditItem({...editItem, total: parseInt(e.target.value) || 0})} />
                                            </td>
                                            <td><input type="number" min="0" value={editItem.dailyRate ?? ''} onChange={e => setEditItem({...editItem, dailyRate: parseFloat(e.target.value) || 0})} /></td>
                                            <td><input type="number" min="0" value={editItem.weeklyRate ?? ''} onChange={e => setEditItem({...editItem, weeklyRate: parseFloat(e.target.value) || 0})} /></td>
                                            <td>
                                                <button className="save-button"   onClick={handleSaveEdit}>Save</button>
                                                <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <div className="item-name-cell">
                                                    {item.image
                                                        ? <img className="item-thumb" src={`http://localhost:8080${item.image}`} alt="item" />: <div></div>
                                                    }
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td><span className="category-pill">{item.category}</span></td>
                                            <td><span className="quality-badge">{QUALITY_MAP[item.quality] ?? ''} {item.quality}</span></td>
                                            <td><AvailCell remaining={item.remaining} total={item.total} /></td>
                                            <td className="rate-cell">${Number(item.dailyRate).toFixed(2)}</td>
                                            <td className="rate-cell">${Number(item.weeklyRate).toFixed(2)}</td>
                                            <td>
                                                <button className="edit-button"   onClick={() => handleStartEdit(item)}>Edit</button>
                                                <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* order tab */}
            {activeTab === 'orders' && (
                <div className="admin-section">
                    <div className="section-toolbar">
                        <h3>Customer Orders <span className="item-count-badge">{orders.length}</span></h3>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Date Rented</th>
                                <th>Date Due</th>
                                <th>Status</th>
                                <th>Total Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr><td colSpan={8}>
                                    <div className="empty-state">No orders yet.</div>
                                </td></tr>
                            )}
                            {orders.map(order => (
                                <tr key={order.idorders}>
                                    <td>{order.idorders}</td>
                                    <td>{order.username}</td>
                                    <td>{order.items || 'N/A'}</td>
                                    <td>{order.dateRented ? new Date(order.dateRented).toLocaleDateString() : '—'}</td>
                                    <td>{order.dateDue ? new Date(order.dateDue).toLocaleDateString() : '—'}</td>
                                    <td><span className={`status-${(order.status || 'active').toLowerCase()}`}>{order.status || 'Active'}</span></td>
                                    <td className="rate-cell">${Number(order.total_cost || 0).toFixed(2)}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleRefund(order)}>
                                            Refund
                                        </button>
                                        <button className="remove-button" onClick={() => handleDeleteOrder(order.idorders)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* add new item modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
                    <div className="modal-box">
                        <h3>Add New Rental Item</h3>

                        {formErrors.length > 0 && (
                            <div className="form-errors">
                                {formErrors.map((e, i) => <p key={i}>! {e}</p>)}
                            </div>
                        )}

                        <div className="modal-field">
                            <label>Item Name</label>
                            <input placeholder="e.g. Tile Saw" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                        </div>

                        <div className="modal-field">
                            <label>Category</label>
                            <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                <option value="">Select category…</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label>Condition</label>
                                <select value={newItem.quality} onChange={e => setNewItem({...newItem, quality: e.target.value})}>
                                    {Object.keys(QUALITY_MAP).map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>
                            <div className="modal-field">
                                <label>Quantity</label>
                                <input type="number" min="1" placeholder="e.g. 5" value={newItem.total} onChange={e => setNewItem({...newItem, total: parseInt(e.target.value) || ''})} />
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label>Daily Rate ($)</label>
                                <input type="number" min="0" step="0.01" placeholder="e.g. 25" value={newItem.dailyRate} onChange={e => setNewItem({...newItem, dailyRate: parseFloat(e.target.value) || ''})} />
                            </div>
                            <div className="modal-field">
                                <label>Weekly Rate ($)</label>
                                <input type="number" min="0" step="0.01" placeholder="e.g. 100" value={newItem.weeklyRate} onChange={e => setNewItem({...newItem, weeklyRate: parseFloat(e.target.value) || ''})} />
                            </div>
                        </div>

                        <div className="modal-field">
                            <label>Description (optional)</label>
                            <input placeholder="Brief description…" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                        </div>

                        <div className="modal-field">
                            <label>Image (optional)</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => { setShowModal(false); setFormErrors([]) }}>Cancel</button>
                            <button className="modal-submit" onClick={handleAddItem}>Add Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}