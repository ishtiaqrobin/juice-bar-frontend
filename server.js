import express from 'express';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Serve static files from the public directory
    server.use(express.static(path.join(__dirname, 'public')));

    // Handle all other routes with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on port ${port}`);
    });
});
