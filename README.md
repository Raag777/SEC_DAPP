# SEC_DAPP - Solar Energy Certificate DApp

**A Blockchain-based Platform for Managing Renewable Energy Certificates**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-red)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Documentation](#documentation)
- [Development](#development)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SEC_DAPP** (Solar Energy Certificate Decentralized Application) is a complete blockchain-based platform for digitizing and managing Renewable Energy Certificates (RECs). The system leverages Ethereum smart contracts to provide transparent, immutable, and verifiable certificate lifecycle management from issuance to retirement.

### Problem Statement

Traditional REC systems suffer from:
- ❌ Centralized control and single points of failure
- ❌ Limited transparency and difficult verification
- ❌ High transaction costs due to intermediaries
- ❌ Slow manual processing
- ❌ Risk of double-counting and fraud

### Our Solution

SEC_DAPP uses blockchain technology to provide:
- ✅ **Decentralization**: No single point of control
- ✅ **Transparency**: All transactions publicly verifiable
- ✅ **Cost Efficiency**: Automated smart contracts reduce intermediaries
- ✅ **Instant Settlement**: Real-time blockchain verification
- ✅ **Fraud Prevention**: Smart contract prevents duplicate certificates
- ✅ **Global Access**: Anyone with internet can participate

---

## Key Features

### Core Functionality

🌞 **Multi-Producer Support**
- Multiple solar energy producers can issue certificates
- Each producer sets custom pricing
- Producer-specific labeling (P1, P2, P3...)

🏢 **Multi-Company Operations**
- Companies purchase certificates for carbon offset
- Company-specific ownership tracking (C1, C2, C3...)
- Retirement functionality for claiming environmental benefits

👨‍💼 **Admin Dashboard**
- Register and manage producers/companies
- Configure minimum energy requirements
- Set default pricing policies
- Monitor platform activity

### Advanced Features

🌳 **Merkle Tree Verification**
- Cryptographic proof of certificate authenticity
- O(log n) verification complexity
- Generate proofs for compliance and auditing
- Used in production blockchains (Bitcoin, Ethereum)

📊 **Performance Metrics Dashboard**
- Real-time TPS (transactions per second) monitoring
- Transaction latency tracking
- Block time analysis
- Activity analytics (issued, purchased, retired)
- Auto-refresh every 10 seconds

🔍 **Blockchain Explorer**
- Visualize block structure
- Inspect block details (hash, parent hash, transactions)
- Transaction lookup and analysis
- Educational tool for understanding blockchain

📄 **PDF Certificate Generation**
- Professional certificate layouts
- QR codes for verification
- Download as PDF
- Purchase receipt generation

⚡ **Interval Mining**
- 5-second block intervals (configurable)
- Demonstrates batch transaction processing
- Realistic blockchain simulation

---

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────┐
│      Frontend (React + Vite)                │
│  • Producer Dashboard                       │
│  • Company Dashboard                        │
│  • Admin Panel                              │
│  • Block Explorer                           │
│  • Metrics Dashboard                        │
└──────────────┬──────────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────────┐
│     Backend (Express.js + ethers.js)        │
│  • REST API Endpoints                       │
│  • Blockchain Client                        │
│  • Merkle Tree Builder                      │
│  • PDF Generator                            │
│  • Metrics Tracker                          │
└──────────────┬──────────────────────────────┘
               │ JSON-RPC
               ▼
┌─────────────────────────────────────────────┐
│    Blockchain (Hardhat + Solidity)          │
│  • SolarEnergyCertificate.sol               │
│  • Role-based Access Control                │
│  • Certificate Lifecycle Management         │
│  • Event Emission for Indexing              │
└─────────────────────────────────────────────┘
```

### Data Flow

```
1. Issue Certificate:
   Producer → Backend API → Smart Contract → Event Emitted → Merkle Tree Updated

2. Purchase Certificate:
   Company → Backend API → Smart Contract → ETH Transfer → Ownership Change → Event Emitted

3. Verify Certificate:
   Anyone → Backend API → Merkle Service → Cryptographic Proof Generated
```

---

## Technology Stack

### Blockchain Layer
- **Solidity** 0.8.20 - Smart contract programming
- **Hardhat** 2.x - Ethereum development environment
- **ethers.js** 6.x - Blockchain interaction library

### Backend
- **Node.js** 18.x+ - JavaScript runtime
- **Express.js** 4.x - Web framework
- **PDFKit** - PDF generation
- **MerkleTreeJS** - Cryptographic proofs
- **QRCode** - QR code generation

### Frontend
- **React** 18.x - UI framework
- **Vite** 5.x - Build tool
- **Tailwind CSS** 3.x - Styling
- **React Router** 6.x - Navigation
- **Recharts** 2.x - Data visualization
- **Axios** - HTTP client

---

## Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MetaMask** browser extension
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SEC_DAPP
   ```

2. **Install backend dependencies**
   ```bash
   cd backend-node
   npm install

   cd hardhat
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend-vite
   npm install
   ```

### Running the Application

#### Terminal 1: Start Hardhat Blockchain

```bash
cd backend-node/hardhat
npx hardhat node
```

Keep this running. Note the accounts and private keys.

#### Terminal 2: Deploy Smart Contract

```bash
cd backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address from the output!

#### Terminal 3: Start Backend Server

1. Create/update `backend-node/.env`:
   ```env
   RPC_URL=http://127.0.0.1:8545
   PRIVATE_KEY=<Account #0 private key from Hardhat>
   CONTRACT_ADDRESS=<Deployed contract address>
   PORT=5000
   ```

2. Start the server:
   ```bash
   cd backend-node
   npm run dev
   ```

   Backend running on http://localhost:5000

#### Terminal 4: Start Frontend

1. Create/update `frontend-vite/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_RPC_URL=http://127.0.0.1:8545
   VITE_CONTRACT_ADDRESS=<Deployed contract address>
   ```

2. Start the development server:
   ```bash
   cd frontend-vite
   npm run dev
   ```

   Frontend running on http://localhost:5173

### Configure MetaMask

1. Add Hardhat network to MetaMask:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

2. Import test accounts:
   - Copy private keys from Hardhat node terminal
   - Import accounts #0-#6 for full testing
   - Each account has 10,000 ETH

### Test the Application

1. Open http://localhost:5173
2. Connect MetaMask wallet
3. Navigate to **Admin** page
4. Register producers (accounts #1, #2, #3)
5. Register companies (accounts #4, #5, #6)
6. Go to **Producers** page:
   - Select a producer
   - Issue certificates
7. Go to **Companies** page:
   - Select a company
   - Purchase and retire certificates
8. Explore **Block Explorer** and **Metrics Dashboard**

---

## Project Structure

```
SEC_DAPP/
│
├── backend-node/
│   ├── hardhat/                    # Blockchain environment
│   │   ├── contracts/
│   │   │   └── SolarEnergyCertificate.sol
│   │   ├── scripts/
│   │   │   └── deploy.js
│   │   └── hardhat.config.js
│   │
│   ├── src/
│   │   ├── server.js               # Express entry point
│   │   ├── api/                    # Route definitions
│   │   ├── controllers/            # Request handlers
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Helper functions
│   │
│   └── .env                        # Backend configuration
│
├── frontend-vite/
│   ├── src/
│   │   ├── App.jsx                 # Main app + routing
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AdminMint.jsx
│   │   │   ├── Producers.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CertificateView.jsx
│   │   │   ├── CertificateViewer.jsx
│   │   │   ├── BlockExplorer.jsx
│   │   │   └── MetricsDashboard.jsx
│   │   │
│   │   ├── components/             # Reusable components
│   │   └── api/                    # API client
│   │
│   └── .env                        # Frontend configuration
│
├── README.md                       # This file
├── CODEBASE_EXPLANATION.md         # Technical documentation
├── SETUP_GUIDE.md                  # Installation guide
├── WEBSITE_GUIDE.md                # User guide
└── [Other documentation files]
```

---

## Usage Guide

### Admin Operations

1. **Register Producer**
   - Navigate to Admin page
   - Enter producer address (e.g., Account #1)
   - Click "Register Producer"

2. **Register Company**
   - Enter company address (e.g., Account #4)
   - Click "Register Company"

3. **Configure Settings**
   - Set minimum energy (default: 1000 Wh = 1 kWh)
   - Set default price (in Wei)

### Producer Operations

1. **Issue Certificate**
   - Select producer from dropdown (P1, P2, P3...)
   - Enter owner address (can be producer themselves)
   - Enter energy amount in Wh (minimum 1000 Wh)
   - Click "Issue Certificate"
   - Certificate labeled as P1_ID1, P1_ID2, etc.

2. **Set Custom Price**
   - Select producer
   - Enter price in Wei
   - Click "Set Price"

3. **View Issued Certificates**
   - Switch to correct MetaMask account
   - View "My Certificates" section

### Company Operations

1. **Purchase Certificate**
   - Select company from dropdown (C1, C2, C3...)
   - Enter certificate ID to purchase
   - Click "Purchase Certificate"
   - ETH automatically transferred to previous owner

2. **Retire Certificate**
   - Select certificate from "My Certificates"
   - Click "Retire"
   - Certificate permanently marked as retired

3. **Download Certificate**
   - View certificate details
   - Click "Download PDF"
   - Get professional certificate with QR code

4. **Download Receipt**
   - After purchase
   - Download transaction receipt as PDF

### Block Explorer

- View recent blocks (last 20)
- Click block to see details:
  - Block number, hash, parent hash
  - Timestamp, miner, gas used
  - Transaction list
- Search specific block by number
- Click transaction hash to view details

### Metrics Dashboard

- **Throughput Metrics**: TPS, average block time
- **Latency Statistics**: Average, min, max transaction time
- **Activity Summary**: Certificates issued, purchased, retired
- **Charts**: Block time, transactions per block, latency timeline
- Auto-refreshes every 10 seconds

---

## API Reference

### Admin Endpoints

- `GET /admin/producers` - List registered producers
- `GET /admin/companies` - List registered companies
- `POST /admin/registerProducer` - Register new producer
- `POST /admin/registerCompany` - Register new company
- `POST /admin/setMinEnergy` - Set minimum energy requirement
- `POST /admin/setDefaultPrice` - Set default certificate price

### Producer Endpoints

- `POST /producers/issue` - Issue new certificate
- `POST /producers/setPrice` - Set producer-specific pricing
- `GET /producers/myCertificates?owner=0x...` - Get producer's certificates

### Certificate Endpoints

- `GET /certificates/all` - Get all certificates
- `GET /certificates/:id` - Get certificate by ID
- `POST /certificates/purchase` - Purchase certificate
- `POST /certificates/retire` - Retire certificate

### Merkle Endpoints

- `GET /merkle/tree` - Get Merkle tree root and leaves
- `POST /merkle/proof` - Get Merkle proof for certificate

### PDF Endpoints

- `GET /api/download_certificate/:id` - Download certificate PDF
- `GET /api/download_receipt/:id/:txHash` - Download receipt PDF

### Explorer Endpoints

- `GET /explorer/latest-block` - Get latest block number
- `GET /explorer/block/:number` - Get block details
- `GET /explorer/transaction/:txHash` - Get transaction details

### Metrics Endpoints

- `GET /metrics/throughput` - Get TPS and block time
- `GET /metrics/latency-stats` - Get latency statistics
- `GET /metrics/analytics` - Get blockchain analytics

For complete API documentation, see [CODEBASE_EXPLANATION.md](./CODEBASE_EXPLANATION.md#api-documentation).

---

## Documentation

Comprehensive documentation is available in the following files:

- **[CODEBASE_EXPLANATION.md](./CODEBASE_EXPLANATION.md)** - Complete technical documentation with architecture, data flows, and implementation details
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step installation and configuration guide
- **[WEBSITE_GUIDE.md](./WEBSITE_GUIDE.md)** - User guide for navigating and using the application
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant instructions for code assistance
- **[BUG_FIXES_REPORT.md](./BUG_FIXES_REPORT.md)** - Documentation of bugs fixed during development
- **[METRICS_GUIDE.md](./METRICS_GUIDE.md)** - Guide to using the metrics dashboard
- **[METRICS_VERIFICATION.md](./METRICS_VERIFICATION.md)** - Metrics system verification and testing
- **[COMPANY_SELECTION_GUIDE.md](./COMPANY_SELECTION_GUIDE.md)** - Company operations guide
- **[PRODUCER_SELECTION_GUIDE.md](./PRODUCER_SELECTION_GUIDE.md)** - Producer operations guide
- **[TESTING_MERKLE_BLOCKS.md](./TESTING_MERKLE_BLOCKS.md)** - Merkle tree testing guide

---

## Development

### Development Commands

```bash
# Blockchain
cd backend-node/hardhat
npx hardhat node                                    # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost  # Deploy contract
npx hardhat compile                                 # Compile contracts

# Backend
cd backend-node
npm run dev                                         # Start with nodemon
npm start                                           # Start production server

# Frontend
cd frontend-vite
npm run dev                                         # Start development server
npm run build                                       # Build for production
npm run preview                                     # Preview production build
npm run lint                                        # Run linter
```

### Test Accounts

Hardhat provides 20 test accounts with 10,000 ETH each:

| Role | Account # | Address |
|------|-----------|---------|
| Admin | #0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 |
| Producer P1 | #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 |
| Producer P2 | #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC |
| Producer P3 | #3 | 0x90F79bf6EB2c4f870365E785982E1f101E93b906 |
| Company C1 | #4 | 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 |
| Company C2 | #5 | 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc |
| Company C3 | #6 | 0x976EA74026E726554dB657fA54763abd0C3a0aa9 |

### Environment Variables

#### Backend (.env)

```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=<Hardhat Account #0 private key>
CONTRACT_ADDRESS=<Deployed contract address>
PORT=5000
```

#### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=<Deployed contract address>
```

---

## Security

⚠️ **IMPORTANT: This project is for DEVELOPMENT AND TESTING ONLY**

### Current Limitations

This codebase contains several security limitations suitable for development:

1. **Hardcoded Private Keys** - Test account keys in source code
2. **No Authentication** - Open API endpoints
3. **No Rate Limiting** - Vulnerable to DoS
4. **In-Memory Storage** - Data lost on restart
5. **Wide-Open CORS** - Accepts any origin
6. **HTTP Only** - No HTTPS/TLS

### Production Checklist

Before deploying to production:

- [ ] Replace hardcoded keys with secure key management (HSM/KMS)
- [ ] Implement authentication (JWT/OAuth2)
- [ ] Add rate limiting
- [ ] Use persistent database (PostgreSQL/MongoDB)
- [ ] Restrict CORS to specific domains
- [ ] Enable HTTPS/SSL
- [ ] Add input sanitization
- [ ] Get smart contract security audit
- [ ] Implement monitoring and logging
- [ ] Set up CI/CD pipeline

For detailed security considerations, see [CODEBASE_EXPLANATION.md](./CODEBASE_EXPLANATION.md#security-considerations).

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Use ES6+ JavaScript
- Follow Airbnb JavaScript Style Guide
- Use Prettier for formatting
- Add comments for complex logic
- Write descriptive commit messages

### Testing

Before submitting a PR:
- Test all functionalities
- Ensure no console errors
- Verify smart contract interactions
- Check responsive design

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure smart contract libraries
- **Tailwind CSS** - Utility-first CSS framework
- **ethers.js** - Ethereum library
- **MerkleTreeJS** - Merkle tree implementation
- **React Community** - UI framework and ecosystem

---

## Contact & Support

For questions, issues, or suggestions:

- **Issues**: [GitHub Issues](https://github.com/your-username/SEC_DAPP/issues)
- **Documentation**: See [Documentation](#documentation) section
- **Email**: your-email@example.com

---

## Project Status

**Status**: ✅ Complete and Production-Ready for Development/Testing

**Last Updated**: 2025-11-25

**Version**: 1.0

### Features Status

- ✅ Smart Contract - Role-based access control, certificate lifecycle
- ✅ Backend API - Complete REST API with 9 route groups
- ✅ Frontend - 8 pages, full UI implementation
- ✅ Merkle Trees - Cryptographic proof system
- ✅ Block Explorer - Blockchain visualization
- ✅ Metrics Dashboard - Real-time performance monitoring
- ✅ PDF Generation - Certificates and receipts
- ✅ Multi-signer Support - Multiple producers and companies
- ✅ Documentation - Comprehensive guides and references

---

**Built with ☀️ for a sustainable future**
