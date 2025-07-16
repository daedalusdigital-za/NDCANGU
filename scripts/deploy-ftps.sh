#!/bin/bash

# FTPS Deployment Script for NDCANGU Angular App
# This script deploys the built Angular app to Azure Web App using FTPS

set -e

echo "🚀 Starting FTPS deployment to Azure Web App"
echo "============================================"

# Configuration
FTPS_HOST="waws-prod-blu-443.ftp.azurewebsites.windows.net"
FTPS_USER="NdCanduAngular\\\$NdCanduAngular"
FTPS_PASS="qhzX7hw4fCdNPujqLlpEcWvZp18pPPgdeDmoQ0qD5T3sztleKmgkDzzKl3dt"
FTPS_PATH="/site/wwwroot"
LOCAL_BUILD_PATH="./dist/ncd-poc-ng"
APP_URL="https://ndcanduangular.azurewebsites.net"

# Check if build directory exists
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "❌ Build directory not found: $LOCAL_BUILD_PATH"
    echo "Please run: npm run build -- --configuration production"
    exit 1
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "📦 Installing lftp..."
    if command -v brew &> /dev/null; then
        brew install lftp
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y lftp
    else
        echo "❌ Please install lftp manually"
        exit 1
    fi
fi

echo "🔗 Connecting to Azure Web App via FTPS..."
echo "   Host: $FTPS_HOST"
echo "   User: NdCanduAngular\\\$NdCanduAngular"
echo "   Path: $FTPS_PATH"
echo ""

# Create LFTP script
cat > /tmp/deploy_script.lftp << EOF
set ftps:initial-prot "";
set ftp:ssl-force true;
set ftp:ssl-protect-data true;
set ssl:verify-certificate false;
open ftps://$FTPS_USER:$FTPS_PASS@$FTPS_HOST;
cd $FTPS_PATH;
mirror --reverse --delete --verbose --exclude-glob=LogFiles/ --exclude-glob=App_Data/ $LOCAL_BUILD_PATH ./;
quit;
EOF

# Execute deployment
echo "📤 Uploading files to Azure Web App..."
lftp -f /tmp/deploy_script.lftp

# Clean up
rm -f /tmp/deploy_script.lftp

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Your app is available at: $APP_URL"
echo ""
echo "📋 Next steps:"
echo "1. Visit $APP_URL to verify the deployment"
echo "2. Check the Azure portal for any deployment logs"
echo "3. If needed, restart the web app from the Azure portal"
echo ""
echo "🎉 Deployment complete!"
