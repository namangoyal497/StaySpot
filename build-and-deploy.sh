#!/bin/bash

echo "Building React app locally for Render deployment..."

# Navigate to client directory
cd client

# Install dependencies
npm install

# Build the app with minimal memory usage
echo "Building with minimal memory usage..."
npm run build:render

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Build files are in client/build/"
    echo "You can now deploy these files to Render."
else
    echo "Build failed. Trying alternative build method..."
    npm run build:render-custom
fi 