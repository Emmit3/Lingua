const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

const withNativeWindConfig = withNativeWind(config, { input: './global.css' });

// NativeWind (react-native-css-interop) subpath: Metro/Expo static web render can fail to
// resolve `react-native-css-interop/jsx-runtime` on some setups (blank web + "pipe to closed stream").
const origResolve = withNativeWindConfig.resolver.resolveRequest;
withNativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native-css-interop/jsx-runtime' ||
    moduleName === 'react-native-css-interop/jsx-dev-runtime'
  ) {
    try {
      return { filePath: require.resolve(moduleName), type: 'sourceFile' };
    } catch {
      // fall through
    }
  }
  if (origResolve) {
    return origResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWindConfig;
