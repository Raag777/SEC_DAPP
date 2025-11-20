# SEC_DAPP

# -------------------------------
# SEC_DAPP Auto Project Generator
# -------------------------------

Write-Host "🚀 Creating SEC_DAPP project structure..."

# Base folder
$base = "C:\Users\ASUS\OneDrive\Desktop\M.TECH\BT\BT_Project\SEC_DAPP"

# 1. Make sure base exists
if (!(Test-Path $base)) {
    New-Item -ItemType Directory -Path $base
}

Set-Location $base

# ----------------------------------
# 2. Create Frontend (Vite + React)
# ----------------------------------
Write-Host "⚡ Setting up frontend-vite..."

npx create-vite@latest frontend-vite --template react
Set-Location "$base/frontend-vite"

npm install
npm install axios react-router-dom framer-motion lucide-react react-qr-code chart.js react-chartjs-2 tailwindcss autoprefixer

npx tailwindcss init -p

# Replace tailwind content rule
(Get-Content tailwind.config.js) `
    -replace "content: \[\]", "content: [`./index.html`, `./src/**/*.{js,jsx}`]" |
    Set-Content tailwind.config.js

Write-Host "🌈 Frontend prepared."

# ----------------------------
# 3. Create Node Backend
# ----------------------------
Set-Location $base
Write-Host "🟦 Setting up backend-node..."

mkdir backend-node
Set-Location "$base/backend-node"

npm init -y

npm install express cors dotenv web3 ethers mongoose nodemon merkle-tools

Write-Host "🛠 Backend-node prepared."

# -------------------------------------------
# 4. Create Hardhat Blockchain (sec-chain)
# -------------------------------------------
Set-Location $base
Write-Host "⛓ Creating Hardhat workspace: sec-chain..."

mkdir sec-chain
Set-Location "$base/sec-chain"

npm init -y
npm install --save-dev hardhat

npx hardhat init --force

Write-Host "📦 Hardhat project ready."

# -------------------------------------------
# DONE
# -------------------------------------------
Write-Host "`n🎉 SEC_DAPP full environment created successfully!"
Write-Host "Frontend: $base/frontend-vite"
Write-Host "Backend:  $base/backend-node"
Write-Host "Chain:     $base/sec-chain"
