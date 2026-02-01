/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
        // Allow base64 images (data URLs) for database-stored images
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // Disable image optimization for base64 data URLs
        unoptimized: false,
        // Allow data URLs
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
}

module.exports = nextConfig
