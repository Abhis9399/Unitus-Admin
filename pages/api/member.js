import dbConnect from '@/mongoose/mongodbUser'; // Your db connection logic
import Member from '@/model/Member'; // Import the Member model
import Supplier from '@/model/supplier'; // Import the Supplier model
import User from '@/model/usersModel'; // Import the User model
import corsMiddleware from '@/utilis/cors'; // Import your CORS middleware

export default async function handler(req, res) {
    corsMiddleware(req, res, async () => {
        await dbConnect();
        const { method } = req;

        try {
            switch (method) {
                case 'GET':
                    // Fetch all members
                    const members = await Member.find({});

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
                    const member = await Member.create(req.body);
                    res.status(201).json({ success: true, data: member });
                    break;

                // Add cases for PUT, DELETE as needed

                default:
                    res.status(400).json({ success: false, message: "Invalid method" });
                    break;
            }
        } catch (error) {
            console.error("API Error:", error); // Log the error for debugging
            res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
    });
}
