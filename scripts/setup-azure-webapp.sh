#!/bin/bash

# Azure Web App Setup Script for NDCANGU
# This script will help you create a new Azure Web App for your Angular application

set -e

echo "🚀 Setting up Azure Web App for NDCANGU"
echo "======================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login to Azure (if not already logged in)
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please login to Azure:"
    az login
fi

# Variables
RESOURCE_GROUP="ndcangu-rg"
APP_NAME="ndcangu"
LOCATION="East US"
APP_SERVICE_PLAN="ndcangu-plan"
SKU="B1"  # Basic tier

echo "📋 Configuration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   App Name: $APP_NAME"
echo "   Location: $LOCATION"
echo "   Service Plan: $APP_SERVICE_PLAN"
echo "   SKU: $SKU"
echo ""

# Create resource group if it doesn't exist
echo "🏗️  Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan
echo "📦 Creating App Service Plan..."
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku $SKU

# Create Web App
echo "🌐 Creating Web App..."
az webapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "NODE|18-lts"

# Configure Web App for Angular
echo "⚙️  Configuring Web App for Angular..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0"

# Configure deployment settings
echo "🔧 Configuring deployment settings..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --startup-file "pm2 serve --spa --name ndcangu --port 8080 ."

# Get publish profile
echo "🔑 Getting publish profile..."
az webapp deployment list-publishing-profiles \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --xml > publish-profile.xml

echo ""
echo "✅ Azure Web App setup completed!"
echo "🌍 Your app URL: https://$APP_NAME.azurewebsites.net"
echo "🔧 SCM URL: https://$APP_NAME.scm.azurewebsites.net"
echo ""
echo "📄 Next steps:"
echo "1. The publish profile has been saved to 'publish-profile.xml'"
echo "2. Copy the contents of this file"
echo "3. Go to your GitHub repository settings > Secrets and variables > Actions"
echo "4. Create a new secret named: AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91"
echo "5. Paste the publish profile XML content as the value"
echo "6. Push your code to trigger the deployment"
echo ""
echo "🎉 Setup complete! Your Azure Web App is ready for deployment."
