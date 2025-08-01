const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting memory-optimized build for Render...');

// Set environment variables for memory optimization
process.env.GENERATE_SOURCEMAP = 'false';
process.env.NODE_OPTIONS = '--max-old-space-size=256';
process.env.CI = 'false';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.INLINE_RUNTIME_CHUNK = 'false';
process.env.FAST_REFRESH = 'false';

try {
  console.log('Building React app with memory optimizations...');
  execSync('npx react-scripts build', { 
    stdio: 'inherit',
    env: process.env
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 