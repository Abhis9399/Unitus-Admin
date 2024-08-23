import mongoose, { Schema, model } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'account manager' },
  assignedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, { type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Check if the model exists before creating it to avoid overwriting
export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
