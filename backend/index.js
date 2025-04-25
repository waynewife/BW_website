const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());

// Serve static files (including books.json)
app.use(express.static(path.join(__dirname)));

//upload pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing routes (e.g., user routes)
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));