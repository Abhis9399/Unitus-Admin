import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

// Export the model (use existing model if it exists to prevent OverwriteModelError)
const AdminModel = mongoose.models && mongoose.models.Admin ? mongoose.models.Admin : mongoose.model('Admin', AdminSchema);
export default AdminModel;
