# Hardware Store Rental System

A full-stack web application for managing hardware equipment rentals. Users can browse equipment, add items to their cart, and process checkouts while managing their account balance.

**Created By:** Alex Morris, Ahmed Nowayti, Alex Rouman, Alan Prudhomme, Faizah Fatima, and Nathan Gessner

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Architecture Overview](#architecture-overview)
- [Development Notes](#development-notes)

---

## ✨ Features

### User Features
- **User Authentication**: Sign up and login with bcrypt password hashing
- **Equipment Browsing**: Browse equipment catalog with category filtering
- **Shopping Cart**: Add items to cart, adjust quantities and rental duration
- **Checkout System**: Secure checkout with balance validation and fund deduction
- **Account Management**: View and manage user profile and balance

### Admin Features
- **Inventory Management**: Create, read, update, and delete equipment listings
- **Equipment Details**: Manage equipment name, description, category, pricing, and condition
- **Image Upload**: Support for equipment images

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Bcrypt** - Password hashing and security
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
HardwareStoreRentalSystem/
├── backend/
│   ├── App.js              # Express server and API routes
│   ├── database.js         # Database connection and queries
│   ├── .env                # Environment variables (not committed)
│   └── node_modules/       # Dependencies
│
├── hardware-rental/        # React frontend
│   ├── src/
│   │   ├── App.jsx         # Root application component
│   │   ├── main.jsx        # React entry point
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx              # Equipment catalog
│   │   │   ├── Cart.jsx              # Shopping cart
│   │   │   ├── Checkout.jsx          # Checkout modal
│   │   │   ├── Login.jsx             # User login
│   │   │   ├── SignUp.jsx            # User registration
│   │   │   ├── Account.jsx           # User account
│   │   │   └── Admin.jsx             # Admin dashboard
│   │   ├── components/
│   │   │   ├── Card.jsx              # Equipment card component
│   │   │   └── DetailCard.jsx        # Equipment detail modal
│   │   ├── styles/         # CSS stylesheets
│   │   └── tool_data.json  # Sample equipment data
│   ├── public/
│   │   ├── assets/         # Images and static files
│   │   └── index.html      # HTML template
│   └── vite.config.js      # Vite configuration
│
├── System_Programs_Documentation.md  # Detailed system documentation
└── README.md               # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database credentials:
```env
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=hardware_rental
```

4. Ensure your MySQL server is running and the `hardware_rental` database exists

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd hardware-rental
```

2. Install dependencies:
```bash
npm install
```

---

## ▶️ Running the Application

### Start the Backend Server
```bash
cd backend
npm start
```
The server will run on `http://localhost:8080`

### Start the Frontend Development Server
```bash
cd hardware-rental
npm run dev
```
The application will open at `http://localhost:5173`

---

## 🔌 API Endpoints

### Inventory Management
- `GET /inventory` - Retrieve all equipment
- `POST /inventory` - Add new equipment (with image upload)
- `PUT /inventory/:id` - Update equipment details
- `DELETE /inventory/:id` - Delete equipment

### User Management
- `GET /usernames` - Get all usernames
- `GET /users` - Get all users (passwords removed)
- `POST /users` - Register new user
- `POST /login` - Authenticate user

### Financial Operations
- `POST /users/:username/funds` - Deposit or withdraw funds
- `POST /checkout` - Process rental checkout and deduct funds

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  idusers INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  account_balance DECIMAL(10, 2) DEFAULT 0.00
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
  idinventory INT PRIMARY KEY AUTO_INCREMENT,
  equipment_name VARCHAR(100) NOT NULL,
  equipment_description TEXT,
  category VARCHAR(50),
  total_equipment INT,
  remaining_equipment INT,
  daily_rate DECIMAL(10, 2),
  weekly_rate DECIMAL(10, 2),
  image_icon VARCHAR(255),
  quality VARCHAR(50)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  idorders INT PRIMARY KEY AUTO_INCREMENT,
  idusers INT NOT NULL,
  date_rented DATETIME,
  date_due DATETIME,
  date_returned DATETIME,
  late_fee DECIMAL(10, 2),
  status VARCHAR(20),
  total_cost DECIMAL(10, 2),
  FOREIGN KEY (idusers) REFERENCES users(idusers)
);
```

---

## 🏗️ Architecture Overview

### Frontend Architecture
- **React Components**: Modular component-based UI
- **React Router**: Client-side routing for navigation
- **localStorage**: Session persistence and cart management
- **State Management**: React hooks (useState, useEffect)

### Backend Architecture
- **Express Server**: RESTful API with CORS enabled
- **Database Layer**: Abstracted database functions
- **Authentication**: Bcrypt password hashing and verification
- **Error Handling**: Centralized error middleware

### Data Flow
1. User logs in → credentials validated → user object stored in localStorage
2. User adds items → items stored in localStorage CART
3. User checks out → POST to /checkout → backend validates balance → deducts funds → updates localStorage
4. Cart cleared → user can make new purchases

---

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **CORS**: Enabled for secure cross-origin requests
- **Input Validation**: Server-side validation on all endpoints
- **Session Persistence**: User data stored securely in localStorage
- **Error Messages**: Detailed error responses without exposing sensitive info

---

## 📝 Development Notes

### Current Status

✅ **Completed:**
- Full backend API with all core endpoints
- User authentication with bcrypt
- Inventory management system
- Shopping cart with localStorage persistence
- Checkout flow with balance validation and fund deduction
- Error handling and JSON response formatting
- Module documentation and architecture planning

⚠️ **In Progress/TODO:**
- Admin CRUD operations UI connection
- Account page full functionality
- Image upload integration in admin interface
- Order history display
- Late fee calculation system
- Equipment availability tracking

### Known Issues
- Bug in `database.js :: getUsers()` - queries inventory table instead of users table

### Architecture Decisions
- **localStorage for Cart**: Allows cart persistence without backend storage
- **localStorage for User Session**: Simple session management without cookies/JWT overhead
- **Bcrypt for Passwords**: Industry standard for password security
- **REST API Design**: Standard HTTP methods for CRUD operations

### Code Quality
- Error handling on all async operations
- JSON validation with try-catch blocks
- Consistent naming conventions
- Modular component structure
- Separated database logic from routes

---

## 📚 Documentation

For detailed system architecture and module relationships, see:
- `System_Programs_Documentation.md` - Comprehensive module documentation with control charts

---

## 💡 Usage Examples

### Adding an Item to Cart
1. Browse equipment on home page
2. Click "Add to Cart" button
3. Item added with default quantity (1) and duration (1 day)
4. Navigate to cart to adjust or checkout

### Processing a Checkout
1. View cart items and total
2. Click "Proceed to Checkout"
3. Review balance and order total
4. Click "Confirm & place order"
5. Order processed, balance updated, cart cleared

### Managing Account Balance
1. Navigate to Account page
2. View current balance
3. Add funds (future feature)
4. View order history

---

## 🤝 Contributing

When making changes:
1. Update relevant components
2. Test backend routes with Postman or similar
3. Check localStorage state consistency
4. Update documentation if architecture changes
5. Ensure error handling covers edge cases

---

## 📞 Support

For issues or questions, refer to the detailed documentation in `System_Programs_Documentation.md` or review the relevant source files.

---

**Last Updated:** April 2026