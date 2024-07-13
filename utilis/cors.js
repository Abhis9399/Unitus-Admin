// utils/cors.js
const cors = require('cors');

const corsOptions = {
    origin: 'https://unitus-admin.vercel.app', // Change to your production domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
