/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },
            { protocol: "https", hostname: "kfc.com.my" },
            { protocol: "https", hostname: "juicebar.hasanalicollege.com" },
            { protocol: "http", hostname: "localhost" },
            { protocol: "http", hostname: "127.0.0.1" },
        ]
    }
};

export default nextConfig;


