const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const path = require('path');

module.exports = withBundleAnalyzer(
  {
    webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {

      if (!dev && !isServer) {
        config.plugins.push(
          new webpack.IgnorePlugin(
          {
            resourceRegExp: /^\.\/wordlists\/(?!english)/,
            contextRegExp: /bip39\/src$/,
          })
        );
      }
      
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
      ];
    },
  }
);
