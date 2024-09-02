// pages/api/supplier.js
import { connectToDatabase } from '@/mongoose/mongodbUser'; // Your db connection logic
import Supplier from '@/model/supplier'; // Import the Supplier model
const formidable = require('formidable'); // For handling file uploads
import fs from 'fs';
import corsMiddleware from '@/utilis/cors';
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import Member from '@/model/Member';

// Disable Next.js's default body parsing to handle multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    corsMiddleware(req, res, async () => {
        await connectToDatabase();

        if (req.method === 'POST') {
            await connectToDatabase();
            const form = new formidable.IncomingForm({ multiples: true });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: 'Error parsing the files' });
                }

                console.log('Parsed Fields:', fields); // Log fields to check structure

                const encryptedPassword = CryptoJS.AES.encrypt(fields.password, process.env.AES_SECRET).toString();
                
                // Fetch the assigned member's name
                const assignedMember = await Member.findById(fields.assignedMember).select('name');
                if (!assignedMember) {
                    return res.status(400).json({ error: 'Assigned member not found' });
                }

                const supplierData = {
                    representativeName: fields.representativeName,
                    contact: fields.contact,
                    companyName: fields.companyName,
                    address: fields.address,
                    mapLink: fields.mapLink,
                    city: fields.city,
                    state: fields.state,
                    pincode: fields.pincode,
                    materialType: fields.materialType,
                    panNumber: fields.panNumber,
                    gstNumber: fields.gstNumber,
                    aadharNumber: fields.aadharNumber,
                    email: fields.email,
                    password: encryptedPassword,
                    role: 'supplier',
                    assignedMember: { name: assignedMember.name }, // Corrected assignment
                };

                try {
                    const supplier = new Supplier(supplierData);
                    await supplier.save();

                    // Update the member's assignedClients
                    assignedMember.assignedClients.push(supplier._id);
                    await assignedMember.save();

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
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }

            const supplierId = decodedToken.id;

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
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}
