# Push Crypto Web App to GitHub main branch
# Run this in PowerShell outside Cursor (e.g. Windows Terminal or PowerShell)
# Close Cursor/VS Code if you get "Permission denied" on .git

Set-Location $PSScriptRoot

# If origin already exists, update it; otherwise add it
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    git remote set-url origin "https://github.com/Thangadurai2830/Crypto-Web-app.git"
} else {
    git remote add origin "https://github.com/Thangadurai2830/Crypto-Web-app.git"
}

git branch -M main
git push -u origin main
