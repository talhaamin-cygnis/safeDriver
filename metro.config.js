const { getDefaultConfig } = require("@expo/metro-config");
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.resolver.sourceExts.push("cjs");
  module.exports = defaultConfig;
  const { assetExts } = defaultConfig.resolver;
  return {
    resolver: {
      // Add bin to assetExts
      assetExts: [...assetExts, "bin"],
    },
  };
})();
