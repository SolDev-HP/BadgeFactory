/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        config.module.rules.push({
            test: /\.m?js$/,
            type: "javascript/auto",
            resolve: { fullySpecified: false },
        });
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.web3modal.com",
                port: "",
            },
        ],
    },
};

export default nextConfig;
