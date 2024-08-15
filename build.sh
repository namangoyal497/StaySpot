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
export NODE_OPTIONS="--max-old-space-size=12288"
export CI=false
export DISABLE_ESLINT_PLUGIN=true

# Clean npm cache to free memory
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Remove node_modules and reinstall for clean build
echo "🧹 Cleaning node_modules..."
rm -rf node_modules package-lock.json

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm ci --only=production

# Build with maximum memory
echo "🔨 Building client with 12GB memory..."
npm run build:prod

echo "✅ Build completed successfully!" 