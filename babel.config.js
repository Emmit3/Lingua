module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // babel-preset-expo already applies react-native-worklets (Reanimated 4) or
    // react-native-reanimated/plugin — do not add it again here (duplicate breaks runtime).
  };
};
