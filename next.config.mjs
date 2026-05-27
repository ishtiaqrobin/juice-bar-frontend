/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    async rewrites() {
        return [
            {
                // NEXT_PUBLIC_AUTH_URL is already https://...api/auth
                // so destination must be NEXT_PUBLIC_AUTH_URL/:path*
                // NOT NEXT_PUBLIC_AUTH_URL/api/auth/:path* (that doubles the path!)
                source: "/api/auth/:path*",
                destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/:path*`
            },
        ];
    },

    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ]
    }
};

export default nextConfig;

