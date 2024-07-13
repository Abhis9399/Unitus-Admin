import User from "@/model/Admin";
import connectDb from "@/mongoose/mongodbUser";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import { setCookie } from 'nookies';
import corsMiddleware from '@/utilis/cors';// Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            await connectDb();

            try {
                const { email, password } = req.body;

                if (!email || !password) {
                    return res.status(400).json({ success: false, error: "Email and password are required" });
                }

                const existingUser = await User.findOne({ email });
                if (!existingUser) {
                    return res.status(401).json({ success: false, error: "Invalid credentials" });
                }

                // Decrypt
                const bytes = CryptoJS.AES.decrypt(existingUser.password, process.env.AES_SECRET);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);

                if (originalText !== password) {
                    return res.status(401).json({ success: false, error: "Invalid credentials" });
                }

                // If user exists and passwords match, return user data
                const token = jwt.sign({ email: existingUser.email, name: existingUser.name }, process.env.JWT_SECRET, {
                    expiresIn: '2d'
                });

                console.log(token);

                setCookie({ res }, 'token', token, {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                });

                res.status(200).json({ success: true, token });
            } catch (error) {
                console.error("Error in login:", error);
                res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        } else {
            res.status(405).json({ success: false, error: "Method not allowed" });
        }
    });
}
