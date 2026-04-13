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

export async function getUsernames() {
    const [rows] = await pool.query("SELECT username FROM users");
    return rows;
}

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM `hardware_rental`.`inventory`");

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

// grabs user data by a username
export async function getUserByUsername(targetUsername) {
    try {
        const query = "SELECT * FROM users WHERE username = ?";
        
        // Execute the query
        const [rows] = await pool.query(query, [targetUsername]);

        // if there are no results, the user doesn't exist
        if (rows.length === 0) {
            return null;
        }

        // return the first user object
        return rows[0];

    } catch (error) {
        console.error("Database error fetching user by username:", error);
        throw error; // Throw the error so your server.js catch block can handle it
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

export async function processCheckoutData(username, total) {
  // fetch user data
  const [userRows] = await pool.query(
    'SELECT idusers, account_balance FROM users WHERE username = ?', 
    [username]
  );

  if (userRows.length === 0) {
    // attach a status code to the error so the route knows how to respond
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const userId = userRows[0].idusers;
  const currentBalance = parseFloat(userRows[0].account_balance);
  const checkoutTotal = parseFloat(total);

  // verify balance
  if (currentBalance < checkoutTotal) {
    const error = new Error('Insufficient balance');
    error.statusCode = 400;
    throw error;
  }

  const newBalance = currentBalance - checkoutTotal;

  // default values
  const dateRented = new Date(); 
  const dateDue = new Date();
  dateDue.setDate(dateRented.getDate() + 7); 
  
  const dateReturned = null;
  const lateFee = 0.00;      
  const status = 'active';   

  // insert new order
  const [insertResult] = await pool.query(
    `INSERT INTO orders 
    (idusers, \`date-rented\`, date_due, date_returned, late_fee, status, total_cost) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, dateRented, dateDue, dateReturned, lateFee, status, checkoutTotal]
  );

  // update users balance
  await pool.query(
    'UPDATE users SET account_balance = ? WHERE idusers = ?',
    [newBalance, userId]
  );

  // return to express route
  return {
    success: true,
    orderId: insertResult.insertId,
    newBalance: newBalance 
  };
}

//test code
//const inventory = await getInventory()
//console.log(inventory)