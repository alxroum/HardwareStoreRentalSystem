import { useState } from 'react'
import './Admin.css'

// NOTE: THIS IS ALL TEMP TO REPRESENT BACKEND WHEN THE TIME COMES (FAKE DATA)
// GOAL: CRUD (kinda)

const sampleInventory = [
    { id: 1, name: "Circular Saw", category: "Power Tools", description: "24V cordless circular saw", total: 5, remaining: 3, dailyRate: 25.00, weeklyRate: 100.00 },
    { id: 2, name: "Power Washer", category: "Cleaning", description: "2000 PSI electric power washer", total: 3, remaining: 1, dailyRate: 30.00, weeklyRate: 110.00 },
    { id: 3, name: "Paint Sprayer", category: "Painting", description: "Airless paint sprayer", total: 4, remaining: 4, dailyRate: 35.00, weeklyRate: 140.00 },
    { id: 4, name: "Chainsaw", category: "Yard and Garden", description: "16 inch gas chainsaw", total: 6, remaining: 2, dailyRate: 30.00, weeklyRate: 120.00 },
]

const sampleOrders = [
    { id: 1, userId: 1, username: "john_doe", item: "Circular Saw", dateRented: "2025-02-20", dateDue: "2025-02-27", status: "Active", totalCost: 100.00 },
    { id: 2, userId: 2, username: "jane_smith", item: "Power Washer", dateRented: "2025-02-18", dateDue: "2025-02-25", status: "Overdue", totalCost: 110.00 },
    { id: 3, userId: 3, username: "bob_jones", item: "Chainsaw", dateRented: "2025-02-10", dateDue: "2025-02-17", status: "Returned", totalCost: 120.00 },
]

export function Admin() {

    const [activeTab, setActiveTab] = useState('inventory')
    const [inventory, setInventory] = useState(sampleInventory)
    const [orders] = useState(sampleOrders)

    // state for the add new item formm
    const [newItem, setNewItem] = useState({
        name: '',
        category: '',
        description: '',
        total: 0,
        dailyRate: 0,
        weeklyRate: 0
    })

    // tracks which item is being edited (so if its null = we're editing none)
    const [editingId, setEditingId] = useState(null)
    const [editItem, setEditItem] = useState({})

    // inv functions

    // add tool to inv
    function handleAddItem() {
        // very basic validation making sure isn't empty
        if (!newItem.name.trim()) 
        {
            alert('Please enter an item name')
            return
        }

        // this is what we'll change in the future, as the database in the future will handle IDs. 
        // so im just using fake ones.
        const item = {
            id: inventory.length + 1, ...newItem, remaining: newItem.total    
        }

        // add to the list and clear the form
        setInventory([...inventory, item])
        setNewItem({ name: '', category: '', description: '', total: 0, dailyRate: 0, weeklyRate: 0 })
        console.log('Added item:', item)
        // future: gotta send to backend. That way it updates.
    }

    // removal
    function handleRemoveItem(id) {
        setInventory(inventory.filter(item => item.id !== id))
        console.log('Removed item with id:', id)
        // future: also send to backend
    }

    // editing item
    function handleStartEdit(item) {
        setEditingId(item.id)
        setEditItem({ ...item })
    }

    // save edited item
    function handleSaveEdit() {
        setInventory(inventory.map(item =>
            item.id === editingId ? editItem : item
        ))
        setEditingId(null)
        console.log('Updated item:', editItem)
        // future: backend
    }

    // cancel editing, we should go here in the case to not update the backend on a cancel.
    function handleCancelEdit() {
        setEditingId(null)
        setEditItem({})
    }

    
    // rendering
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            {/* tab btns for Inventory and Orders */}
            <div className="admin-tabs">
                <button
                    className={activeTab === 'inventory' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('inventory')}
                >
                    Manage Inventory
                </button>
                <button
                    className={activeTab === 'orders' ? 'tab-active' : 'tab'}
                    onClick={() => setActiveTab('orders')}
                >
                    View Orders
                </button>
            </div>

            {/* inv tab */}
            {activeTab === 'inventory' && (
                <div className="admin-section">

                    {/* add new item form */}
                    <div className="add-item-form">
                        <h3>Add New Item</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Item name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            />
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                <option value="Power Tools">Power Tools</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Painting">Painting</option>
                                <option value="Yard and Garden">Yard and Garden</option>
                                <option value="Masonry">Masonry</option>
                                <option value="Access">Access</option>
                                <option value="Demolition">Demolition</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newItem.description}
                                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newItem.total || ''}
                                onChange={(e) => setNewItem({...newItem, total: parseInt(e.target.value) || 0})}
                            />
                            <input
                                type="number"
                                placeholder="Daily rate"
                                value={newItem.dailyRate || ''}
                                onChange={(e) => setNewItem({...newItem, dailyRate: parseFloat(e.target.value) || 0})}
                            />
                            <input
                                type="number"
                                placeholder="Weekly rate"
                                value={newItem.weeklyRate || ''}
                                onChange={(e) => setNewItem({...newItem, weeklyRate: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                        <button className="add-button" onClick={handleAddItem}>Add Item</button>
                    </div>

                    {/* inv */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Total</th>
                                <th>Available</th>
                                <th>Daily Rate</th>
                                <th>Weekly Rate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    {editingId === item.id ? (
                                        <>
                                            {/* edint fields */}
                                            <td><input value={editItem.name} onChange={(e) => setEditItem({...editItem, name: e.target.value})}/></td>
                                            <td><input value={editItem.category} onChange={(e) => setEditItem({...editItem, category: e.target.value})}/></td>
                                            <td><input type="number" value={editItem.total} onChange={(e) => setEditItem({...editItem, total: parseInt(e.target.value) || 0})}/></td>
                                            <td>{item.remaining}</td>
                                            <td><input type="number" value={editItem.dailyRate} onChange={(e) => setEditItem({...editItem, dailyRate: parseFloat(e.target.value) || 0})}/></td>
                                            <td><input type="number" value={editItem.weeklyRate} onChange={(e) => setEditItem({...editItem, weeklyRate: parseFloat(e.target.value) || 0})}/></td>
                                            <td>
                                                <button className="save-button" onClick={handleSaveEdit}>Save</button>
                                                <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {/* display mode */}
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.total}</td>
                                            <td>{item.remaining}</td>
                                            <td>${item.dailyRate.toFixed(2)}</td>
                                            <td>${item.weeklyRate.toFixed(2)}</td>
                                            <td>
                                                <button className="edit-button" onClick={() => handleStartEdit(item)}>Edit</button>
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

            {/* order trab  */}
            {activeTab === 'orders' && (
                <div className="admin-section">
                    <h3>Customer Orders</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Item</th>
                                <th>Date Rented</th>
                                <th>Date Due</th>
                                <th>Status</th>
                                <th>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.username}</td>
                                    <td>{order.item}</td>
                                    <td>{order.dateRented}</td>
                                    <td>{order.dateDue}</td>
                                    {/* color coding status */}
                                    <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
                                    <td>${order.totalCost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}