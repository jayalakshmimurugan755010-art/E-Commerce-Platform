const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    username: String,
    items: Array,
    total: Number,
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', OrderSchema);