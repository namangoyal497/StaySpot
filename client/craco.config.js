module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimize for memory usage
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      };
      
      // Disable source maps to save memory
      webpackConfig.devtool = false;
      
      return webpackConfig;
    },
  },
}; 