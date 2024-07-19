import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  materialType: String,
  deadline: Date,
  frequency: String,
  siteAddress: String,
  certificates: String,
  paymentTerms: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  requirements: [
    {
      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
      },
      price: Number,
      message: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
