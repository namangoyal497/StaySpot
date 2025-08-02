#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting lightweight build process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm ci --only=production
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm ci --only=production

# Set environment variables for minimal build
export GENERATE_SOURCEMAP=false
export NODE_OPTIONS="--max-old-space-size=2048"
export CI=false
export DISABLE_ESLINT_PLUGIN=true

# Clean npm cache
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Build with minimal memory usage
echo "🔨 Building client with 2GB memory..."
npm run build:light

echo "✅ Lightweight build completed successfully!" 