import dbConnect from '@/mongoose/mongodbUser';
import Forgot from '@/model/forgot';
import User from '@/model/Admin';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import corsMiddleware from '@/utils/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
    await dbConnect();
    console.log('Received request to /api/forgot:', req.body);

    const { email, sendMail, newPassword, token } = req.body;

    // Connect to the database
    await dbConnect();

    try {
        // Convert email to lowercase for case-insensitive search
        const userEmail = email.toLowerCase();

        // Check if the user exists in the database
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        if (sendMail) {
            // Generate a secure token
            const token = crypto.randomBytes(32).toString('hex');

            // Save the token and its expiration time to the database
            const forgot = new Forgot({
                email: userEmail,
                token: token,
                expiration: Date.now() + 3600000 // Token valid for 1 hour
            });

            try {
                await forgot.save();
            } catch (error) {
                console.error('Failed to save token:', error);
                return res.status(500).json({ error: 'Failed to save token' });
            }

            // Prepare the email content
            const emailContent = `Hello,

            Somebody requested a new password for the account associated with ${email}.
            
            No changes have been made to your account yet.
            
            You can reset your password by clicking the link: <a href="${process.env.NEXT_PUBLIC_HOST}/forgot?token=${token}">Reset Password</a>
            
            If you did not request a new password, please let us know immediately by replying to this email.

            Yours,
            The Team`;

            // Send the email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.NEXT_PUBLIC_EMAIL_USER, // Your email
                    pass: process.env.NEXT_PUBLIC_EMAIL_PASS  // Your email password
                }
            });

            const mailOptions = {
                from: process.env.NEXT_PUBLIC_EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                html: emailContent
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({ error: 'Failed to send reset email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ success: 'Password reset instructions have been sent to your email' });
                }
            });
        } else if (newPassword && token) {
            // Reset user password
            const forgot = await Forgot.findOne({ token, email: userEmail });
            if (!forgot || forgot.expiration < Date.now()) {
                console.log('Invalid or expired token for email:', email);
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            // Hash the new password
            const hashedPassword = bcrypt.hashSync(newPassword, 10);

            try {
                // Update user's password in the database
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({ success: 'Password has been reset successfully' });
            } catch (error) {
                console.error('Failed to reset password:', error);
                res.status(500).json({ error: 'Failed to reset password' });
            }
        } else {
            res.status(400).json({ error: 'Invalid request' });
        }
    } catch (error) {
        console.error('Error querying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
};

