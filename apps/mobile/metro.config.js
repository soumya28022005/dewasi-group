const path = require('path');

// Ensure NODE_PATH includes apps/mobile/node_modules so Metro plugins resolve mobile packages
const mobileNodeModules = path.resolve(__dirname, 'node_modules');
if (!process.env.NODE_PATH || !process.env.NODE_PATH.includes(mobileNodeModules)) {
  process.env.NODE_PATH = [
    mobileNodeModules,
    process.env.NODE_PATH || '',
  ].filter(Boolean).join(path.delimiter);
  require('module').Module._initPaths();
}

const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro resolve mobile workspace packages first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Directly resolve assetPlugins to absolute paths so worker processes find them
if (config.transformer && Array.isArray(config.transformer.assetPlugins)) {
  config.transformer.assetPlugins = config.transformer.assetPlugins.map((plugin) => {
    try {
      return require.resolve(plugin, { paths: [projectRoot] });
    } catch {
      return plugin;
    }
  });
}

// 4. Prevent hierarchical lookup from picking up root React Native mismatches
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
