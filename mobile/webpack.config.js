const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  const sharedPath = path.resolve(__dirname, '../shared');
  const sharedPathNormalized = sharedPath.replace(/\\/g, '/');
  
  // Add alias for expo-status-bar shim and react-native Slider
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'expo-status-bar': require.resolve('./src/utils/statusBarShim.web.js'),
    '@shared': path.resolve(__dirname, '../shared'),
    // Web-compatible Slider - only on web platform
    ...(env.platform === 'web' ? {
      'react-native$': require.resolve('react-native-web'),
    } : {}),
  };
  
  // Ensure shared directory and parent directory are in module resolution
  if (!config.resolve.modules) {
    config.resolve.modules = ['node_modules'];
  }
  // Add parent directory to module resolution (for ../shared paths)
  const parentDir = path.resolve(__dirname, '..');
  if (!config.resolve.modules.includes(parentDir)) {
    config.resolve.modules.push(parentDir);
  }
  
  // Add web-specific module resolution for react-native components
  if (env.platform === 'web') {
    // Add .web.tsx/.web.ts extensions for web-specific implementations
    if (!config.resolve.extensions) {
      config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js'];
    }
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      ...config.resolve.extensions,
    ];
  }
  
  // Parent directory already added to module resolution above
  
  // Add fallbacks for webpack hot modules and babel runtime
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    'webpack/hot/log.js': false,
    'webpack/hot/emitter.js': false,
  };
  
  // Ensure @babel/runtime is resolved correctly
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  
  // Add @babel/runtime helpers resolution
  config.resolve.alias['@babel/runtime'] = path.resolve(__dirname, 'node_modules/@babel/runtime');
  
  // Fix Buffer MIME error - suppress null buffer warnings
  // This is a known issue with Expo webpack and asset handling
  if (config.ignoreWarnings) {
    config.ignoreWarnings.push(/Could not find MIME for Buffer/);
  } else {
    config.ignoreWarnings = [/Could not find MIME for Buffer/];
  }
  
  // CRITICAL: Add explicit rule for shared directory TypeScript files FIRST
  // This must come BEFORE other rules to take precedence
  if (!config.module.rules) {
    config.module.rules = [];
  }
  
  // Find babel-loader configuration from existing rules
  let babelLoaderOptions = null;
  for (const rule of config.module.rules) {
    if (rule.use) {
      const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
      for (const use of uses) {
        if (typeof use === 'object' && use.loader) {
          const loaderStr = typeof use.loader === 'string' ? use.loader : '';
          if (loaderStr.includes('babel-loader')) {
            babelLoaderOptions = use.options || {};
            break;
          }
        }
      }
      if (babelLoaderOptions) break;
    }
  }
  
  // Use babel.config.js - babel-loader will find it automatically
  // If we found existing babel options, use them, otherwise use defaults
  const finalBabelOptions = babelLoaderOptions || {
    cacheDirectory: true,
    // babel-loader will automatically find babel.config.js in project root
  };
  
  // Add explicit rule for shared directory - must be FIRST in rules array
  // This ensures shared TypeScript files are processed by babel-loader
  config.module.rules.unshift({
    test: /\.tsx?$/,
    include: [sharedPath],
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        ...finalBabelOptions,
        // Ensure babel.config.js is found (babel-loader searches from file location up)
        rootMode: 'upward',
      },
    },
  });
  
  // Now modify existing rules to NOT exclude shared directory (fallback)
  if (config.module && config.module.rules) {
    config.module.rules.forEach((rule, index) => {
      // Skip the rule we just added
      if (index === 0 && rule.test && rule.test.toString().includes('tsx?')) {
        return;
      }
      
      if (rule.test) {
        const testStr = rule.test.toString();
        const isTSRule = testStr.includes('tsx?') || testStr.includes('jsx?');
        
        if (isTSRule) {
          // Remove exclude for shared directory
          if (rule.exclude) {
            const originalExclude = rule.exclude;
            rule.exclude = (filePath) => {
              if (!filePath) {
                if (typeof originalExclude === 'function') {
                  return originalExclude(filePath);
                }
                return false;
              }
              const normalized = String(filePath).replace(/\\/g, '/');
              // Don't exclude shared directory - let explicit rule handle it
              if (normalized.includes(sharedPathNormalized)) {
                return false;
              }
              // Apply original exclude for other files
              if (typeof originalExclude === 'function') {
                return originalExclude(filePath);
              } else if (originalExclude instanceof RegExp) {
                return originalExclude.test(filePath);
              } else if (Array.isArray(originalExclude)) {
                return originalExclude.some(ex => {
                  if (typeof ex === 'function') return ex(filePath);
                  if (ex instanceof RegExp) return ex.test(filePath);
                  return false;
                });
              }
              return false;
            };
          }
        }
      }
    });
  }
  
  // Exclude shared directory from source-map-loader ONLY
  if (config.module && config.module.rules) {
    config.module.rules.forEach((rule) => {
      if (rule.enforce === 'pre' && rule.use) {
        const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
        const hasSourceMapLoader = uses.some(
          use => {
            const loaderStr = typeof use === 'string' ? use : (use.loader || '');
            return loaderStr.includes('source-map-loader');
          }
        );
        
        if (hasSourceMapLoader) {
          const originalExclude = rule.exclude;
          rule.exclude = (filePath) => {
            if (!filePath) return false;
            const normalized = String(filePath).replace(/\\/g, '/');
            if (normalized.includes(sharedPathNormalized)) {
              return true; // Exclude shared directory from source-map-loader
            }
            // Apply original exclude
            if (originalExclude) {
              if (typeof originalExclude === 'function') {
                return originalExclude(filePath);
              } else if (originalExclude instanceof RegExp) {
                return originalExclude.test(filePath);
              }
            }
            return false;
          };
        }
      }
    });
  }
  
  return config;
};
