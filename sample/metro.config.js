const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pak = require('../package.json');
const exclusionList = require('metro-config/private/defaults/exclusionList').default;
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
    blockList: exclusionList(
      modules.map((m) => path.join(root, 'node_modules', m))
    ),
    extraNodeModules: modules.reduce(
      (acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      },
      // Resolve the library by its package name to the repo root so the
      // sample app loads the local source directly.
      { [pak.name]: root }
    ),
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
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
