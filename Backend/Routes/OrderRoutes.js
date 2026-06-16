const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
});

router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

router.put('/:id', async (req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedOrder);
});

module.exports = router;