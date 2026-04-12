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

export async function updateInventoryItem(
  id,{equipment_name, equipment_description, category, total_equipment, daily_rate, weekly_rate,quality}
) {
  const [currentRows] = await pool.query(
    `SELECT total_equipment, remaining_equipment
     FROM inventory
     WHERE idinventory = ?`,
    [id]
  )

  if (currentRows.length === 0) {
    throw new Error("Item not found")
  }

  const currentItem = currentRows[0]

  const oldTotal = Number(currentItem.total_equipment)
  const oldRemaining = Number(currentItem.remaining_equipment)
  // simple math, available should adapt to total items for updated tools
  const rentedOut = oldTotal - oldRemaining

  const newTotal = Number(total_equipment)

  if (newTotal < rentedOut) {
    // this should kinda crash the page. There shouldn't be a scenario where we have less
    // than whats available. If that item somehow makes through it must be deleted or crash on edit
    // (unless positively)
    throw new Error("total equipment cannot be less than number currently rented out")
  }

  const newRemaining = newTotal - rentedOut

  await pool.query(
    `UPDATE inventory
     SET equipment_name = ?,
         equipment_description = ?,
         category = ?,
         total_equipment = ?,
         remaining_equipment = ?,
         daily_rate = ?,
         weekly_rate = ?,
         quality = ?
     WHERE idinventory = ?`,
    [equipment_name, equipment_description, category, newTotal, newRemaining, daily_rate, weekly_rate, quality, id]
  )

  const [rows] = await pool.query(
    `SELECT * FROM inventory WHERE idinventory = ?`,
    [id]
  )

  return rows[0]
}

export async function deleteInventoryItem(id) {
    const [result] = await pool.query(
        `DELETE FROM inventory WHERE idinventory = ?`,
        [id]
    )

    return result
}

//test code
//const inventory = await getInventory()
//console.log(inventory)