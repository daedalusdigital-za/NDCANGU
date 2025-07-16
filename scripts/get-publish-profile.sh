#!/bin/bash

# Script to get the correct Azure publish profile
# This script will help you retrieve the actual publish profile from Azure

echo "🔍 Getting Azure Web App publish profile..."
echo "=========================================="

APP_NAME="NdCanduAngular"
RESOURCE_GROUP="ndcangu-rg"  # Adjust if different

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    echo ""
    echo "🔄 Alternative: Download manually from Azure Portal:"
    echo "   1. Go to https://portal.azure.com"
    echo "   2. Search for 'NdCanduAngular' app service"
    echo "   3. Click 'Get publish profile' at the top"
    echo "   4. Use the downloaded XML content as your GitHub secret"
    exit 1
fi

# Login to Azure
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please login to Azure:"
    az login
fi

echo "📋 App Details:"
echo "   App Name: $APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo ""

# Try to get the publish profile
echo "🔍 Searching for the app..."
APP_EXISTS=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "name" -o tsv 2>/dev/null)

if [ -z "$APP_EXISTS" ]; then
    echo "⚠️  App not found with resource group '$RESOURCE_GROUP'"
    echo "🔍 Searching in all resource groups..."
    
    # Search in all resource groups
    ALL_APPS=$(az webapp list --query "[?name=='$APP_NAME'].{name:name, resourceGroup:resourceGroup}" -o table)
    
    if [ -z "$ALL_APPS" ]; then
        echo "❌ App '$APP_NAME' not found in any resource group"
        echo ""
        echo "🔄 Please check:"
        echo "   1. App name is correct"
        echo "   2. You have access to the subscription"
        echo "   3. The app exists in Azure Portal"
        exit 1
    else
        echo "✅ Found app(s):"
        echo "$ALL_APPS"
        echo ""
        echo "📝 Please update the RESOURCE_GROUP variable in this script"
        exit 1
    fi
fi

echo "✅ App found: $APP_NAME"
echo "🔑 Getting publish profile..."

# Get the publish profile
az webapp deployment list-publishing-profiles \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --xml > "azure-publish-profile.xml"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Publish profile downloaded successfully!"
    echo "📄 File saved as: azure-publish-profile.xml"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the contents of 'azure-publish-profile.xml'"
    echo "2. Go to GitHub → Settings → Secrets and variables → Actions"
    echo "3. Update: AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91"
    echo "4. Paste the XML content from the file"
    echo "5. Push your code to trigger deployment"
    echo ""
    echo "🔍 Preview of the publish profile:"
    head -10 azure-publish-profile.xml
    echo "..."
else
    echo "❌ Failed to get publish profile"
    echo "🔄 Alternative: Download manually from Azure Portal"
    exit 1
fi
