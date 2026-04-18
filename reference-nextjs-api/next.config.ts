import path from 'node:path';
import type { NextConfig } from 'next';

/** Keep file tracing inside this package (nested under Lingua monorepo). */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
