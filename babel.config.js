module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@features': './src/features',
          '@shared': './src/shared',
          '@styles': './src/styles',
          '@components': './src/components',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};