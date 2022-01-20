const withTM = require("@module-federation/next-transpile-modules")([
  "@gitopia/gitopia-js",
  "react-syntax-highlighter",
]); // pass the modules you would like to see transpiled

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withTM({
    webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
      // ${previousConfig...}

      if (!dev && !isServer) {
        config.plugins.push(
          new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/)
        );
      }

      return config;
    },
    poweredByHeader: false,
    productionBrowserSourceMaps: process.env.ANALYZE === "true",
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      return {
        "/": { page: "/" },
        "/home": { page: "/home" },
        "/design": { page: "/design" },
        "/season-of-blockchains": { page: "/season-of-blockchains" },
      };
    },
    images: {
      loader: "imgix",
      path: process.env.NEXT_PUBLIC_IMAGES_URL,
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
  })
);
