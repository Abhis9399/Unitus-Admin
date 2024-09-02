import connectToDatabase from '@/mongoose/mongodbUser'; // Your db connection logic
import Member from '@/model/Member'; // Import the Member model
import Supplier from '@/model/supplier'; // Import the Supplier model
import User from '@/model/usersModel'; // Import the User model
import corsMiddleware from '@/utilis/cors'; // Import your CORS middleware
import mongoose from 'mongoose';
export default async function handler(req, res) {
    corsMiddleware(req, res, async () => {
    try {
        // Handle CORS

        // Establish database connection
        await mongoose.connect(process.env.MONGODB_URL_USER, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const { method } = req;

        switch (method) {
            case 'GET':
                // Fetch all members
                const members = await Member.find({});
                if (!members.length) {
                    return res.status(404).json({ success: false, message: "No members found" });
                }

                // Collect all unique IDs from assignedClients
                const clientIds = members.flatMap(member => member.assignedClients || []);

                // Fetch all suppliers and users with IDs present in clientIds
                const [suppliers, users] = await Promise.all([
                    Supplier.find({ '_id': { $in: clientIds } }).exec(),
                    User.find({ '_id': { $in: clientIds } }).exec()
                ]);

                // Create maps for fast lookup
                const supplierMap = suppliers.reduce((acc, supplier) => {
                    acc[supplier._id.toString()] = supplier;
                    return acc;
                }, {});
                const userMap = users.reduce((acc, user) => {
                    acc[user._id.toString()] = user;
                    return acc;
                }, {});

                // Add detailed supplier and user data to each member
                const detailedMembers = members.map(member => ({
                    ...member.toObject(),
                    suppliers: (member.assignedClients || [])
                        .filter(id => supplierMap[id.toString()])
                        .map(id => supplierMap[id.toString()]),
                    users: (member.assignedClients || [])
                        .filter(id => userMap[id.toString()])
                        .map(id => userMap[id.toString()])
                }));

                res.status(200).json({ success: true, data: detailedMembers });
                break;

            case 'POST':
                const newMember = await Member.create(req.body);
                res.status(201).json({ success: true, data: newMember });
                break;

            default:
                res.status(400).json({ success: false, message: "Invalid method" });
                break;
        }
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
})
}
