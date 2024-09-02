import mongoose, { Schema } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'account manager' },
  assignedClients: [{ type: Schema.Types.ObjectId, ref: 'supplier' }],
  material: {
    type: String,
    enum: ['sand', 'rmc', 'flyash', 'aggregate'],
    required: function() { return this.role === 'supplierExecutive'; } // Material is required only for supplierExecutive
  },
});

const MemberModel = mongoose.models && mongoose.models.Member ? mongoose.models.Member : mongoose.model('Member', MemberSchema);

export default MemberModel;
