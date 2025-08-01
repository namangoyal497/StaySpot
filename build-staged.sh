#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting staged build process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --only=production
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm ci --only=production

# Set environment variables for ultra-minimal build
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--max-old-space-size=1024"
export CI=false
export DISABLE_ESLINT_PLUGIN=true
export SKIP_PREFLIGHT_CHECK=true

# Clean npm cache
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Build with ultra-minimal memory usage
echo "🔨 Building client with 1GB memory..."
npm run build:ultra

echo "✅ Staged build completed successfully!" 