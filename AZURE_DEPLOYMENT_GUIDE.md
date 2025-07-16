# Azure Web App Deployment Guide

## Azure Web App Details
- **App Name**: NdCanduAngular
- **URL**: https://ndcanduangular.azurewebsites.net
- **FTPS Endpoint**: ftps://waws-prod-blu-443.ftp.azurewebsites.windows.net/site/wwwroot

## Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Update GitHub Secret:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Update the secret: `AZUREAPPSERVICE_PUBLISHPROFILE_6EB5302C217845A7B20291054DDEDF91`
   - Copy the content from `publish-profile-ndcanduangular.xml`

2. **Trigger deployment:**
   ```bash
   git add .
   git commit -m "feat: Update Azure Web App configuration for NdCanduAngular"
   git push origin develop
   ```

### Option 2: FTPS Direct Deployment

1. **Build the application:**
   ```bash
   npm run build -- --configuration production
   ```

2. **Deploy using FTPS:**
   ```bash
   ./scripts/deploy-ftps.sh
   ```

### Option 3: Manual FTP Upload

Use any FTP client with these credentials:
- **Host**: waws-prod-blu-443.ftp.azurewebsites.windows.net
- **Protocol**: FTPS (FTP over SSL)
- **Username**: NdCanduAngular\$NdCanduAngular
- **Password**: qhzX7hw4fCdNPujqLlpEcWvZp18pPPgdeDmoQ0qD5T3sztleKmgkDzzKl3dt
- **Remote Path**: /site/wwwroot
- **Local Path**: ./dist/ncd-poc-ng

## Verification Steps

1. **Check deployment status:**
   ```bash
   curl -I https://ndcanduangular.azurewebsites.net
   ```

2. **Visit the application:**
   - Open https://ndcanduangular.azurewebsites.net in your browser

3. **Monitor logs:**
   - Check Azure portal → App Services → NdCanduAngular → Log stream

## Troubleshooting

### Common Issues:

1. **Build fails:**
   ```bash
   npm ci
   npm run build -- --configuration production
   ```

2. **FTPS connection issues:**
   - Ensure lftp is installed: `brew install lftp` (macOS)
   - Check firewall settings
   - Verify credentials are correct

3. **App doesn't load:**
   - Check if files are in the correct directory (/site/wwwroot)
   - Verify index.html is present
   - Check Azure App Service logs

4. **Routing issues:**
   - Ensure web.config or .htaccess is configured for Angular routing
   - Check that the app is built for production

### Debug Commands:

```bash
# Test FTPS connection
lftp -c "set ftps:initial-prot \"\"; set ftp:ssl-force true; set ssl:verify-certificate false; open ftps://NdCanduAngular\\$NdCanduAngular:qhzX7hw4fCdNPujqLlpEcWvZp18pPPgdeDmoQ0qD5T3sztleKmgkDzzKl3dt@waws-prod-blu-443.ftp.azurewebsites.windows.net; ls /site/wwwroot; quit"

# Check app status
curl -s -o /dev/null -w "%{http_code}" https://ndcanduangular.azurewebsites.net

# View app logs
az webapp log tail --resource-group <resource-group> --name NdCanduAngular
```

## Next Steps

1. Choose your preferred deployment method
2. Update GitHub secrets if using GitHub Actions
3. Test the deployment
4. Monitor the application

The GitHub Actions workflow has been updated to use the correct app name: `NdCanduAngular`.
