const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce_simple')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Connection Error:", err));

// --- Database Schemas ---
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'User' } // 'User' or 'Admin'
});

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
});

const OrderSchema = new mongoose.Schema({
    username: String,
    items: Array,
    total: Number,
    status: { type: String, default: 'Pending' }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- API Routes ---
app.post('/api/register', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ message: "User registered!", user: newUser });
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
        res.json({ success: true, username: user.username, role: user.role });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
});

app.post('/api/orders', async (req, res) => {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
});

app.get('/api/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

app.put('/api/orders/:id', async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedOrder);
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));