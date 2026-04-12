import express from 'express'
import multer from "multer"
import cors from 'cors';
import{getInventory} from './database.js'
import {addInventoryItem} from "./database.js"
import { deleteInventoryItem } from "./database.js"
import { updateInventoryItem } from "./database.js"

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

