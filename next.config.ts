import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@genkit-ai/core',
      '@genkit-ai/ai',
      '@genkit-ai/flow',
      '@genkit-ai/googleai',
      '@genkit-ai/firebase',
      '@opentelemetry/exporter-jaeger',
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // List of problematic dependencies to externalize
    const externalDeps = [
      '@opentelemetry/exporter-jaeger',
      '@genkit-ai/firebase',
      '@genkit-ai/core',
      '@genkit-ai/ai',
      '@genkit-ai/flow',
      '@genkit-ai/googleai',
      'jaeger-client',
      'firebase-admin',
      'firebase-functions',
    ];

    // Handle fallbacks for client-side
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Mark dependencies as external
    config.externals = config.externals || [];
    
    if (isServer) {
      // For server-side, externalize these dependencies
      externalDeps.forEach(dep => {
        config.externals.push({
          [dep]: `commonjs ${dep}`
        });
      });
    } else {
      // For client-side, set fallbacks to false
      externalDeps.forEach(dep => {
        config.resolve.fallback[dep] = false;
      });
    }
    
    return config;
  },
};

export default nextConfig;
