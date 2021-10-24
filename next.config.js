const withTM = require("@module-federation/next-transpile-modules")([
  "gitopiajs",
  "react-syntax-highlighter",
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  webpack(config, { dev, isServer }) {
    // ${previousConfig...}

    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/home": { page: "/home" },
      "/design": { page: "/design"},
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
    ];
  },
});
