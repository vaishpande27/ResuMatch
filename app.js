const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Static Files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

// Import Routes
const uploadRoutes = require('./upload');

app.use("/", uploadRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
