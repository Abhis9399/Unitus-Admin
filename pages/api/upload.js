import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = path.join(process.cwd(), 'public', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'documents[panCard]', maxCount: 1 },
  { name: 'documents[aadhar]', maxCount: 1 },
  { name: 'documents[gst]', maxCount: 1 },
  { name: 'documents[cancelledCheck]', maxCount: 1 },
  { name: 'documents[registrationCertificate]', maxCount: 1 },
  { name: 'documents[productCertificate]', maxCount: 1 },
]));

apiRoute.post((req, res) => {
  res.status(200).json({ files: req.files });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;
