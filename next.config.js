module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/landing": { page: "/landing" },
    };
  },
  images: {
    loader: "imgix",
    path: "https://example.com/myaccount/",
  },
};
