import User from "@/model/Member";
import { connectToDatabase } from "@/mongoose/mongodbUser";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import { setCookie } from 'nookies';
import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            await connectToDatabase();

            try {
                const { phone, password } = req.body;

                if (!phone || !password) {
                    return res.status(400).json({ success: false, error: "Phone and password are required" });
                }

                const existingUser = await User.findOne({ phone });
                if (!existingUser) {
                    return res.status(401).json({ success: false, error: "Invalid credentials" });
                }

                // Decrypt
                const bytes = CryptoJS.AES.decrypt(existingUser.password, process.env.AES_SECRET);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);

                if (originalText !== password) {
                    return res.status(401).json({ success: false, error: "Invalid credentials" });
                }

                // If user exists and passwords match, return user data including role
                const token = jwt.sign(
                    { phone: existingUser.phone, name: existingUser.name, role: existingUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '2d' }
                );

                setCookie({ res }, 'token', token, {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                });

                res.status(200).json({ success: true, token, role: existingUser.role });
            } catch (error) {
                console.error("Error in login:", error);
                res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        } else {
            res.status(405).json({ success: false, error: "Method not allowed" });
        }
    });
}
