const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pak = require('../package.json');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const modules = Object.keys({
  ...pak.peerDependencies,
});

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  resolver: {
    blacklistRE: exclusionList(
      modules.map((m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`))
    ),
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'], //add here
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [root],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
