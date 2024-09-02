import { connectToDatabase } from '@/mongoose/mongodbUser'; // Your db connection logic
import Supplier from '@/model/supplier'; // Import the Supplier model
import Member from '@/model/Member';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

// Disable Next.js's default body parsing to handle JSON data
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Adjust as needed
        },
    },
};

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        try {
            const {
                representativeName,
                contact,
                companyName,
                address,
                mapLink,
                city,
                state,
                pincode,
                materialType,
                numberofVehicles,
                panNumber,
                gstNumber,
                aadharNumber,
                email,
                password,
                assignedMember, // This should be an ObjectId
            } = req.body;

            // Encrypt the password
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();

            // Validate and fetch the assigned member
            if (!/^[0-9a-fA-F]{24}$/.test(assignedMember)) {
                return res.status(400).json({ error: 'Invalid assigned member ID' });
            }

            const member = await Member.findById(assignedMember).select('name');
            if (!member) {
                return res.status(400).json({ error: 'Assigned member not found' });
            }

            const supplierData = {
                representativeName,
                contact,
                companyName,
                address,
                mapLink,
                city,
                state,
                pincode,
                materialType,
                numberofVehicles,
                panNumber,
                gstNumber,
                aadharNumber,
                email,
                password: encryptedPassword,
                assignedMember: member._id, // Use ObjectId directly
            };

            const supplier = new Supplier(supplierData);
            await supplier.save();

            // Update the member's assignedClients
            if (!member.assignedClients) {
                member.assignedClients = [];
            }

            // Update the member's assignedClients
            member.assignedClients.push(supplier._id);
            await member.save();
            return res.status(200).json({ message: 'Supplier created successfully', supplier });
        } catch (error) {
            console.error('Error creating supplier:', error);
            return res.status(400).json({ error: 'Error creating supplier', details: error.message });
        }
    } 
    else if (req.method === 'GET') {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                return res.status(401).json({ error: 'Unauthorized - Missing token' });
            }

            const token = authorization.replace('Bearer ', '');
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const supplierId = decodedToken.id;
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
}
