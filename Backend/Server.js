const express = require('express');
const cors = require('cors');
const connectDB = async () => {
    try {
        const mongoose = require('mongoose');
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce_simple');
        console.log("MongoDB Connected");
    } catch(err) { console.log(err); }
};

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Main Domain API Routers
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(5000, () => console.log("Clean architectural backend server running on port 5000"));