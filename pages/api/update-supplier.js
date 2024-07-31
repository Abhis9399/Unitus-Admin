import mongoose from 'mongoose';
import Supplier from '../../models/supplierModel';

const handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { contact, price, capacity } = req.body;

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const supplier = await Supplier.findOne({ contact });

    if (supplier) {
      supplier.dailyPrice = price;
      supplier.dailyCapacity = capacity;
      supplier.updatedAt = new Date();
      await supplier.save();
      res.status(200).send('Update successful');
    } else {
      res.status(404).send('Supplier not found');
    }
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default handler;
