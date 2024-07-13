import connectDb from "@/mongoose/mongodbUser";
import User from "@/model/Admin";
import CryptoJS from "crypto-js";

export default async function handler(req,res){
  await connectDb();
  if (req.method === 'POST') {
    console.log(req.body);

    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();
      const encryptedConfirmPassword = CryptoJS.AES.encrypt(confirmPassword, process.env.AES_SECRET).toString();
      
      let u = new User({
        name,
        email,
        phone,
        password: encryptedPassword,
        confirmPassword: encryptedConfirmPassword
      });
      
      await u.save();

      res.status(200).json({ success: "Success" });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: "This method is not allowed" });
  }
};
