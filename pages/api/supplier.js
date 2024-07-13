import dbConnect from '@/mongoose/mongodbUser';
import Supplier from '@/model/supplier';
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const handler = nextConnect();



handler.use(upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'documents[panCard]', maxCount: 1 },
    { name: 'documents[aadhar]', maxCount: 1 },
    { name: 'documents[gst]', maxCount: 1 },
    { name: 'documents[cancelledCheck]', maxCount: 1 },
    { name: 'documents[registrationCertificate]', maxCount: 1 },
    { name: 'documents[productCertificate]', maxCount: 1 },
]));

handler.get(async (req, res) => {
    await dbConnect();

    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching suppliers' });
    }
});

handler.post(async (req, res) => {
    await dbConnect();

    try {
        const {
            representativeName,
            contact,
            companyName,
            location,
            address,
            mapLink,
            materialType,
            annualTurnover,
            numberOfEmployees,
            relationshipLevel,
            relationshipYears,
            inHouseLogistics,
        } = req.body;

        const newSupplier = new Supplier({
            representativeName,
            contact,
            companyName,
            location,
            address,
            mapLink,
            materialType,
            annualTurnover,
            numberOfEmployees,
            relationshipLevel,
            relationshipYears,
            inHouseLogistics,
            profilePicture: req.files['profilePicture'][0].path,
            documents: {
                panCard: req.files['documents[panCard]'][0].path,
                aadhar: req.files['documents[aadhar]'][0].path,
                gst: req.files['documents[gst]'][0].path,
                cancelledCheck: req.files['documents[cancelledCheck]'][0].path,
                registrationCertificate: req.files['documents[registrationCertificate]'][0].path,
                productCertificate: req.files['documents[productCertificate]'][0].path,
                bankDetails: {
                    accountNumber: req.body['documents[bankDetails][accountNumber]'],
                    ifsc: req.body['documents[bankDetails][ifsc]'],
                    bankName: req.body['documents[bankDetails][bankName]'],
                },
            },
        });

        await newSupplier.save();
        res.status(201).json({ success: true, data: newSupplier });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: 'Error creating supplier' });
    }
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default handler;
