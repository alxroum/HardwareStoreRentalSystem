import express from 'express'
import multer from "multer"
import cors from 'cors';
import { getInventory } from './database.js'
import { addInventoryItem } from "./database.js"
import { deleteInventoryItem } from "./database.js"
import { updateInventoryItem } from "./database.js"
import { getUsernames } from './database.js'
import { addUser } from './database.js';
import { getUsers } from './database.js';
import { getUserByUsername } from './database.js';
import { updateUserBalance } from './database.js';
import { createOrder, addOrderInventory, decreaseRemainingEquipment, getAllOrders, getOrderById, getOrderItems, deleteOrderInventory, deleteOrder, increaseRemainingEquipment } from './database.js';
import bcrypt from 'bcrypt';

const app = express()

app.use(cors())
app.use(express.json())


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  }
})

app.get("/inventory", async (req, res) => {
    const inventory = await getInventory()
    res.send(inventory)
})

const upload = multer({ storage })

// post req for inv
app.post("/inventory", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null

    const {
      equipment_name,
      equipment_description,
      category,
      total_equipment,
      daily_rate,
      weekly_rate,
      quality
    } = req.body

    const newItem = await addInventoryItem({
      equipment_name,
      equipment_description: equipment_description ?? "",
      category,
      total_equipment: Number(total_equipment),
      remaining_equipment: Number(total_equipment),
      daily_rate: Number(daily_rate),
      weekly_rate: Number(weekly_rate),
      image_icon: imagePath,
      quality: quality ?? "Okay"
    })

    res.status(201).json(newItem)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use("/uploads", express.static("uploads"))

// update route
app.put("/inventory/:id", async (req, res) => {
    const id = req.params.id
    try {
        const updated = await updateInventoryItem(id, {
            equipment_name: req.body.equipment_name,
            equipment_description: req.body.equipment_description ?? "",
            category: req.body.category,
            total_equipment: Number(req.body.total_equipment),
            daily_rate: Number(req.body.daily_rate),
            weekly_rate: Number(req.body.weekly_rate),
            quality: req.body.quality ?? "Okay"
        })
        res.json(updated)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Update failed" })
    }
})

// delete route
app.delete("/inventory/:id", async (req, res) => {
    const id = req.params.id

    try {
        await deleteInventoryItem(id)
        res.json({ message: "Item deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Delete failed" })
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})

// get list of usernames
app.get("/usernames", async (req, res) => {
    try {
        const ids = await getUsernames();
        res.json(ids);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to grab usernames" })
    }
});

// get all user data
app.get("/users", async (req, res) => {
    try {
        const allUsers = await getUsers();
        
        const safeUsers = allUsers.map(user => {
            const { password, ...safeData } = user;
            return safeData;
        });

        res.json(safeUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch all users" });
    }
})

// login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username); 

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const { password: userPassword, ...safeUserData } = user;
        
        res.status(200).json({ 
            message: "Login successful!", 
            user: safeUserData 
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "An error occurred during login" });
    }
});

// post a new user
app.post("/users", async (req, res) => {
    try {
        const { username, email, phone, address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await addUser({ 
            username, 
            email, 
            phone, 
            address, 
            password: hashedPassword,
            account_balance: 0 
        });

        res.status(201).json(result);

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Get current balance for a user
app.get("/users/:username/balance", async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ balance: user.account_balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch balance" });
    }
});

// add/withdraw funds
app.post("/users/:username/funds", async (req, res) => {
    try {
        const { action, amount } = req.body; 
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: "Amount must be a number > 0" });
        }

        const user = await getUserByUsername(req.params.username);
        if (!user) return res.status(404).json({ error: "User not found" });

        let currentBalance = parseFloat(user.account_balance) || 0;

        if (action === "deposit") {
            currentBalance += parsedAmount;
        } else if (action === "withdraw") {
            if (currentBalance < parsedAmount) {
                return res.status(400).json({ error: "Insufficient funds." });
            }
            currentBalance -= parsedAmount;
        } else {
            return res.status(400).json({ error: "Invalid action." });
        }

        const finalBalance = parseFloat(currentBalance.toFixed(2));

        await updateUserBalance(req.params.username, finalBalance);
        res.status(200).json({ message: "Success", newBalance: finalBalance });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Transaction failed" });
    }
});

// checkout: create order, link items, deduct balance, update inventory 
app.post("/checkout", async (req, res) => {
    try {
        const { username, items, totalCost, durationDays } = req.body;

        // gets user
        const user = await getUserByUsername(username);
        if (!user) return res.status(404).json({ error: "User not found" });

        // checkk the balance
        const currentBalance = parseFloat(user.account_balance) || 0;
        if (currentBalance < totalCost) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        // create the order
        const now = new Date();
        const due = new Date(now);
        due.setDate(due.getDate() + (durationDays || 1));

        const orderId = await createOrder({
            idusers: user.idusers,
            dateRented: now,
            dateDue: due,
            totalCost: totalCost
        });

        // should link each item to the order and decrease remaining stock, important.
        for (const item of items) {
            await addOrderInventory(orderId, item.id);
            await decreaseRemainingEquipment(item.id, item.qty);
        }

        // bal deduction
        const newBalance = parseFloat((currentBalance - totalCost).toFixed(2));
        await updateUserBalance(username, newBalance);

        res.status(201).json({
            message: "Order placed successfully",
            orderId: orderId,
            newBalance: newBalance
        });

    } catch (err) {
        console.error("Checkout error:", err);
        res.status(500).json({ error: "Checkout failed" });
    }
});

// Get all orders for admin dashboard
app.get("/orders", async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// refund an order (partial or full). This also wont delete the order incase we still want that active
app.post("/orders/:id/refund", async (req, res) => {
    try {
        const orderId = req.params.id;
        const { amount } = req.body;
        const refundAmount = parseFloat(amount);

        if (isNaN(refundAmount) || refundAmount <= 0) {
            return res.status(400).json({ error: "Refund amount must be greater than 0" });
        }

        // Get order to find the user
        const order = await getOrderById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (refundAmount > parseFloat(order.total_cost)) {
            return res.status(400).json({ error: "Refund cannot exceed order total" });
        }

        // Add refund to user balance
        const user = await getUserByUsername(order.username);
        if (!user) return res.status(404).json({ error: "User not found" });

        const currentBalance = parseFloat(user.account_balance) || 0;
        const newBalance = parseFloat((currentBalance + refundAmount).toFixed(2));
        await updateUserBalance(order.username, newBalance);

        res.json({
            message: `Refunded $${refundAmount.toFixed(2)} to ${order.username}`,
            newBalance: newBalance
        });

    } catch (err) {
        console.error("Refund error:", err);
        res.status(500).json({ error: "Refund failed" });
    }
});

// Delete an order restore inventory, no refundd
app.delete("/orders/:id", async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await getOrderById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        // restore inv
        const orderItems = await getOrderItems(orderId);
        for (const item of orderItems) {
            await increaseRemainingEquipment(item.idinventory, 1);
        }

        // Delete links then order
        await deleteOrderInventory(orderId);
        await deleteOrder(orderId);

        res.json({ message: "Order deleted" });

    } catch (err) {
        console.error("Error deleting order:", err);
        res.status(500).json({ error: "Failed to delete order" });
    }
});