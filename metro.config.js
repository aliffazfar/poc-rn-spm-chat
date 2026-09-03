const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const { withRozenite } = require('@rozenite/metro')
const { withRozeniteExpoAtlasPlugin } = require('@rozenite/expo-atlas-plugin')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {}

module.exports = async () => {
  const baseConfig = mergeConfig(getDefaultConfig(__dirname), config)

  const getRozeniteConfig = withRozenite(baseConfig, {
    enabled: process.env.WITH_ROZENITE === 'true',
    include: [
      '@rozenite/expo-atlas-plugin',
      '@rozenite/react-navigation-plugin',
      '@rozenite/storage-plugin',
      '@rozenite/tanstack-query-plugin',
    ],
    enhanceMetroConfig: (cfg) => withRozeniteExpoAtlasPlugin(cfg),
  })

  const rozeniteConfig = await getRozeniteConfig()

  return withUniwindConfig(rozeniteConfig, {
    cssEntryFile: './global.css',
    dtsFile: './uniwind-types.d.ts',
  })
}
