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
      },
      {
        source: "/api/objects/:path*",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/objects/:path*",
      },
      {
        source: "/api/diff",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/diff",
      },
      {
        source: "/api/pull/diff",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/diff",
      },
      {
        source: "/api/fork",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/fork",
      },
      {
        source: "/api/pull/merge",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/merge",
      },
      {
        source: "/api/pull/commits",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/commits",
      },
      {
        source: "/api/pull/check",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/check",
      },
      {
        source: "/api/content",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/content",
      },
      {
        source: "/api/commits/:path*",
        destination: process.env.NEXT_PUBLIC_OBJECTS_URL + "/commits/:path*",
      },
      {
        source: "/api/ibc/all-assets",
        destination:
          process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
          (process.env.NEXT_PUBLIC_NETWORK_TYPE === "mainnet"
            ? "/gitopia/gitopia.json"
            : "/gitopia-janus-devnet-4/gitopia.json"),
      },
      {
        source: "/api/ibc/:chain/bridge/:otherChain",
        destination:
          process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
          "/chain-registry/_IBC/:chain-:otherChain.json",
      },
      {
        source: "/api/ibc/:chain/assets",
        destination:
          process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
          (process.env.NEXT_PUBLIC_NETWORK_TYPE === "mainnet"
            ? "/chain-registry/:chain/assetlist.json"
            : "/chain-registry/testnets/:chain/assetlist.json"),
      },
      {
        source: "/api/ibc/:chain/info",
        destination:
          process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
          (process.env.NEXT_PUBLIC_NETWORK_TYPE === "mainnet"
            ? "/chain-registry/:chain/chain.json"
            : "/chain-registry/testnets/:chain/chain.json"),
      },
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
