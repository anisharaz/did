/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            }
        ],
        dangerouslyAllowSVG: true,
    }
};

export default nextConfig;
