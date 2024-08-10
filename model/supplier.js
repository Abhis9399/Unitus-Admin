// models/Supplier.js
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
  bankName: { type: String, required: true },
});

const supplierSchema = new mongoose.Schema({
  representativeName: { type: String, required: true },
  contact: { type: String, required: true ,unique: true},
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  mapLink: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  materialType: { type: [String], required: true },
  panNumber: { type: String , default : null},
  gstNumber: { type: String,default : null},
  aadharNumber: { type: String,default : null },
  email:{type: String,required :true ,unique:true},
  password :{type : String,required : true},
  role:{type:String,default : 'supplier'},
  dailyPrice: {  
    type: mongoose.Schema.Types.Decimal128, 
    default: 0 },
  dailyCapacity: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

delete mongoose.models.Supplier;
export default mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
