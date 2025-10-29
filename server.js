/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Serve static files from the public directory
    server.use('/public', express.static(path.join(__dirname, 'public')));

    // Handle all routes with Next.js - use regex pattern for catch-all
    server.use((req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on port ${port}`);
    });
});
