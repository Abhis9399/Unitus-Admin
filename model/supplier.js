// models/Supplier.js
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
  bankName: { type: String, required: true },
});

const supplierSchema = new mongoose.Schema({
  representativeName: { type: String, required: true },
  contact: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  mapLink: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  materialType: { type: String },
  panNumber: { type: String, required: true },
  gstNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
});

delete mongoose.models.Supplier;
export default mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
