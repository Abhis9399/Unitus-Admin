// models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  representativeName: String,
  contact: String,
  companyName: String,
  location: String,
  address: String,
  mapLink: String,
  materialType: String,
  annualTurnover: String,
  numberOfEmployees: Number,
  relationshipLevel: { type: Number, min: 1, max: 10 },
  relationshipYears: Number,
  inHouseLogistics: { type: String, enum: ['yes', 'no', 'don\'t know'] },
  profilePicture: String,
  documents: {
    panCard: String,
    aadhar: String,
    gst: String,
    cancelledCheck: String,
    registrationCertificate: String,
    productCertificate: String,
    bankDetails: {
      accountNumber: String,
      ifsc: String,
      bankName: String
    }
  }
});

delete mongoose.models.Supplier;
export default mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
