import dbConnect from '@/mongoose/mongodbUser';
import Enquiry from '@/model/enquiryModel'; // Adjust the import based on your model structure
import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        const { method } = req;
        const { enquiryId } = req.query; // Get the enquiryId from the query parameters

        console.log(`Received ${method} request for enquiry ID: ${enquiryId}`);

        try {
            await dbConnect();
            console.log('Database connected successfully');

            switch (method) {
                case 'DELETE':
                    try {
                        const deletedEnquiry = await Enquiry.findByIdAndDelete(enquiryId);
                        if (!deletedEnquiry) {
                            return res.status(404).json({ success: false, message: 'Enquiry not found' });
                        }
                        res.status(200).json({ success: true, data: deletedEnquiry });
                    } catch (error) {
                        res.status(500).json({ success: false, error: error.message });
                    }
                    break;

                // Handle other methods (GET, POST, etc.) here...

                default:
                    res.status(405).json({ success: false, message: 'Method not allowed' });
                    break;
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
