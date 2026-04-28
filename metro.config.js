const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = mergeConfig(config, {
  watchFolders: [
    path.resolve(__dirname, 'node_modules/react-native-country-picker-modal'),
  ],
  resolver: {
    assetExts: [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif'],
  },
});