const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'SushiScan',
    executableName: 'SushiScan',
    // Pas d'icône pour éviter les erreurs
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'SushiScan',
        setupExe: 'SushiScan-Setup.exe',
        // Pas d'icône pour l'installateur pour éviter les erreurs
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'darwin'],
      config: {
        name: 'SushiScan-Portable'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: 'sushiscan',
        productName: 'SushiScan',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        name: 'sushiscan',
        productName: 'SushiScan',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
