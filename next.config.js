/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['res.cloudinary.com', 'images.unsplash.com','firebasestorage.googleapis.com']
    }
}

module.exports = nextConfig
