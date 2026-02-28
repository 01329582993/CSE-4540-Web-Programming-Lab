const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    location: { type: String, required: true },
    conditions: { type: String, enum: ['sunny', 'rainy', 'cloudy', 'cold', 'hot'], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Weather', weatherSchema);
