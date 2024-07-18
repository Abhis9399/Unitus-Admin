import mongoose from 'mongoose';
import Enquiry from '@/model/enquiryModel';
import corsMiddleware from '@/utilis/cors'; // Ensure this path is correct

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Enquiry ID is required' });
    }

    try {
      await mongoose.connect(process.env.MONGODB_URL_USER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const enquiry = await Enquiry.findByIdAndDelete(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, error: 'Enquiry not found' });
      }

      res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
      await mongoose.disconnect();
    }
  });
}
