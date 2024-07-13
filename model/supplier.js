// models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  representativeName: { type: String, required: true },
  contact: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  mapLink: { type: String, required: true },
  materialType: { type: String, required: true },
  annualTurnover: { type: String, required: true },
  numberOfEmployees: { type: Number, required: true },
  relationshipLevel: { type: Number, min: 1, max: 10, required: true },
  relationshipYears: { type: Number, required: true },
  inHouseLogistics: { type: String, enum: ['yes', 'no', 'don\'t know'], required: true },
  profilePicture: { type: String, required: true },
  documents: {
    panCard: { type: String, required: true },
    aadhar: { type: String, required: true },
    gst: { type: String, required: true },
    cancelledCheck: { type: String, required: true },
    registrationCertificate: { type: String, required: true },
    productCertificate: { type: String, required: true },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
      bankName: { type: String, required: true }
    }
  }
});

delete mongoose.models.Supplier;
export default mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
