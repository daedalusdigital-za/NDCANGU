# Azure Web App Deployment Recovery Guide

## Issue Description
The deployment is failing with the error: `getaddrinfo ENOTFOUND ndcangu.scm.azurewebsites.net`

This indicates that the Azure Web App either doesn't exist or has been deleted.

## Solution Steps

### Option 1: Recreate Azure Web App using Azure CLI (Recommended)

1. **Run the setup script:**
   ```bash
   ./scripts/setup-azure-webapp.sh
   ```

2. **Follow the script prompts** to create:
   - Resource Group
   - App Service Plan
   - Web App
   - Deployment configuration

3. **Update GitHub Secrets:**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Update or create the secret: `AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91`
   - Paste the publish profile XML content from the generated file

### Option 2: Manual Setup via Azure Portal

1. **Create Azure Web App:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new Web App with these settings:
     - Resource Group: `ndcangu-rg` (or create new)
     - Name: `ndcangu`
     - Runtime: `Node 18 LTS`
     - Operating System: `Linux`
     - Region: `East US`
     - Pricing Plan: `Basic B1`

2. **Configure for Angular:**
   - In the Web App settings, go to Configuration
   - Add Application Setting:
     - Name: `WEBSITE_NODE_DEFAULT_VERSION`
     - Value: `18.17.0`
   - Set Startup Command: `pm2 serve --spa --name ndcangu --port 8080 .`

3. **Get Publish Profile:**
   - In the Web App overview, click "Get publish profile"
   - Download the file
   - Copy its contents to GitHub Secrets

### Option 3: Alternative App Names

If `ndcangu` is taken, try these alternatives:
- `ndcangu-app`
- `ndcangu-portal`
- `ndcangu-web`
- `ndcangu-dashboard`

Update the workflow file with the new app name:

```yaml
with:
  app-name: 'YOUR_NEW_APP_NAME'
  slot-name: 'Production'
  publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91 }}
  package: .
```

## Testing the Deployment

After setup, test the deployment:

1. **Check DNS resolution:**
   ```bash
   nslookup YOUR_APP_NAME.azurewebsites.net
   ```

2. **Test the deployment endpoint:**
   ```bash
   ping YOUR_APP_NAME.scm.azurewebsites.net
   ```

3. **Trigger deployment:**
   ```bash
   git add .
   git commit -m "trigger deployment after Azure Web App recreation"
   git push origin develop
   ```

## Troubleshooting

### Common Issues:

1. **App name already taken:**
   - Try different app names
   - Check Azure naming conventions

2. **Insufficient permissions:**
   - Ensure you have Contributor access to the subscription
   - Check Azure Active Directory permissions

3. **Publish profile issues:**
   - Regenerate publish profile from Azure Portal
   - Update GitHub secret with new profile

4. **Build issues:**
   - Ensure the build completes successfully locally
   - Check Angular configuration for production builds

### Verification Steps:

1. **Azure Portal Check:**
   - Verify the Web App exists in Azure Portal
   - Check the deployment center for any errors
   - Review activity logs

2. **GitHub Actions Check:**
   - Verify the secret exists and is correctly formatted
   - Check workflow logs for detailed error messages
   - Ensure the artifact upload/download works

3. **Local Testing:**
   - Run production build locally: `npm run build -- --configuration production`
   - Test the dist folder contents
   - Verify all dependencies are installed

## Resources

- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

## Next Steps

1. Choose one of the options above
2. Execute the setup process
3. Update GitHub secrets
4. Test the deployment
5. Monitor the application

The deployment should work once the Azure Web App is properly configured and the GitHub secrets are updated.
