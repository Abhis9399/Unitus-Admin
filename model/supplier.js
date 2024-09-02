// models/Supplier.js
const mongoose = require('mongoose');

// const bankDetailsSchema = new mongoose.Schema({
//   accountNumber: { type: String, required: true },
//   ifsc: { type: String, required: true },
//   bankName: { type: String, required: true },
// });

const supplierSchema = new mongoose.Schema({
  representativeName: { type: String },
  contact: { type: String, unique: true },
  companyName: { type: String },
  address: { type: String },
  mapLink: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  materialType: { type: [String] },
  numberofVehicles: { type: Number, default: 0 },
  panNumber: { type: String, default: null },
  gstNumber: { type: String, default: null },
  aadharNumber: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'supplier' },
  dailyPrice: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },
  dailyCapacity: { type: Number, default: 0 },
  assignedMember: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // New field
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.Supplier;
export default mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
