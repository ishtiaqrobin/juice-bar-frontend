// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServer } = require("http");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {
        createServer(async (req, res) => {
            try {
                await handle(req, res);
            } catch (error) {
                console.error("Server error:", error);
                res.statusCode = 500;
                res.end("Internal server error");
            }
        }).listen(port, hostname, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log(`> Ready on http://localhost:${port} (dev=${dev})`);
        });
    })
    .catch((err) => {
        console.error("Failed to start Next.js server:", err);
        process.exit(1);
    });


