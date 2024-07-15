import dbConnect from '@/mongoose/mongodbUser';
import Enquiry from '@/model/enquiryModel'; // Adjust the import based on your model structure
import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    const { method } = req;

    console.log(`Received ${method} request for enquiry ID: ${req.query.enquiryId}`);

    try {
      await dbConnect();
      console.log('Database connected successfully');

      if (method === 'PUT') {
        try {
          const enquiryId = req.query.enquiryId;
          const updatedEnquiry = req.body;

          const enquiry = await Enquiry.findByIdAndUpdate(enquiryId, updatedEnquiry, {
            new: true,
            runValidators: true,
          });

          if (!enquiry) {
            console.log('Enquiry not found');
            return res.status(404).json({ success: false, message: 'Enquiry not found' });
          }

          console.log('Enquiry updated successfully');
          res.status(200).json({ success: true, data: enquiry });
        } catch (error) {
          console.error('Error updating enquiry:', error);
          res.status(500).json({ success: false, error: error.message });
        }
      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ success: false, error: 'Database connection failed' });
    }
  });
}
