import express from 'express'
import multer from "multer"
import cors from 'cors';
import{getInventory} from './database.js'
import {addInventoryItem} from "./database.js"
import { deleteInventoryItem } from "./database.js"
import { updateInventoryItem } from "./database.js"
import { getUsernames } from './database.js'
import { addUser } from './database.js';
import { getUsers } from './database.js';
import { getUserByUsername } from './database.js';
import bcrypt from 'bcrypt';
import { updateUserBalance } from './database.js';

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

// update route, must be aftter post route
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

app.listen(8080, () =>{
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
        const allUsers = await getUsers(); // Your DB function to get everything
        
        // Security check: remove passwords before sending
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

// use POST to validate credentials for security
// GET moves the data to the localhost url and passwords are exposed
app.post("/login", async (req, res) => {
    try {
        // retrieve the username and password from the request
        const { username, password } = req.body;

        // 
        const user = await getUserByUsername(username); 

        // check if the user exists
        if (!user) {
            // bad login
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // if everything matches, remove the password and send everything back
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

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // call addUser from database.js
        const result = await addUser({ 
            username, 
            email, 
            phone, 
            address, 
            password: hashedPassword, // Store the hash!
            account_balance: 0 
        });

        // success message
        res.status(201).json(result);

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.post("/users/:username/funds", async (req, res) => {
    try {
        const { action, amount } = req.body; 
        const parsedAmount = parseFloat(amount);

        // Validation
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

        // FIX: Round to 2 decimal places to avoid JS floating point bugs
        const finalBalance = parseFloat(currentBalance.toFixed(2));

        await updateUserBalance(req.params.username, finalBalance);
        res.status(200).json({ message: "Success", newBalance: finalBalance });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Transaction failed" });
    }
});
