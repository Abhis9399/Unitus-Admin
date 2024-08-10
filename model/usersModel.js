import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
const UserModel = mongoose.models && mongoose.models.User ? mongoose.models.User : mongoose.model('User', userSchema);
export default UserModel;
