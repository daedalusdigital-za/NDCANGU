@echo off
echo 🚀 Starting Azure deployment process...

REM Check for uncommitted changes
git status --porcelain > temp_status.txt
set /p git_status= < temp_status.txt
del temp_status.txt

if not "%git_status%"=="" (
    echo 📝 Found uncommitted changes. Staging all changes...
    git add .
    
    set /p commit_message="Enter commit message (or press Enter for default): "
    if "%commit_message%"=="" set commit_message=Deploy to Azure - %date% %time%
    
    echo 💾 Committing changes...
    git commit -m "%commit_message%"
) else (
    echo ✅ No uncommitted changes found.
)

REM Build the application locally to check for errors
echo 🔨 Building application locally...
call npm run build --prod

if %errorlevel% neq 0 (
    echo ❌ Local build failed. Please fix the errors before deploying.
    pause
    exit /b 1
)

echo ✅ Local build successful!

REM Push to remote repository to trigger deployment
echo 🚀 Pushing to remote repository...
git push origin develop

if %errorlevel% neq 0 (
    echo ❌ Push failed. Please check your connection and try again.
    pause
    exit /b 1
)

echo ✅ Push successful!
echo 🌐 GitHub Actions workflow will now deploy to Azure.
echo 📊 You can monitor the deployment at: https://github.com/daedalusdigital-za/NDCANGU/actions
echo 🎯 Your app will be available at: https://ndcangu.azurewebsites.net
echo 🎉 Deployment process initiated successfully!
pause
