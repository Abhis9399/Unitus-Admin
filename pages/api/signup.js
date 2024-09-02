import { connectToDatabase } from "@/mongoose/mongodbUser";
import User from "@/model/Member";
import CryptoJS from "crypto-js";
import corsMiddleware from '@/utilis/cors';

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            await connectToDatabase();

            const { name, phone, password, confirmPassword, role, material } = req.body;

            // Validate input
            if (!name || !phone || !password || !role) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Encrypt passwords
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();
            const encryptedConfirmPassword = CryptoJS.AES.encrypt(confirmPassword, process.env.AES_SECRET).toString();

            // Create and save new user
            let newUser = new User({
                name,
                phone,
                password: encryptedPassword,
                confirmPassword: encryptedConfirmPassword,
                role,
                material: role === 'supplierExecutive' ? material : undefined // Add material only for supplierExecutive
            });

            try {
                await newUser.save();
                return res.status(201).json({ success: 'User created successfully' });
            } catch (error) {
                return res.status(500).json({ error: 'Error creating user', details: error.message });
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}
