const { createServer } = require('http');
const next = require('next');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors({
    origin: 'https://unitus-admin-1cjcvqq51-abhishek-dahiwals-projects.vercel.app', // Replace with your Vercel deployment URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  }));
  server.use(express.json());

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URL_USER, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Handle all Next.js pages and API routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
