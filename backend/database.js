import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

//console.log("ENV:", process.env.MYSQL_USER, process.env.MYSQL_DATABASE)


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getInventory() {
    const [rows] = await pool.query("SELECT * FROM `hardware_rental`.`inventory`")
    return rows;
}

export async function addInventoryItem({equipment_name, equipment_description, category, total_equipment, remaining_equipment,
daily_rate, weekly_rate, image_icon = null, quality = "Okay"
}) {
    // query for db
    const [result] = await pool.query(
        `INSERT INTO inventory (equipment_name, equipment_description, category, total_equipment, remaining_equipment,
         daily_rate, weekly_rate, image_icon, quality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            equipment_name, equipment_description, category, total_equipment, remaining_equipment, daily_rate,
            weekly_rate, image_icon,quality
        ]
    )

    const [rows] = await pool.query(
        `SELECT * FROM inventory WHERE idinventory = ?`, [result.insertId]
    )

    return rows[0]
}

//test code
//const inventory = await getInventory()
//console.log(inventory)