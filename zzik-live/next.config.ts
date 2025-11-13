import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image Optimization */
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Suppress warnings for SVG images with fill
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  /* Performance Optimizations */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  /* Output Configuration for TTFB Optimization */
  output: 'standalone', // Optimized standalone build
  
  /* Generate ETags for better caching */
  generateEtags: true,

  /* Turbopack Configuration (Next.js 16+) */
  turbopack: {
    // Empty config to silence webpack warning
  },

  /* Experimental Features */
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable optimizeCss for faster TTFB
    optimizeCss: true,
    // Enable partial prerendering
    ppr: false, // Will enable when stable
  },

  /* Headers for Security and Performance */
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // CSP configuration: strict for production, relaxed for development
    const cspDirectives = isDev
      ? [
          "default-src 'self'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "img-src 'self' data: blob: https:",
          "media-src 'self' blob: https:",
          "style-src 'self' 'unsafe-inline'",
          // Development: allow unsafe-eval and unsafe-inline for HMR and Next.js dev scripts
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "connect-src 'self' https://*.supabase.co https: ws: wss:",
          "font-src 'self' data:",
          "object-src 'none'",
          "form-action 'self'",
        ]
      : [
          "default-src 'self'",
          "base-uri 'none'",
          "frame-ancestors 'none'",
          "img-src 'self' data: blob: https:",
          "media-src 'self' blob: https:",
          "style-src 'self' 'unsafe-inline'",
          // Production: strict policy with only necessary unsafe-eval for WASM
          "script-src 'self' 'wasm-unsafe-eval'",
          "connect-src 'self' https://*.supabase.co https:",
          "font-src 'self' data:",
          "object-src 'none'",
          "form-action 'self'",
        ];
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
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
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=(), interest-cohort=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
