import express from 'express'
import cors from 'cors';
import{getInventory} from './database.js'
import {addInventoryItem} from "./database.js"

const app = express()

app.use(cors())
app.use(express.json())



app.get("/inventory", async (req, res) => {
    const inventory = await getInventory()
    res.send(inventory)
})

// post req for inv
app.post("/inventory", async (req, res) => {
    const {equipment_name, equipment_description, category, total_equipment, daily_rate, weekly_rate, image_icon, quality} = req.body
    if (
        !equipment_name ||
        !category ||
        total_equipment === undefined ||
        daily_rate === undefined ||
        weekly_rate === undefined
    ) 
    {
        return res.status(400).json({ error: "fields missingg" })
    }

    const newItem = await addInventoryItem({
        equipment_name,
        equipment_description: equipment_description ?? "",
        category,
        total_equipment: Number(total_equipment),
        remaining_equipment: Number(total_equipment),
        daily_rate: Number(daily_rate),
        weekly_rate: Number(weekly_rate),
        image_icon: image_icon ?? null,
        quality: quality ?? "Okay"
    })

    res.status(201).json(newItem)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.listen(8080, () =>{
    console.log('Server is running on port 8080')
})