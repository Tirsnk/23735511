module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@constants': './src/constants',
          '@services': './src/services',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};