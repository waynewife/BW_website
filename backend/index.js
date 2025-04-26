const express = require('express');
const app = express();
const path = require('path');


app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
