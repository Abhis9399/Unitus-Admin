import { Schema, model, models } from "mongoose";
const customerSchema = new Schema({
  firstName: {
    type: String,
    minLength: 2,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 2,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  phone: String,
  address: String,
  postalCode: String,
  products: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: () => Date().now(),
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Customer = models?.Customer || model("Customer", customerSchema);

export default Customer;
