import { Schema, models, model } from 'mongoose';

const subProductSchema = new Schema({
  name: String,
  size: String, // Adjust data type if necessary, e.g., Number
  unit: String,
  brandNames: [String],
});

const itemSchema = new Schema({
  name: String,
  image: String,
  subProducts: [subProductSchema],
  paymentTerms: String,
  certificates: String,
});

// Export the model if it's already defined, otherwise define it
export default models.Item || model('Item', itemSchema);
