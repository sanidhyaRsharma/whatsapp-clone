/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {hostname: "adorable-sardine-335.convex.cloud"},
            {hostname: "oaidalleapiprodscus.blob.core.windows.net"},
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
