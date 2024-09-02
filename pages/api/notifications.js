import {connectToDatabase} from '@/mongoose/mongodbUser';
import Notification from '@/model/notificationModel';
import corsMiddleware from '@/utilis/cors'; // Import your CORS middleware

dbConnect();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        await connectToDatabase();

    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { supplierId } = req.query;
                let notifications;

                if (supplierId) {
                    notifications = await Notification.find({ supplierId }).sort({ date: -1 });
                } else {
                    notifications = await Notification.find().populate('supplierId').sort({ date: -1 });
                }

                res.status(200).json(notifications);
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
})
};
