
# Hardware Rental System

### A simple website that allows users to rent items from a hardware store's inventory.

This project was made for COSC 381 at Eastern Michigan University.
## Features

- Simple and user-friendly UI
- Database integration
- Full admin control for managing the inventory
- Cart and checkout system
- Order logging and refunding


## Project Installation

Clone the project
```bash
git clone https://github.com/alxroum/HardwareStoreRentalSystem.git
```
Alternatively, download the zip or clone with SSH

Make sure node.js is installed on your system or [download node.js.]("https://nodejs.org/en/download")

Check to make sure node is installed
```bash
node --version
```

make sure to run 
```bash
npm install
``` 
to install all dependencies



    
## Database Installation
## Deployment

It is recommended to run the following steps in two separate terminal instances

To deploy this project, first navigate to './hardware-rental' in a new terminal and run

```bash
npm run dev

// the above command starts the vite react project for the UI
```


Next, in a new terminal, navigate to './backend' and run

```bash
npm start

// the above command starts the database connection
```


## Authors

- [Alex Rouman @alxroum](https://www.github.com/alxroum)
- [Nate Gessner @ngessner](https://github.com/ngessner)
- [Ahmed Nowayti @AhmedNowayti](https://github.com/AhmedNowayti)
- [Alex Morris @alexmorris90341](https://github.com/alexmorris90341)
- [Alan Prudhomme @alan-prudhomme](https://github.com/alan-prudhomme)



## Dependencies

The project is setup with Vite and React at the core with MySQL and Express as a database setup.

### Backend Dependencies (App.js)
- **bcrypt** *6.0.0+*
- **express** *5.2.1+*
- **multer** *2.1.1+*
- **mysql2** *3.19.1+*

### Frontend Dependencies (hardware-rental)

- **react** *version 19.2.0+*
- **react-dom** *version 19.2.0+*
- **react-router-dom** *version 7.13.0+*
- **vite** *version 7.2.4+*
- **@types/react** *version 19.2.5+*
- **@types/react-dom** *version 19.2.3+*
