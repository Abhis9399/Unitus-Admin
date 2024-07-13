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
  deadline: Date,
  frequency: String,
  siteAddress: String,
  certificates: String,
  paymentTerms: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EnquiryModel = mongoose.models && mongoose.models.Enquiry ? mongoose.models.Enquiry : mongoose.model('Enquiry', EnquirySchema);
export default EnquiryModel;
