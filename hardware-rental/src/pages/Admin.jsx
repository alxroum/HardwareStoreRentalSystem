import { useState, useEffect } from 'react'

import './Admin.css'

// crud: create and read done. Need to do update and delete
// need to also update fields to consider image, quality, and equipment. (image we might be able to just do a default image, but
// we do have to handle that with upload or drag and drop.)
// also still didnt fix scroll yet, only just now realized thats still an issue

export function Admin() {

    const [activeTab, setActiveTab] = useState('inventory')
    // removed sample inventory data. We're going to be adding directly into the db now
    const [inventory, setInventory] = useState([])
    const [orders] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/inventory")
            .then(res => res.json())
            .then(data => {
            const mapped = data.map(item => ({
                id: item.idinventory,
                name: item.equipment_name,
                category: item.category,
                description: item.equipment_description,
                total: item.total_equipment,
                remaining: item.remaining_equipment,
                dailyRate: item.daily_rate,
                weeklyRate: item.weekly_rate,
                image: item.image_icon
            }))
            setInventory(mapped)
         })
            .catch(err => console.error("Fetch error:", err))
    }, [])

    // state for the add new item formm
    const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    description: '',
    total: 0,
    dailyRate: 0,
    weeklyRate: 0,
    quality: 'Okay',
    image: null
    })

    // tracks which item is being edited (so if its null = we're editing none)
    const [editingId, setEditingId] = useState(null)
    const [editItem, setEditItem] = useState({})

    // inv functions

    // add tool to inv. Biggest changes here.
    const handleAddItem = async () => {
        const formData = new FormData()

        formData.append("equipment_name", newItem.name)
        formData.append("equipment_description", newItem.description)
        formData.append("category", newItem.category)
        formData.append("total_equipment", newItem.total)
        formData.append("remaining_equipment", newItem.total)
        formData.append("daily_rate", newItem.dailyRate)
        formData.append("weekly_rate", newItem.weeklyRate)
        formData.append("quality", newItem.quality)

        if (newItem.image) {
            formData.append("image", newItem.image)
        }

        const res = await fetch("http://localhost:8080/inventory", {
        method: "POST",
        body: formData
    })

    const data = await res.json()

    // Ensure these keys match the database column names exactly
    const mapped = {
        id: data.idinventory, // check if backend uses 'idinventory'
        name: data.equipment_name,
        category: data.category,
        description: data.equipment_description,
        total: data.total_equipment,
        remaining: data.remaining_equipment,
        dailyRate: data.daily_rate,
        weeklyRate: data.weekly_rate,
        image: data.image_icon // This is the key field
    }

    setInventory(prev => [...prev, mapped])

        setNewItem({
            name: '',
            category: '',
            description: '',
            total: 0,
            dailyRate: 0,
            weeklyRate: 0,
            quality: 'Okay',
            image: null
        })
    }

    function handleImageUpload(e) {
        const file = e.target.files[0]
        if (!file) return

        setNewItem({
            ...newItem,
            image: file
        })
    }

    // removal with actual route
    async function handleRemoveItem(id) {
        try {
            await fetch(`http://localhost:8080/inventory/${id}`, {
                method: "DELETE"
            })

            setInventory(prev => prev.filter(item => item.id !== id))

            console.log("Deleted item:", id)
        } catch (err) {
            console.error("Delete failed:", err)
        }
    }

    // editing item (THIS IS NOT UPDATED YET)
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
                        {/* r1 name and category */}
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Item name"
                                value={newItem.name}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, name: e.target.value })
                                }
                            />

                            <select
                                value={newItem.category}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, category: e.target.value })
                                }
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

                        {/* r2 quality and img */}
                        <div className="form-row">
                            <select
                                value={newItem.quality}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, quality: e.target.value })
                                }
                            >
                                <option value="Okay">Okay</option>
                                <option value="Good">Good</option>
                                <option value="Excellent">Excellent</option>
                                <option value="New">New</option>
                            </select>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)}
                                />
                            </div>

                        {/* r3 description */}
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newItem.description}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, description: e.target.value })
                                }
                            />
                        </div>

                        {/* r4 quantity and rates */}
                        <div className="form-row">
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newItem.total || ''}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        total: parseInt(e.target.value) || 0
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Daily rate"
                                value={newItem.dailyRate || ''}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        dailyRate: parseFloat(e.target.value) || 0
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Weekly rate"
                                value={newItem.weeklyRate || ''}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        weeklyRate: parseFloat(e.target.value) || 0
                                    })
                                }
                            />
                        </div>
                        <button className="add-button" onClick={handleAddItem}>Add Item</button>
                    </div>

                    {/* inv */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
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
                                             <td>
                                                {item.image ? (
                                                    <img
                                                    src={`http://localhost:8080${item.image}`}
                                                    alt="item"
                                                    style={{ width: 150 }}
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                                </td>
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

            {/* order tab  */}
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