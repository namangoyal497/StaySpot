#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting optimized build process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --only=production
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm ci --only=production

# Set environment variables for build
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--max-old-space-size=8192"
export CI=false

# Clean npm cache to free memory
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Build with increased memory and optimizations
echo "🔨 Building client with 8GB memory..."
npm run build:prod

echo "✅ Build completed successfully!" 