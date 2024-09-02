import {connectToDatabase} from '@/mongoose/mongodbUser';
import Supplier from '@/model/supplier';
import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct
import mongoose from 'mongoose';

export default async function handler(req, res) {
   await corsMiddleware(req, res, async () => {
        const { supplierId } = req.query;

        console.log({ supplierId });  // Log to check if supplierId is received
        try {
            await mongoose.connect(process.env.MONGODB_URL_USER, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const supplier = await Supplier.find({ suppliers: supplierId });

            if (!supplier) {
                return res.status(404).json({ success: false, error: 'Supplier not found' });
            }

            console.log(supplier);  // Log to check if supplier details are fetched

            return res.status(200).json({ success: true, data: supplier });
        } catch (error) {
            console.error('Error fetching supplier details:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        finally {
            await mongoose.disconnect();
        }
    });
}

