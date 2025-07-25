const ContentSecurityPolicy = `
  default-src 'self'; 
  style-src 'self' 'unsafe-inline' unpkg.com;
  script-src 'self' 'unsafe-eval';
  img-src 'self' avatar.oxro.io;
`;

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "",
  },
  /* {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },*/
];

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/wordlists\/(?!english)/,
          contextRegExp: /bip39\/src$/,
        })
      );
    }
    config.cache.buildDependencies.mydeps = ["./yarn.lock"];

    return config;
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.ANALYZE === "true",
  images: {
    loader: "imgix",
    path: process.env.NEXT_PUBLIC_IMAGES_URL,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  ...(process.env.NODE_ENV === "production"
    ? {
      compiler: {
        removeConsole: {
          exclude: ["error"],
        },
        reactRemoveProperties: { properties: ["^data-test$"] },
      },
    }
    : {}),
  async rewrites() {
    return [
      {
        source: "/api/faucet",
        destination: process.env.NEXT_PUBLIC_FAUCET_URL,
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async generateBuildId() {
    const { determineBuildId } = await import("./scripts/build-id.mjs");
    const fs = await import("fs");
    let buildId = await determineBuildId();
    fs.writeFileSync("./seo/build-id", buildId);
    return buildId;
  },
});
