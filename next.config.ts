import { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';

// Define the type for the user config import
interface UserConfig extends Partial<NextConfig> { }

// Check if user config exists synchronously
let userConfig: UserConfig | undefined = undefined;
try {
    // Use require instead of import for synchronous loading
    // This is a common pattern in Next.js config files
    if (fs.existsSync(path.join(process.cwd(), 'v0-user-next.config.js'))) {
        userConfig = require('./v0-user-next.config');
    }
} catch (e) {
    // ignore error
    console.log('No user config found or error loading it');
}

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        webpackBuildWorker: true,
        parallelServerBuildTraces: true,
        parallelServerCompiles: true,
    },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig: NextConfig, userConfig?: UserConfig): void {
    if (!userConfig) {
        return;
    }

    for (const key in userConfig) {
        if (
            typeof nextConfig[key as keyof NextConfig] === 'object' &&
            !Array.isArray(nextConfig[key as keyof NextConfig])
        ) {
            nextConfig[key as keyof NextConfig] = {
                ...nextConfig[key as keyof NextConfig],
                ...userConfig[key as keyof UserConfig],
            } as any;
        } else {
            (nextConfig as any)[key] = userConfig[key as keyof UserConfig];
        }
    }
}

export default nextConfig; 