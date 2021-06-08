const withTM = require("@module-federation/next-transpile-modules")([
  "gitopiajs",
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
    };
  },
  images: {
    loader: "imgix",
    path: "http://localhost:3000/",
  },
});
