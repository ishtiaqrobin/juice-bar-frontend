/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        "http://localhost:5000",
        "http://localhost:3000",
        "http://192.168.0.177:5000",
        "http://192.168.0.177:3000"
    ],

    experimental: {
        serverActions: {
            bodySizeLimit: "5mb", // তোমার max file size অনুযায়ী
        },
    },

    images: {
        unoptimized: true, // Allow query strings for cache-busting
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            // accept any domains
            { protocol: "https", hostname: "*" },
            { protocol: "http", hostname: "*" },
        ]
    }
};

export default nextConfig;

