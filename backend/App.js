import express from 'express'
import cors from 'cors';
import{getInventory} from './database.js'

const app = express()

app.use(cors())
app.use(express.json())



app.get("/inventory", async (req, res) => {
    const inventory = await getInventory()
    res.send(inventory)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.listen(8080, () =>{
    console.log('Server is running on port 8080')
})