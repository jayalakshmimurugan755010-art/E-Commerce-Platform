const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post('/', async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
});

module.exports = router;