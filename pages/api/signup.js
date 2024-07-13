import connectDb from "@/mongoose/mongodbUser";
import User from "@/model/Admin";
import CryptoJS from "crypto-js";
import corsMiddleware from '@/utilis/cors' // Ensure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        await connectDb();
        
        if (req.method === 'POST') {
            console.log(req.body);

            const { name, email, phone, password, confirmPassword } = req.body;

            // Validate input
            if (!name || !email || !phone || !password || !confirmPassword) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match.' });
            }

            try {
                const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();
                
                let newUser = new User({
                    name,
                    email,
                    phone,
                    password: encryptedPassword
                    // Removed confirmPassword
                });
                
                await newUser.save();

                res.status(201).json({ success: "User created successfully" });
            } catch (error) {
                console.error('Error saving user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    });
}
