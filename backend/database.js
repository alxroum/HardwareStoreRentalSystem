import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

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
    const [result] = await pool.query(
        `INSERT INTO inventory (equipment_name, equipment_description, category, total_equipment, remaining_equipment,
         daily_rate, weekly_rate, image_icon, quality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            equipment_name, equipment_description, category, total_equipment, remaining_equipment, daily_rate,
            weekly_rate, image_icon, quality
        ]
    )

    const [rows] = await pool.query(
        `SELECT * FROM inventory WHERE idinventory = ?`, [result.insertId]
    )

    return rows[0]
}

export async function updateInventoryItem(
  id,{equipment_name, equipment_description, category, total_equipment, daily_rate, weekly_rate, quality}
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
  const rentedOut = oldTotal - oldRemaining

  const newTotal = Number(total_equipment)

  if (newTotal < rentedOut) {
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

export async function getUsernames() {
    const [rows] = await pool.query("SELECT username FROM users");
    return rows;
}

// FIXED: was querying inventory table instead of users
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM `hardware_rental`.`users`");
    return rows;
}

export async function addUser({ username, email, phone, address, password, account_balance = 0 }) {
    const [result] = await pool.query(
        'INSERT INTO users (username, email, phone, address, password, account_balance) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, phone, address, password, account_balance]
    );

    const [rows] = await pool.query(
        'SELECT * FROM users WHERE idusers = ?', [result.insertId]
    );

    return rows[0];
}

export async function getUserByUsername(targetUsername) {
    try {
        const query = "SELECT * FROM users WHERE username = ?";
        const [rows] = await pool.query(query, [targetUsername]);

        if (rows.length === 0) {
            return null;
        }

        return rows[0];

    } catch (error) {
        console.error("Database error fetching user by username:", error);
        throw error;
    }
}

export async function updateUserBalance(targetUsername, newBalance) {
    try {
        const query = "UPDATE users SET account_balance = ? WHERE username = ?";
        await pool.query(query, [newBalance, targetUsername]);
        return true; 
    } catch (error) {
        console.error("Database error updating balance:", error);
        throw error; 
    }
}

// next 4 func are for orders

// create an order row and return its ID
export async function createOrder({ idusers, dateRented, dateDue, totalCost }) {
    const [result] = await pool.query(
        `INSERT INTO orders (idusers, \`date-rented\`, date_due, status, total_cost)
         VALUES (?, ?, ?, 'Active', ?)`,
        [idusers, dateRented, dateDue, totalCost]
    );
    return result.insertId;
}

// link inv items to order
export async function addOrderInventory(idorders, idinventory) {
    await pool.query(
        "INSERT INTO `orders-inventory` (idorders, idinventory) VALUES (?, ?)",
        [idorders, idinventory]
    );
}

// decrease remaining_equipment by qty when rented
export async function decreaseRemainingEquipment(idinventory, qty) {
    await pool.query(
        `UPDATE inventory 
         SET remaining_equipment = remaining_equipment - ? 
         WHERE idinventory = ? AND remaining_equipment >= ?`,
        [qty, idinventory, qty]
    );
}

// get orders from user
export async function getAllOrders() {
    try {
        const query1 = 'SELECT o.idorders, u.username, o.`date-rented` AS dateRented, o.date_due AS dateDue, o.date_returned AS dateReturned, o.status, o.total_cost, o.late_fee FROM orders o JOIN users u ON o.idusers = u.idusers ORDER BY o.idorders DESC';
        const [orders] = await pool.query(query1);

        for (const order of orders) {
            try {
                const [items] = await pool.query(
                    'SELECT i.equipment_name FROM `orders-inventory` oi JOIN inventory i ON oi.idinventory = i.idinventory WHERE oi.idorders = ?',
                    [order.idorders]
                );
                order.items = items.map(i => i.equipment_name).join(', ') || 'N/A';
            } catch (itemErr) {
                console.error("Error fetching items for order", order.idorders, itemErr.message);
                order.items = 'N/A';
            }
        }

        return orders;
    } catch (error) {
        console.error("getAllOrders SQL error:", error.message);
        throw error;
    }
}

// get a single order by id (with user ifo)
export async function getOrderById(idorders) {
    const [rows] = await pool.query(
        'SELECT o.*, u.username FROM orders o JOIN users u ON o.idusers = u.idusers WHERE o.idorders = ?',
        [idorders]
    );
    return rows[0] || null;
}

// get items linked to an order (w qty info)
export async function getOrderItems(idorders) {
    const [rows] = await pool.query(
        'SELECT oi.idinventory FROM `orders-inventory` oi WHERE oi.idorders = ?',
        [idorders]
    );
    return rows;
}

export async function deleteOrderInventory(idorders) {
    await pool.query('DELETE FROM `orders-inventory` WHERE idorders = ?', [idorders]);
}

export async function deleteOrder(idorders) {
    await pool.query('DELETE FROM orders WHERE idorders = ?', [idorders]);
}

export async function increaseRemainingEquipment(idinventory, qty) {
    await pool.query(
        'UPDATE inventory SET remaining_equipment = LEAST(remaining_equipment + ?, total_equipment) WHERE idinventory = ?',
        [qty, idinventory]
    );
}