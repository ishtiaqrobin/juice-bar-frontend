/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["http://localhost:5000", "http://localhost:3000", "http://192.168.0.177:5000", "http://192.168.0.177:3000"],

    serverActions: {
        bodySizeLimit: "5mb", // Increased from default 1mb to handle large product images
    },

    images: {
        unoptimized: true, // Allow query strings for cache-busting
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },
            { protocol: "https", hostname: "kfc.com.my" },
            { protocol: "https", hostname: "www.friendsjuicebar.com" },
            { protocol: "https", hostname: "backend.friendsjuicebar.com" },
            { protocol: "http", hostname: "backend.friendsjuicebar.com" },
            { protocol: "http", hostname: "localhost" },
            { protocol: "http", hostname: "127.0.0.1" },

            // accept any domains
            { protocol: "https", hostname: "*" },
            { protocol: "http", hostname: "*" },
        ]
    }
};

export default nextConfig;

