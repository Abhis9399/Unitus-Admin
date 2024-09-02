const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    date: { type: Date, default: Date.now },
    materialRate: { type: String, required: true },
    vehicleAvailability: { type: String, required: true }
});

module.exports = mongoose.model('Notification', NotificationSchema);
