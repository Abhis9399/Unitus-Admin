// pages/api/supplier.js
import dbConnect from '@/mongoose/mongodbUser'; // Your db connection logic
import Supplier from '@/model/supplier'; // Import the Supplier model
const formidable= require('formidable'); // For handling file uploads
import fs from 'fs';
import corsMiddleware from '@/utilis/cors'
import jwt, { decode } from 'jsonwebtoken'
import CryptoJS from "crypto-js";

// Disable Next.js's default body parsing to handle multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    corsMiddleware(req, res, async () => {
        await dbConnect();

        if (req.method === 'POST') {
            await dbConnect();
            const form = new formidable.IncomingForm({ multiples: true });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error parsing the files' });
                }

                console.log('Parsed Fields:', fields); // Log fields to check structure

                const profilePicture = files.profilePicture ? files.profilePicture.filepath : '';

                const encryptedPassword = CryptoJS.AES.encrypt(fields.password, process.env.AES_SECRET).toString();

                const supplierData = {
                    representativeName: fields.representativeName,
                    contact: fields.contact,
                    companyName: fields.companyName,
                    address: fields.address,
                    mapLink: fields.mapLink,
                    city: fields.city,
                    state: fields.state,
                    pincode: fields.pincode,
                    materialType : fields.materialType,
                    panNumber: fields.panNumber,
                    gstNumber: fields.gstNumber,
                    aadharNumber: fields.aadharNumber,
                    email:fields.email,
                    password:encryptedPassword,
                    role:'supplier'
                };

                try {
                    const supplier = new Supplier(supplierData);
                    await supplier.save();
                    return res.status(200).json({ message: 'Supplier created successfully', supplier });
                } catch (error) {
                    console.error('Error creating supplier:', error);
                    return res.status(400).json({ error: 'Error creating supplier', details: error.message });
                }
            });
        } 
        else if (req.method === 'GET') {
            // Fetching the supplier information
            if (!req.headers.authorization) {
                return res.status(401).json({ success: false, error: 'Unauthorized - Missing token' });
              }
        
              const token = req.headers.authorization?.replace('Bearer ', '');
              console.log(token);
              const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
              if (!decodedToken.id) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
              }
        
              console.log(decodedToken)
        
              const supplierId = decodedToken.id;
              console.log(supplierId)

            try {
                const supplier = await Supplier.findById(supplierId);
                if (!supplier) {
                    return res.status(404).json({ error: 'Supplier not found' });
                }
                return res.status(200).json({ supplier });
            } catch (error) {
                console.error('Error fetching supplier:', error);
                return res.status(500).json({ error: 'Error fetching supplier', details: error.message });
            }
        }

        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    })
}
