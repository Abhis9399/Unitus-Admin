import mongoose, { Schema } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'account manager' },
  assignedClients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
});

// const Member = models?.Member || model("Member", MemberSchema);

// export default Member;

// export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
const MemberModel = mongoose.models && mongoose.models.Member ? mongoose.models.Member : mongoose.model('Member', MemberSchema);
export default MemberModel;
