#!/bin/bash

# Quick Azure Web App Creation with Alternative Names
# This script tries multiple app names to find an available one

set -e

echo "🔍 Finding available Azure Web App name..."

# Array of possible app names
APP_NAMES=(
    "ndcangu"
    "ndcangu-app"
    "ndcangu-portal"
    "ndcangu-web"
    "ndcangu-dashboard"
    "ndcangu-$(date +%Y%m%d)"
)

RESOURCE_GROUP="ndcangu-rg"
LOCATION="East US"
APP_SERVICE_PLAN="ndcangu-plan"
SKU="B1"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login to Azure
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please login to Azure:"
    az login
fi

# Find available app name
AVAILABLE_APP_NAME=""
for APP_NAME in "${APP_NAMES[@]}"; do
    echo "🔍 Checking availability of: $APP_NAME"
    
    # Check if app name is available
    if az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME &> /dev/null; then
        echo "   ⚠️  $APP_NAME already exists, trying next..."
        continue
    fi
    
    # Check global availability
    if az webapp list --query "[?name=='$APP_NAME']" --output tsv | grep -q "$APP_NAME"; then
        echo "   ⚠️  $APP_NAME is taken globally, trying next..."
        continue
    fi
    
    # Name is available
    AVAILABLE_APP_NAME=$APP_NAME
    echo "   ✅ $APP_NAME is available!"
    break
done

if [ -z "$AVAILABLE_APP_NAME" ]; then
    echo "❌ No available app names found. Please try manual setup."
    exit 1
fi

echo ""
echo "🚀 Creating Azure Web App: $AVAILABLE_APP_NAME"
echo "============================================="

# Create resource group
echo "🏗️  Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION" --output table

# Create App Service Plan
echo "📦 Creating App Service Plan..."
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku $SKU \
    --is-linux \
    --output table

# Create Web App
echo "🌐 Creating Web App..."
az webapp create \
    --name $AVAILABLE_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "NODE|18-lts" \
    --output table

# Configure Web App
echo "⚙️  Configuring Web App for Angular..."

# Set Node.js version
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $AVAILABLE_APP_NAME \
    --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
    --output table

# Configure startup command for Angular SPA
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $AVAILABLE_APP_NAME \
    --startup-file "pm2 serve --spa --name ndcangu --port 8080 ." \
    --output table

# Get publish profile
echo "🔑 Getting publish profile..."
az webapp deployment list-publishing-profiles \
    --resource-group $RESOURCE_GROUP \
    --name $AVAILABLE_APP_NAME \
    --xml > "publish-profile-$AVAILABLE_APP_NAME.xml"

echo ""
echo "✅ Azure Web App created successfully!"
echo "======================================="
echo "📋 Configuration Details:"
echo "   App Name: $AVAILABLE_APP_NAME"
echo "   URL: https://$AVAILABLE_APP_NAME.azurewebsites.net"
echo "   SCM URL: https://$AVAILABLE_APP_NAME.scm.azurewebsites.net"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo ""
echo "📄 Next Steps:"
echo "1. Update your GitHub workflow with the new app name:"
echo "   Edit .github/workflows/develop_ndcangu.yml"
echo "   Change 'app-name' to: '$AVAILABLE_APP_NAME'"
echo ""
echo "2. Update GitHub Secret:"
echo "   - Go to GitHub → Settings → Secrets and variables → Actions"
echo "   - Update: AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91"
echo "   - Use contents from: publish-profile-$AVAILABLE_APP_NAME.xml"
echo ""
echo "3. Test deployment:"
echo "   git add ."
echo "   git commit -m 'Update Azure Web App configuration'"
echo "   git push origin develop"
echo ""
echo "🎉 Setup complete!"

# Display the publish profile location
echo ""
echo "📁 Publish profile saved to: publish-profile-$AVAILABLE_APP_NAME.xml"
echo "📋 App name to use in workflow: $AVAILABLE_APP_NAME"
