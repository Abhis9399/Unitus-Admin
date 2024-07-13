const { createServer } = require('http');
const next = require('next');
const cors = require('cors'); // Import CORS

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = 3001;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Use CORS for all requests
    cors({
      origin: 'https://unitus-admin-1cjcvqq51-abhishek-dahiwals-projects.vercel.app/', // Replace with your Vercel deployment URL
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    })(req, res, () => {
      handle(req, res);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
