import dbConnect from '@/mongoose/mongodbUser';
import Supplier from '@/model/supplier';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const suppliers = await Supplier.find();
            res.status(200).json({ success: true, data: suppliers });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error fetching suppliers' });
        }
    } else if (req.method === 'POST') {
        try {
            const newSupplier = new Supplier(req.body);
            await newSupplier.save();
            res.status(201).json({ success: true, data: newSupplier });
        } catch (error) {
            res.status(400).json({ success: false, error: 'Error creating supplier' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
