#!/bin/bash

# Azure Web App Deployment Script
# This script mimics the deployment process locally for testing

echo "🚀 Starting Azure Web App deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Recommended version is 18.x"
fi

echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ npm ci failed. Please check your package.json and node_modules"
    exit 1
fi

echo "🔨 Building Angular application for production..."
npm run build --configuration production

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check your Angular configuration"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are available in: dist/ncd-poc-ng"
echo "🌐 You can serve the built files locally using:"
echo "   npx http-server dist/ncd-poc-ng -p 8080"
echo ""
echo "🚀 Ready for Azure Web App deployment!"
