// models/orderModel.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier',
    required: true
  },
  price:{
    type: Number,
    required:true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  subProducts: [
    {
      name: String,
      quantity: String,
      size: String,
      unit: String,
      brandName: String
    }
  ],
  materialType: { type: [String], required: true },
  deadline: Date,
  frequency: String,
  siteAddress: String,
  certificates: String,
  paymentTerms: String,
  totalPrice: {
    type: Number,
    required: true
  },
  isDealDone: {
    type: Boolean,
    required: true
  },
  invoiceGenerated: {
    type: Boolean,
    default: false
  },
  docHashId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
