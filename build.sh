#!/bin/bash

# Build script for StaySpot deployment
echo "🚀 Starting StaySpot build process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install --production=false

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client && npm install --production=false

# Build React app with increased memory
echo "🔨 Building React app..."
export NODE_OPTIONS="--max-old-space-size=4096"
export GENERATE_SOURCEMAP=false
npm run build

echo "✅ Build completed successfully!" 