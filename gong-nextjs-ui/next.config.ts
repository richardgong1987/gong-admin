import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8899/:path*', // 把 /api 去掉，转发到 Golang 后端
            },
        ]
    },

};

export default nextConfig;
