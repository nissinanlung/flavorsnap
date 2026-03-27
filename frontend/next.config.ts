import type { NextConfig } from "next";
import { validateEnvironment, validatedEnv } from "./config/env";

// Validate environment variables at build time
const envValidation = validateEnvironment();
if (!envValidation.valid) {
  console.error("\n❌ Environment Validation Failed:");
  envValidation.errors.forEach(error => {
    console.error(`  • ${error}`);
  });
  throw new Error("Build failed due to invalid environment configuration");
}

// Log warnings if any
if (envValidation.warnings.length > 0) {
  console.warn("\n⚠️  Environment Warnings:");
  envValidation.warnings.forEach(warning => {
    console.warn(`  • ${warning}`);
  });
}

// Import i18n configuration
const { i18n } = require("./next-i18next.config.js");

// Configure PWA with validated environment
// Note: next-pwa is required for this feature, but currently we are focusing on fixing
// the cache invalidation issues. Using StaleWhileRevalidate for images ensures
// they are updated when the underlying data changes.
const withPWA = require("next-pwa")({
  dest: "public",
  disable: !validatedEnv.pwaEnabled || validatedEnv.isDevelopment,
  register: validatedEnv.pwaEnabled,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*\/api\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10, // Ensure we don't wait forever on flaky networks
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|png|gif|webp|svg)$/,
      handler: "StaleWhileRevalidate", // Changed from CacheFirst to fix invalidation issues
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|html)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n,
  
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_API_URL: validatedEnv.apiUrl,
    NEXT_PUBLIC_MODEL_ENDPOINT: validatedEnv.modelEndpoint,
    NEXT_PUBLIC_CONTRACT_ADDRESS: validatedEnv.contractAddress,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: validatedEnv.gaId,
    NEXT_PUBLIC_BUILD_ID: validatedEnv.buildId,
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for API compatibility
  async redirects() {
    return [];
  },

  // Rewrites for API proxying if needed
  async rewrites() {
    if (validatedEnv.isDevelopment) {
      return {
        beforeFiles: [
          {
            source: '/api/:path*',
            destination: `${validatedEnv.apiUrl}/:path*`,
          },
        ],
      };
    }
    return {};
  },
};

export default withPWA(nextConfig);
