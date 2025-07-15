# Azure Deployment Guide for NDCANGU

This guide explains how to deploy the NDCANGU Angular application to Azure using GitHub Actions.

## Prerequisites

- GitHub repository with Azure Web App configured
- Azure App Service publish profile configured in GitHub Secrets
- Node.js 18.x installed locally (updated from 16.x)

## Latest Updates (Privacy Policy & Modern UI)

### Recent Features Added
- ✅ Modern privacy policy popup component
- ✅ Enhanced login page with blue gradient theme
- ✅ Forgot password functionality
- ✅ Improved terms of service popup
- ✅ Responsive design optimizations
- ✅ PrimeNG dialog integration

### Deployment Improvements
- ✅ Updated to Node.js 18.x for better performance
- ✅ Optimized build process with npm ci
- ✅ Fixed artifact path for Angular build output
- ✅ Added local testing script (deploy-test.sh)

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The application is configured for automatic deployment when you push to the `develop` branch.

1. Make your changes
2. Commit and push to develop branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin develop
   ```

3. GitHub Actions will automatically:
   - Build the application
   - Run tests
   - Deploy to Azure

### Method 2: Using Deployment Scripts

#### For macOS/Linux users:
```bash
./deploy.sh
```

#### For Windows users:
```batch
deploy.bat
```

These scripts will:
- Check for uncommitted changes
- Build the application locally
- Push to GitHub (triggering deployment)
- Provide status updates

## Monitoring Deployment

1. **GitHub Actions**: Monitor deployment progress at:
   https://github.com/daedalusdigital-za/NDCANGU/actions

2. **Azure Portal**: Check deployment logs in your Azure Web App

3. **Live Application**: Access your deployed app at:
   https://ndcangu.azurewebsites.net

## Configuration Files

- `.github/workflows/develop_ndcangu.yml` - GitHub Actions workflow
- `src/web.config` - Azure web server configuration
- `angular.json` - Angular build configuration

## Build Configuration

The application builds with:
- Production optimizations enabled
- Output directory: `dist/ncd-poc-ng`
- Angular routing support for Azure
- Static asset optimization

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check for TypeScript errors or missing dependencies
2. **Deployment Fails**: Verify GitHub secrets are properly configured
3. **Routing Issues**: Ensure `web.config` is included in build assets

### Checking Logs:

1. GitHub Actions logs: Available in the Actions tab
2. Azure logs: Available in Azure Portal → App Service → Log stream

## Environment Variables

Configure environment-specific settings in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Security

- Never commit sensitive information
- Use GitHub Secrets for deployment credentials
- Regularly update dependencies

## Support

For deployment issues, check:
1. GitHub Actions logs
2. Azure deployment logs
3. Application error logs in Azure Portal
