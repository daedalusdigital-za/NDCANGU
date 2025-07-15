#!/bin/bash

# Azure Deployment Script for NDCANGU Angular Application
# This script builds and deploys the application to Azure

echo "🚀 Starting Azure deployment process..."

# Check if we're on the develop branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "⚠️  Warning: You're not on the develop branch. Current branch: $current_branch"
    echo "The deployment workflow is configured to trigger on pushes to develop branch."
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ $(git status --porcelain) ]]; then
    echo "📝 Found uncommitted changes. Staging all changes..."
    git add .
    
    # Prompt for commit message
    read -p "Enter commit message (or press Enter for default): " commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Deploy to Azure - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    echo "💾 Committing changes..."
    git commit -m "$commit_message"
else
    echo "✅ No uncommitted changes found."
fi

# Build the application locally to check for errors
echo "🔨 Building application locally..."
npm run build --prod

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed. Please fix the errors before deploying."
    exit 1
fi

# Push to remote repository to trigger deployment
echo "🚀 Pushing to remote repository..."
git push origin develop

if [ $? -eq 0 ]; then
    echo "✅ Push successful!"
    echo "🌐 GitHub Actions workflow will now deploy to Azure."
    echo "📊 You can monitor the deployment at: https://github.com/daedalusdigital-za/NDCANGU/actions"
    echo "🎯 Your app will be available at: https://ndcangu.azurewebsites.net"
else
    echo "❌ Push failed. Please check your connection and try again."
    exit 1
fi

echo "🎉 Deployment process initiated successfully!"
