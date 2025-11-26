# SEC_DAPP - Complete Codebase Documentation

**Solar Energy Certificate Decentralized Application**

Comprehensive technical documentation for the SEC DApp, including architecture, implementation details, data flows, and deployment guide.

**Last Updated:** 2025-11-25
**Version:** 1.0
**Status:** Production-Ready for Development/Testing

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Directory Structure](#directory-structure)
6. [Smart Contract Layer](#smart-contract-layer)
7. [Backend Architecture](#backend-architecture)
8. [Frontend Architecture](#frontend-architecture)
9. [Data Flow & Workflows](#data-flow--workflows)
10. [API Documentation](#api-documentation)
11. [Key Features](#key-features)
12. [Merkle Tree Implementation](#merkle-tree-implementation)
13. [Metrics & Monitoring](#metrics--monitoring)
14. [Security Considerations](#security-considerations)
15. [Deployment Guide](#deployment-guide)

---

## Executive Summary

SEC_DAPP is a production-ready blockchain-based platform for managing Solar Energy Certificates (RECs). The system provides a complete solution for certificate issuance, trading, verification, and retirement through a three-tier architecture:

### Key Components
- **Blockchain Layer**: Solidity smart contract on Ethereum (Hardhat local network)
- **Backend Layer**: Node.js/Express.js REST API with ethers.js blockchain integration
- **Frontend Layer**: React/Vite SPA with MetaMask wallet integration

### Core Capabilities
✅ **Certificate Lifecycle Management** - Issue, purchase, transfer, retire
✅ **Role-Based Access Control** - Admin, Producer, Company roles
✅ **Cryptographic Verification** - Merkle tree proof system
✅ **Performance Monitoring** - Real-time metrics dashboard
✅ **PDF Generation** - Professional certificates with QR codes
✅ **Block Explorer** - Blockchain visualization tool
✅ **Multi-Signer Support** - Multiple producers and companies

### Project Statistics
- **Smart Contract**: 308 lines (SolarEnergyCertificate.sol)
- **Backend**: 9 API routes, 12+ service functions
- **Frontend**: 8 pages, 15+ components
- **Total Lines of Code**: ~3000+ (excluding node_modules)

---

## Project Overview

### Problem Statement

Traditional Renewable Energy Certificate systems face several challenges:

1. **Centralization Risk**: Single points of failure and control
2. **Limited Transparency**: Difficult to verify certificate authenticity
3. **High Costs**: Multiple intermediaries increase transaction costs
4. **Slow Processing**: Manual verification and settlement
5. **Double-Counting**: Risk of fraudulent certificate duplication
6. **Geographic Barriers**: Limited access for international participants

### Solution

SEC_DAPP leverages blockchain technology to address these challenges:

| Problem | Blockchain Solution |
|---------|-------------------|
| Centralization | Decentralized network with no single point of control |
| Transparency | All transactions publicly verifiable on blockchain |
| High Costs | Automated smart contracts eliminate intermediaries |
| Slow Processing | Instant settlement and verification |
| Double-Counting | Smart contract prevents duplicate certificates |
| Geographic Barriers | Global accessibility via internet |

### Use Cases

1. **Solar Farm Operators** (Producers)
   - Issue certificates for energy generated
   - Set custom pricing per certificate
   - Track all issued certificates
   - Receive automatic payments upon sale

2. **Corporations** (Companies)
   - Purchase certificates for carbon neutrality goals
   - Verify certificate authenticity via Merkle proofs
   - Retire certificates to claim environmental benefits
   - Generate compliance reports (PDF downloads)

3. **Platform Administrators**
   - Register and manage producers/companies
   - Set minimum energy requirements
   - Configure default pricing
   - Monitor platform activity

4. **Auditors & Regulators**
   - Verify certificate authenticity via blockchain
   - Track complete certificate history
   - Generate Merkle proofs for compliance
   - Export blockchain data for analysis

---

## System Architecture

### Three-Tier Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│                   (Frontend - React/Vite)                      │
│                                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐            │
│  │  Producers  │ │  Companies  │ │ Admin Panel  │            │
│  │    Page     │ │    Page     │ │              │            │
│  └─────────────┘ └─────────────┘ └──────────────┘            │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐            │
│  │   Block     │ │  Metrics    │ │ Certificate  │            │
│  │  Explorer   │ │  Dashboard  │ │   Viewer     │            │
│  └─────────────┘ └─────────────┘ └──────────────┘            │
│                                                                │
│  Tools: React 18, Vite 5, Tailwind CSS, Recharts, Axios      │
└───────────────────────┬────────────────────────────────────────┘
                        │
                        │ HTTP/REST API (JSON)
                        │
┌───────────────────────▼────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                         │
│                  (Backend - Express.js/Node.js)                │
│                                                                │
│  ┌──────────┐  ┌────────────┐  ┌────────────────┐            │
│  │   API    │  │ Controllers│  │   Services     │            │
│  │  Routes  │→ │            │→ │                │            │
│  │          │  │ - Validate │  │ - blockchain.js│            │
│  │ 9 Routes │  │ - Parse    │  │ - merkle       │            │
│  │          │  │ - Format   │  │ - metrics      │            │
│  │          │  │ - Error    │  │ - PDF gen      │            │
│  └──────────┘  └────────────┘  └────────────────┘            │
│                                                                │
│  Tools: Express 4, ethers.js 6, PDFKit, MerkleTreeJS         │
└───────────────────────┬────────────────────────────────────────┘
                        │
                        │ JSON-RPC (ethers.js Provider)
                        │
┌───────────────────────▼────────────────────────────────────────┐
│                       DATA LAYER                               │
│                   (Blockchain - Ethereum)                      │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │     SolarEnergyCertificate.sol (Smart Contract)      │    │
│  │                                                       │    │
│  │  • Access Control (Admin, Producer, Company)         │    │
│  │  • Certificate Storage & Management                  │    │
│  │  • Transfer-on-Purchase Logic                        │    │
│  │  • Event Emission for Merkle Trees                   │    │
│  │  • Pricing & Policy Management                       │    │
│  │                                                       │    │
│  │  State: certificates[], producerList[], companyList[]│    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  Tools: Solidity 0.8.20, Hardhat 2.x, OpenZeppelin           │
└────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
┌──────────────────────────────────────────────────────────────┐
│                         USER                                  │
│                    (Web Browser)                              │
└────┬────────────────────────────────────────────┬────────────┘
     │                                            │
     │                                            │
     ▼                                            ▼
┌─────────────────┐                   ┌───────────────────────┐
│   MetaMask      │                   │  React Frontend       │
│  (Web3 Wallet)  │                   │  (Port 5173)          │
│                 │                   │                       │
│ • Connect       │                   │ • UI Components       │
│ • Sign Txs      │                   │ • State Management    │
│ • Account Mgmt  │                   │ • HTTP API Calls      │
└────┬────────────┘                   └───────┬───────────────┘
     │                                        │
     │ Web3 Signatures                        │ Axios (REST)
     │ (Frontend only)                        │
     │                                        ▼
     │                              ┌────────────────────────┐
     │                              │  Express.js Backend    │
     │                              │  (Port 5000)           │
     │                              │                        │
     │                              │  • Routes & Controllers│
     │                              │  • Business Logic      │
     │                              │  • Blockchain Client   │
     │                              │  • PDF Generation      │
     │                              │  • Merkle Tree Builder │
     │                              └────────┬───────────────┘
     │                                       │
     │                                       │ ethers.js
     │ Direct Web3 connection                │ Provider + Wallet
     │ (for wallet operations)               │ (with private key)
     │                                       │
     ▼                                       ▼
┌──────────────────────────────────────────────────────────────┐
│             Hardhat Local Blockchain                          │
│             (localhost:8545, Chain ID: 31337)                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │   SolarEnergyCertificate Contract                    │    │
│  │   Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3│    │
│  │                                                       │    │
│  │   • Processes transactions                           │    │
│  │   • Updates state variables                          │    │
│  │   • Emits events                                     │    │
│  │   • Enforces access control                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Network Config:                                              │
│  • Block Time: ~5 seconds (interval mining)                  │
│  • Gas Limit: 30,000,000 per block                          │
│  • 20 Test Accounts with 10,000 ETH each                    │
└───────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| **React** | 18.3.x | UI framework | Component-based architecture, large ecosystem |
| **Vite** | 5.4.x | Build tool | Faster HMR than Webpack, modern ES modules |
| **React Router** | 6.x | Client-side routing | Standard for SPA navigation |
| **Tailwind CSS** | 3.x | Styling framework | Utility-first, rapid development |
| **Axios** | 1.7.x | HTTP client | Promise-based, interceptor support |
| **ethers.js** | 6.x | Ethereum library | Modern Web3 library, TypeScript support |
| **Recharts** | 2.x | Charts/graphs | React-native, responsive charts |

### Backend Technologies

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| **Node.js** | 18.x+ | Runtime environment | JavaScript everywhere, async I/O |
| **Express.js** | 4.x | Web framework | Minimal, flexible, extensive middleware |
| **ethers.js** | 6.x | Blockchain client | Smart contract interaction, event querying |
| **PDFKit** | 0.14.x | PDF generation | Stream-based, QR code support |
| **QRCode** | 1.x | QR code generation | Certificate verification |
| **MerkleTreeJS** | - | Merkle tree library | Cryptographic proofs |
| **dotenv** | 16.x | Environment variables | Configuration management |
| **nodemon** | 3.x | Development server | Auto-restart on file changes |
| **CORS** | 2.x | Cross-origin requests | Frontend-backend communication |

### Blockchain Technologies

| Technology | Version | Purpose | Why Chosen |
|-----------|---------|---------|------------|
| **Solidity** | 0.8.20 | Smart contract language | Most mature, extensive tooling |
| **Hardhat** | 2.x | Development environment | Best DX, flexible, extensive plugins |
| **Hardhat Network** | - | Local blockchain | Fast development iteration |
| **OpenZeppelin** | 5.x | Contract libraries | Battle-tested, secure implementations |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control system |
| **npm** | Package manager |
| **VS Code** | Code editor (recommended) |
| **MetaMask** | Browser wallet for blockchain interaction |
| **Postman** | API testing (optional) |
| **Chrome DevTools** | Frontend debugging |

---

## Directory Structure

### Complete Project Tree

```
SEC_DAPP/
│
├── 📁 backend-node/                         # Backend server
│   ├── 📁 hardhat/                          # Blockchain environment
│   │   ├── 📁 contracts/
│   │   │   └── 📄 SolarEnergyCertificate.sol   # Main smart contract
│   │   │
│   │   ├── 📁 scripts/
│   │   │   └── 📄 deploy.js                    # Deployment script
│   │   │
│   │   ├── 📁 artifacts/                      # Compiled contracts
│   │   │   └── 📁 contracts/
│   │   │       └── 📁 SolarEnergyCertificate.sol/
│   │   │           └── 📄 SolarEnergyCertificate.json  # ABI + bytecode
│   │   │
│   │   ├── 📄 hardhat.config.js               # Hardhat configuration
│   │   └── 📄 package.json                    # Hardhat dependencies
│   │
│   ├── 📁 src/                                # Backend source code
│   │   ├── 📄 server.js                       # Express app entry point
│   │   │
│   │   ├── 📁 api/                            # Route definitions
│   │   │   ├── 📄 admin.js                    # Admin endpoints
│   │   │   ├── 📄 producers.js                # Producer endpoints
│   │   │   ├── 📄 company.js                  # Company endpoints
│   │   │   ├── 📄 certificates.js             # Certificate endpoints
│   │   │   ├── 📄 merkle.js                   # Merkle tree endpoints
│   │   │   ├── 📄 pdf.js                      # PDF generation
│   │   │   ├── 📄 receipt.js                  # Receipt PDF
│   │   │   ├── 📄 explorer.js                 # Block explorer
│   │   │   └── 📄 metrics.js                  # Metrics endpoints
│   │   │
│   │   ├── 📁 controllers/                    # Request handlers
│   │   │   ├── 📄 admin.controller.js
│   │   │   ├── 📄 producer.controller.js
│   │   │   ├── 📄 company.controller.js
│   │   │   ├── 📄 certificates.controller.js
│   │   │   ├── 📄 blockchain-explorer.controller.js
│   │   │   └── 📄 metrics.controller.js
│   │   │
│   │   ├── 📁 services/                       # Business logic
│   │   │   ├── 📄 blockchain.js               # ethers.js configuration
│   │   │   ├── 📄 admin.service.js
│   │   │   ├── 📄 producer.service.js
│   │   │   ├── 📄 company.service.js
│   │   │   ├── 📄 certificates.service.js
│   │   │   ├── 📄 merkleService.js            # Merkle tree builder
│   │   │   ├── 📄 blockchain-explorer.service.js
│   │   │   └── 📄 metrics.service.js          # Performance tracking
│   │   │
│   │   ├── 📁 abi/                            # Contract ABIs
│   │   │   └── 📄 SolarEnergyCertificate.json
│   │   │
│   │   └── 📁 utils/                          # Utility functions
│   │       └── 📄 validation.js               # Input validation
│   │
│   ├── 📄 .env                                # Environment variables
│   ├── 📄 package.json                        # Backend dependencies
│   └── 📄 package-lock.json
│
├── 📁 frontend-vite/                          # Frontend application
│   ├── 📁 src/
│   │   ├── 📄 main.jsx                        # React entry point
│   │   ├── 📄 App.jsx                         # Main app + routing
│   │   ├── 📄 index.css                       # Global CSS
│   │   │
│   │   ├── 📁 pages/                          # Page components
│   │   │   ├── 📄 Home.jsx                    # Landing page
│   │   │   ├── 📄 AdminMint.jsx               # Admin dashboard
│   │   │   ├── 📄 Producers.jsx               # Producer operations
│   │   │   ├── 📄 Companies.jsx               # Company operations
│   │   │   ├── 📄 CertificateView.jsx         # Certificate details
│   │   │   ├── 📄 CertificateViewer.jsx       # All certificates (admin)
│   │   │   ├── 📄 BlockExplorer.jsx           # Blockchain visualization
│   │   │   └── 📄 MetricsDashboard.jsx        # Performance metrics
│   │   │
│   │   ├── 📁 components/                     # Reusable components
│   │   │   ├── 📄 Navbar.jsx                  # Navigation bar
│   │   │   └── 📄 RoleSelector.jsx            # Role selection dropdown
│   │   │
│   │   ├── 📁 api/                            # API client layer
│   │   │   ├── 📄 axiosClient.js              # Axios configuration
│   │   │   ├── 📄 admin.js
│   │   │   ├── 📄 producers.js
│   │   │   ├── 📄 companies.js
│   │   │   ├── 📄 certificates.js
│   │   │   ├── 📄 merkle.js
│   │   │   ├── 📄 explorer.js
│   │   │   └── 📄 metrics.js
│   │   │
│   │   └── 📁 abi/                            # Contract ABIs
│   │       └── 📄 SolarEnergyCertificate.json
│   │
│   ├── 📄 .env                                # Frontend environment variables
│   ├── 📄 index.html                          # HTML entry point
│   ├── 📄 vite.config.js                      # Vite configuration
│   ├── 📄 tailwind.config.cjs                 # Tailwind configuration
│   ├── 📄 package.json                        # Frontend dependencies
│   └── 📄 package-lock.json
│
├── 📄 README.md                               # Project overview
├── 📄 CLAUDE.md                               # AI assistant instructions
├── 📄 CODEBASE_EXPLANATION.md                 # This file
├── 📄 SETUP_GUIDE.md                          # Installation guide
├── 📄 WEBSITE_GUIDE.md                        # User guide
├── 📄 BUG_FIXES_REPORT.md                     # Bug fixes documentation
├── 📄 METRICS_VERIFICATION.md                 # Metrics system docs
├── 📄 METRICS_GUIDE.md                        # Metrics usage guide
├── 📄 COMPANY_SELECTION_GUIDE.md              # Company workflow
├── 📄 PRODUCER_SELECTION_GUIDE.md             # Producer workflow
└── 📄 TESTING_MERKLE_BLOCKS.md                # Merkle testing guide
```

### Key File Purposes

**Backend Files:**
- `server.js` - Express app initialization, middleware setup, route registration
- `api/*.js` - Route definitions (URL → Controller mapping)
- `controllers/*.js` - Request validation, error handling, response formatting
- `services/*.js` - Business logic, blockchain interaction, data processing
- `blockchain.js` - ethers.js provider, contract instances, wallet management

**Frontend Files:**
- `main.jsx` - React bootstrapping, root render
- `App.jsx` - Routing configuration, layout structure
- `pages/*.jsx` - Full-page components, user workflows
- `components/*.jsx` - Reusable UI pieces
- `api/*.js` - Backend API wrappers

**Smart Contract:**
- `SolarEnergyCertificate.sol` - Core business logic, state management, events

---

## Smart Contract Layer

### Contract Overview

**File:** `backend-node/hardhat/contracts/SolarEnergyCertificate.sol`
**Solidity Version:** 0.8.20
**License:** MIT

The SolarEnergyCertificate contract implements a complete certificate lifecycle management system with role-based access control.

### Contract Architecture

```solidity
contract SolarEnergyCertificate {
    // ===== STATE VARIABLES =====

    // Access Control
    address public admin;                         // Primary admin (deployer)
    mapping(address => bool) public isAdmin;      // Multi-admin support
    mapping(address => bool) public isProducer;   // Registered producers
    mapping(address => bool) public isCompany;    // Registered companies

    // Configuration
    uint256 public minEnergyWh = 1000;            // Minimum 1 kWh
    uint256 public defaultPriceWei = 0;           // Default price

    // Certificate Storage
    uint256 public nextId = 1;                    // Auto-increment ID
    mapping(uint256 => Certificate) public certificates;

    // Ownership Tracking
    mapping(address => uint256[]) internal ownerToCerts;

    // Registries
    address[] public producerList;                // All producers
    address[] public companyList;                 // All companies
    mapping(address => uint256) public producerPriceWei;  // Producer pricing

    // ===== DATA STRUCTURES =====

    struct Certificate {
        uint256 id;              // Unique identifier
        address owner;           // Current owner
        uint256 energyWh;        // Energy in Wh
        uint256 timestamp;       // Issuance time
        bool retired;            // Retirement status
        address issuer;          // Original producer
        uint256 priceWei;        // Price snapshot
    }
}
```

### Key Functions

#### 1. Admin Functions

```solidity
// Register a new producer
function registerProducer(address _producer) external onlyAdmin

// Register a new company
function registerCompany(address _company) external onlyAdmin

// Remove producer
function removeProducer(address _producer) external onlyAdmin

// Remove company
function removeCompany(address _company) external onlyAdmin

// Set minimum energy requirement
function setMinEnergyWh(uint256 _minEnergyWh) external onlyAdmin

// Set default price
function setDefaultPriceWei(uint256 _defaultPriceWei) external onlyAdmin
```

#### 2. Producer Functions

```solidity
// Set producer-specific pricing
function setProducerPrice(uint256 _priceWei) external onlyProducer

// Issue a new certificate
function issueCertificate(address _owner, uint256 _energyWh) external onlyProducer
```

#### 3. Purchase & Transfer

```solidity
// Purchase certificate (transfer ownership + pay seller)
function purchaseCertificate(uint256 _id) external payable
```

**Purchase Flow:**
1. Buyer calls `purchaseCertificate(id)` with ETH value
2. Contract validates:
   - Certificate exists
   - Not retired
   - Buyer != seller
   - msg.value >= price
3. Transfer ownership to buyer
4. Forward ETH to seller
5. Refund excess payment if any
6. Emit `CertificatePurchased` event

#### 4. Retirement

```solidity
// Retire a certificate (claim environmental benefit)
function retireCertificate(uint256 _id) external
```

Retirement is permanent and can be done by:
- Certificate owner
- Registered companies
- Admins

#### 5. Getters

```solidity
// Get certificate details
function getCertificate(uint256 _id) external view returns (...)

// Get all certificates owned by address
function certificatesOfOwner(address _owner) external view returns (uint256[])

// Get all registered producers
function producers() external view returns (address[])

// Get all registered companies
function companies() external view returns (address[])

// Get certificate issuer
function issuerOf(uint256 _id) external view returns (address)
```

### Events

```solidity
// Access Control Events
event AdminAdded(address indexed newAdmin, address indexed by);
event ProducerRegistered(address indexed producer, address indexed by);
event ProducerRemoved(address indexed producer, address indexed by);
event CompanyRegistered(address indexed company, address indexed by);
event CompanyRemoved(address indexed company, address indexed by);

// Certificate Lifecycle Events
event CertificateIssued(
    uint256 indexed id,
    address indexed owner,
    uint256 energyWh,
    uint256 timestamp,
    address indexed issuer,
    uint256 priceWei
);

event CertificatePurchased(
    uint256 indexed id,
    address indexed from,
    address indexed to,
    uint256 priceWei,
    uint256 timestamp
);

event CertificateRetired(
    uint256 indexed id,
    address indexed by,
    uint256 timestamp
);

// Configuration Events
event MinEnergyUpdated(uint256 newMinEnergyWh, address indexed by);
event DefaultPriceUpdated(uint256 newDefaultPriceWei, address indexed by);
event ProducerPriceUpdated(address indexed producer, uint256 newPriceWei, address indexed by);
```

**Why Events Matter:**
- Off-chain indexing (Merkle tree construction)
- Frontend notifications
- Audit trail
- Analytics and reporting

### Access Control Modifiers

```solidity
modifier onlyAdmin() {
    require(isAdmin[msg.sender] || msg.sender == admin, "Only admin");
    _;
}

modifier onlyProducer() {
    require(isProducer[msg.sender], "Only registered producer");
    _;
}

modifier onlyCompany() {
    require(isCompany[msg.sender], "Only registered company");
    _;
}
```

### Security Features

1. **Reentrancy Protection**: Uses Checks-Effects-Interactions pattern
2. **Payment Safety**: Uses `call{value}` instead of `transfer/send`
3. **Input Validation**: All inputs validated before state changes
4. **Access Control**: Role-based permissions on all state-changing functions
5. **Event Emission**: All important actions emit events for transparency

---

## Backend Architecture

### Request Flow

```
HTTP Request
    ↓
[Express Middleware]
    ├─ CORS (allow frontend access)
    ├─ Body Parser (JSON parsing)
    └─ Error Handling
    ↓
[Router] (api/*.js)
    └─ Maps URL pattern to controller function
    ↓
[Controller] (controllers/*.js)
    ├─ Extract request parameters
    ├─ Validate input
    ├─ Call service function
    └─ Format response
    ↓
[Service] (services/*.js)
    ├─ Business logic
    ├─ Blockchain interaction (ethers.js)
    ├─ Data processing
    └─ Return result
    ↓
[Blockchain Service] (blockchain.js)
    ├─ Provider (read blockchain)
    ├─ Wallet (sign transactions)
    ├─ Contract instances (RO & RW)
    └─ Event queries
    ↓
[Smart Contract] (on blockchain)
    ├─ Validate transaction
    ├─ Update state
    ├─ Emit events
    └─ Return receipt
    ↓
HTTP Response (JSON)
```

### Core Service: blockchain.js

**Purpose:** Configure ethers.js to interact with Hardhat blockchain

```javascript
import { ethers } from "ethers";
import solarABI from "../abi/SolarEnergyCertificate.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

// Environment Configuration
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// 1. Provider (read blockchain)
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// 2. Read-only contract instance (no gas cost)
export const contractRO = new ethers.Contract(
  CONTRACT_ADDRESS,
  solarABI,
  provider
);

// 3. Wallet (sign transactions)
export const wallet = PRIVATE_KEY
  ? new ethers.Wallet(PRIVATE_KEY, provider)
  : null;

// 4. Read-write contract instance (costs gas)
export const contractRW = wallet
  ? new ethers.Contract(CONTRACT_ADDRESS, solarABI, wallet)
  : null;

// 5. Multi-signer support for producers/companies
const HARDHAT_ACCOUNTS = [
  { address: "0xf39Fd...", key: "0xac0974..." }, // Admin
  { address: "0x70997...", key: "0x59c699..." }, // Producer P1
  { address: "0x3C44C...", key: "0x5de411..." }, // Producer P2
  // ... more accounts
];

export function getContractForProducer(producerAddress) {
  const account = HARDHAT_ACCOUNTS.find(
    a => a.address.toLowerCase() === producerAddress.toLowerCase()
  );

  if (!account) {
    throw new Error(`No private key found for ${producerAddress}`);
  }

  const producerWallet = new ethers.Wallet(account.key, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, solarABI, producerWallet);
}
```

**Key Concepts:**
- **Provider**: Connects to blockchain, reads data (no private key needed)
- **Wallet**: Signs transactions with private key
- **Contract RO**: Read-only operations (free, no gas)
- **Contract RW**: Write operations (costs gas, needs signature)

**Usage Patterns:**
```javascript
// READ (No gas, no signature)
const cert = await contractRO.getCertificate(5);
const owner = await contractRO.ownerOf(5);

// WRITE (Costs gas, needs signature)
const tx = await contractRW.issueCertificate(owner, energyWh);
const receipt = await tx.wait();  // Wait for mining
console.log("TX Hash:", receipt.transactionHash);
```

### Example Service: producer.service.js

```javascript
import { contractRW, contractRO, getContractForProducer } from "./blockchain.js";
import { isAddress } from "../utils/validation.js";

export const issueCertificateService = async (ownerAddr, energyWh, producerAddr) => {
  // 1. Validate inputs
  if (!isAddress(ownerAddr)) {
    throw new Error("Invalid owner address");
  }
  if (!producerAddr || !isAddress(producerAddr)) {
    throw new Error("Invalid producer address");
  }
  if (energyWh < 1000) {
    throw new Error("Energy must be at least 1000 Wh");
  }

  // 2. Get contract instance with producer's signature
  const producerContract = getContractForProducer(producerAddr);

  // 3. Send transaction
  const tx = await producerContract.issueCertificate(ownerAddr, energyWh);

  // 4. Wait for confirmation
  const receipt = await tx.wait();

  // 5. Get new certificate ID
  const nextIdBN = await contractRO.nextId();
  const issuedId = Number(nextIdBN) - 1;

  // 6. Return result
  return {
    message: "Certificate issued successfully",
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    certificateId: issuedId,
    gasUsed: receipt.gasUsed?.toString(),
  };
};
```

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx (Router)
  ├── Navbar.jsx (Navigation + Wallet Connection)
  │
  ├── Home.jsx (Landing Page)
  │   ├── Hero Section
  │   ├── Features Overview
  │   └── Call-to-Action Buttons
  │
  ├── AdminMint.jsx (Admin Dashboard)
  │   ├── Producer Registration
  │   ├── Company Registration
  │   ├── Configuration Settings
  │   └── Participant Lists
  │
  ├── Producers.jsx (Producer Operations)
  │   ├── Producer Selector Dropdown
  │   ├── Certificate Issuance Form
  │   ├── Price Setting
  │   └── Issued Certificates List
  │
  ├── Companies.jsx (Company Operations)
  │   ├── Company Selector Dropdown
  │   ├── Certificate Verification
  │   ├── Purchase Form
  │   ├── Owned Certificates List
  │   └── Retirement Form
  │
  ├── CertificateView.jsx (Single Certificate)
  │   ├── Certificate Details Card
  │   ├── Owner Information
  │   ├── Energy & Price Display
  │   ├── Status Indicator
  │   └── Action Buttons (PDF, Receipt)
  │
  ├── CertificateViewer.jsx (All Certificates)
  │   ├── Certificate Grid/List
  │   ├── Filters (Owner Type, Status)
  │   ├── Search Functionality
  │   └── Sort Options
  │
  ├── BlockExplorer.jsx (Blockchain Visualization)
  │   ├── Block List Sidebar
  │   ├── Block Details Panel
  │   ├── Transaction List
  │   ├── Block Header Info
  │   └── Search Functionality
  │
  └── MetricsDashboard.jsx (Performance Analytics)
      ├── Summary Cards (TPS, Block Time, etc.)
      ├── Throughput Charts
      ├── Latency Graph
      ├── Activity Summary
      └── Auto-refresh (10 seconds)
```

### State Management

**Pattern:** React Hooks + Context API

```jsx
// Wallet connection example
const [account, setAccount] = useState(null);
const [connected, setConnected] = useState(false);

const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    setConnected(true);
  }
};
```

### API Integration

**Centralized Axios Client:**

```javascript
// frontend-vite/src/api/axiosClient.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

**API Wrapper Example:**

```javascript
// frontend-vite/src/api/certificates.js
import api from './axiosClient';

export const getCertificate = async (id) => {
  const response = await api.get(`/certificates/${id}`);
  return response.data;
};

export const purchaseCertificate = async (id, valueWei, companyAddress) => {
  const response = await api.post('/certificates/purchase', {
    id,
    valueWei,
    companyAddress
  });
  return response.data;
};
```

### Styling Approach

**Tailwind CSS Utility Classes:**

```jsx
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-4xl font-bold text-gray-900 mb-8">
      Solar Energy Certificates
    </h1>
    <button className="bg-yellow-500 hover:bg-yellow-600 text-white
                       font-semibold py-3 px-6 rounded-lg shadow-md
                       transition duration-300">
      Issue Certificate
    </button>
  </div>
</div>
```

**Solar Energy Theme:**
- **Primary**: Yellow/Amber (#f59e0b) - Solar energy
- **Secondary**: Green (#22c55e) - Environmental
- **Accent**: Sky Blue (#0ea5e9) - Clean energy
- **Background**: Gray gradients for modern look

---

## Data Flow & Workflows

### Workflow 1: Certificate Issuance

```
[Producer Page] User selects producer (P1) and enters energy (10 kWh)
       ↓
[Frontend] POST /producers/issue { owner, energyWh: 10000, producerAddress }
       ↓
[Backend] producer.controller.js validates input
       ↓
[Service] producer.service.js
       ├─ Gets contract with P1's private key
       ├─ Calls contractP1.issueCertificate(owner, 10000)
       └─ Waits for transaction confirmation
       ↓
[Blockchain] SolarEnergyCertificate.sol
       ├─ Validates: isProducer[P1] == true
       ├─ Validates: 10000 >= minEnergyWh (1000)
       ├─ Creates certificate with ID = nextId++
       ├─ Stores in certificates[ID]
       ├─ Updates ownerToCerts[owner]
       └─ Emits CertificateIssued event
       ↓
[Backend] Returns { txHash, certificateId, blockNumber }
       ↓
[Frontend] Displays success message: "Certificate P1_ID5 issued!"
```

### Workflow 2: Certificate Purchase

```
[Company Page] User selects company (C1), enters cert ID (5)
       ↓
[Frontend] POST /certificates/purchase { id: 5, valueWei, companyAddress }
       ↓
[Backend] certificates.controller.js validates input
       ↓
[Service] certificates.service.js
       ├─ Gets contract with C1's private key
       ├─ Calls contractC1.purchaseCertificate(5, { value: priceWei })
       └─ Waits for confirmation
       ↓
[Blockchain] SolarEnergyCertificate.sol
       ├─ Validates: cert exists, not retired
       ├─ Validates: msg.value >= cert.priceWei
       ├─ Transfers ownership: cert.owner = C1
       ├─ Forwards ETH to previous owner (P1)
       ├─ Refunds excess if any
       └─ Emits CertificatePurchased event
       ↓
[Backend] Records latency metric (optional)
       ↓
[Frontend] Updates "My Certificates" list with C1_ID5
```

### Workflow 3: Merkle Tree Generation

```
[Merkle Service] buildMerkleTree() called by API endpoint
       ↓
[Query Events] Fetch all CertificateIssued events from blockchain
       ↓
[Query Events] Fetch all CertificatePurchased events from blockchain
       ↓
[Get Registries] Fetch producerList[] and companyList[] from contract
       ↓
[Build Leaves] For each event:
       ├─ CertificateIssued(id=5, owner=P1) → Label: "P1_ID5"
       ├─ CertificatePurchased(id=5, to=C1) → Label: "C1_ID5"
       └─ Hash leaf: keccak256("LABEL|TXHASH")
       ↓
[Build Tree] Use MerkleTreeJS to create tree from leaves
       ↓
[Return] { root: "0x...", leaves: [...], tree: MerkleTree }
       ↓
[Frontend] Can request proof for any label to verify authenticity
```

---

## API Documentation

### Complete API Reference

#### Admin Endpoints (`/admin`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/admin/producers` | List all registered producers | - | `{ producers: ["0x...", ...] }` |
| GET | `/admin/companies` | List all registered companies | - | `{ companies: ["0x...", ...] }` |
| POST | `/admin/registerProducer` | Register new producer | `{ address }` | `{ message, txHash }` |
| POST | `/admin/removeProducer` | Remove producer | `{ address }` | `{ message, txHash }` |
| POST | `/admin/registerCompany` | Register new company | `{ address }` | `{ message, txHash }` |
| POST | `/admin/removeCompany` | Remove company | `{ address }` | `{ message, txHash }` |
| POST | `/admin/setMinEnergy` | Set minimum energy | `{ minEnergyWh }` | `{ message, txHash }` |
| POST | `/admin/setDefaultPrice` | Set default price | `{ priceWei }` | `{ message, txHash }` |

#### Producer Endpoints (`/producers`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/producers/setPrice` | Set producer pricing | `{ address, priceWei }` | `{ message, txHash }` |
| POST | `/producers/issue` | Issue new certificate | `{ owner, energyWh, producerAddress }` | `{ certificateId, txHash, blockNumber }` |
| GET | `/producers/myCertificates` | Get producer's certs | Query: `?owner=0x...` | `{ certificates: [...] }` |

#### Certificate Endpoints (`/certificates`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/certificates/all` | Get all certificates | - | `{ certificates: [...], total }` |
| GET | `/certificates/:id` | Get certificate by ID | - | `{ id, owner, energyWh, ... }` |
| GET | `/certificates/owner/:address` | Get certs by owner | - | `{ certificates: [id1, id2, ...] }` |
| POST | `/certificates/purchase` | Purchase certificate | `{ id, valueWei, companyAddress }` | `{ message, txHash, blockNumber }` |
| POST | `/certificates/retire` | Retire certificate | `{ id, retireByAddress }` | `{ message, txHash }` |

#### Merkle Endpoints (`/merkle`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/merkle/tree` | Get Merkle tree | - | `{ root, leaves: [...] }` |
| POST | `/merkle/proof` | Get Merkle proof | `{ label }` or `{ txHash }` | `{ proof: [...], root, leaf }` |

#### PDF Endpoints (`/api`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/download_certificate/:id` | Download certificate PDF | Binary PDF file |
| GET | `/api/download_receipt/:id/:txHash` | Download receipt PDF | Binary PDF file |

#### Block Explorer Endpoints (`/explorer`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/explorer/latest-block` | Get latest block number | `{ latestBlock: 125 }` |
| GET | `/explorer/block/:number` | Get block details | `{ number, hash, parentHash, ... }` |
| GET | `/explorer/blocks?from=X&to=Y` | Get block range | `{ blocks: [...] }` |
| GET | `/explorer/transaction/:txHash` | Get transaction details | `{ hash, from, to, blockNumber, ... }` |

#### Metrics Endpoints (`/metrics`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/metrics/all` | Get all metrics | `{ transactionMetrics: [...] }` |
| GET | `/metrics/throughput` | Get TPS, block time | `{ tps, avgBlockTime, blocks: [...] }` |
| GET | `/metrics/latency-stats` | Get latency stats | `{ avgLatency, minLatency, maxLatency }` |
| POST | `/metrics/latency` | Record latency | `{ txHash, submittedAt }` | `{ message }` |
| GET | `/metrics/analytics` | Get blockchain analytics | `{ blocksAnalyzed, certsIssued, ... }` |

---

## Key Features

### 1. Multi-Producer & Multi-Company Support

**Backend Implementation:**
- `HARDHAT_ACCOUNTS` array stores test account keys
- `getContractForProducer(address)` returns contract with specific signer
- Each producer/company signs their own transactions

**Frontend Implementation:**
- Dropdown selectors on Producers/Companies pages
- Automatic fetching from `/admin/producers` and `/admin/companies`
- Display as P1, P2, P3 or C1, C2, C3

**Certificate Labeling:**
- Producer issues → `P1_ID5` (Producer 1, Certificate ID 5)
- Company purchases → `C1_ID5` (Company 1 owns Certificate ID 5)

### 2. Interval Mining (5-Second Blocks)

**Configuration:** `backend-node/hardhat/hardhat.config.js`

```javascript
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: 5000  // 5 seconds
    }
  }
}
```

**Benefits:**
- Multiple transactions per block
- Demonstrates Merkle tree construction
- Realistic blockchain simulation
- Batch processing efficiency

**Use Case:** Issue 3 certificates within 5 seconds → All in same block → Build Merkle tree with 3 leaves

### 3. PDF Generation with QR Codes

**Implementation:** `backend-node/src/api/pdf.js`

```javascript
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

router.get('/download_certificate/:id', async (req, res) => {
  const cert = await getCertificateService(req.params.id);

  // Generate QR code
  const qrCodeDataURL = await QRCode.toDataURL(
    `${process.env.BASE_URL}/certificate/${cert.id}`
  );

  // Create PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // Add content
  doc.fontSize(20).text('Solar Energy Certificate', { align: 'center' });
  doc.fontSize(12).text(`Certificate ID: ${cert.id}`);
  doc.fontSize(12).text(`Energy: ${cert.energyWh} Wh`);
  doc.image(qrCodeDataURL, { width: 100 });

  doc.end();
});
```

**Features:**
- Professional certificate layout
- QR code for verification
- Certificate details (ID, energy, owner, issuer, price)
- Download as PDF
- Purchase receipts with transaction details

### 4. Block Explorer

**Purpose:** Visualize blockchain structure for research/academic purposes

**Features:**
- Block list sidebar (last 20 blocks)
- Block details panel:
  - Block number, hash, parent hash
  - Timestamp, miner, difficulty
  - Gas limit, gas used
  - Nonce
  - Transaction list
- Search by block number
- Transaction details lookup

**Use Case:** Show professor blockchain structure, parent hash linking, Merkle roots

### 5. Metrics Dashboard

**Purpose:** Performance monitoring and analytics

**Metrics Collected:**
- **Throughput:** TPS (transactions per second), block time
- **Latency:** Average, min, max transaction confirmation time
- **Activity:** Certificates issued, purchased, retired

**Visualization:**
- Block time line chart
- Transactions per block bar chart
- Latency timeline
- Summary cards with live stats

**Auto-refresh:** Every 10 seconds

**Implementation:** Latency tracked in frontend (Producers/Companies pages), sent to backend via `POST /metrics/latency`

---

## Merkle Tree Implementation

### Purpose

Merkle trees provide cryptographic proof of certificate authenticity without exposing all blockchain data.

### Architecture

```
                    Merkle Root (0xABCD...)
                   /                    \
            Hash(L1+L2)                Hash(L3+L4)
           /          \                /          \
    Hash(Leaf1)  Hash(Leaf2)   Hash(Leaf3)  Hash(Leaf4)
        |             |              |             |
    P1_ID1|TX1   P2_ID2|TX2    C1_ID1|TX3   C2_ID2|TX4
```

### Leaf Format

```
Leaf Input: "LABEL|TRANSACTION_HASH"
Label: P{producerIndex}_ID{certificateId} or C{companyIndex}_ID{certificateId}
Hash: keccak256(leafInput)
```

**Example:**
```
Producer P1 issues certificate ID 5:
  Label: "P1_ID5"
  TxHash: "0x8f3d2a1b..."
  Leaf Input: "P1_ID5|0x8f3d2a1b..."
  Leaf Hash: keccak256("P1_ID5|0x8f3d2a1b...")
```

### Service Implementation

**File:** `backend-node/src/services/merkleService.js`

```javascript
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { contractRO, provider } from "./blockchain.js";

export async function buildMerkleTree() {
  // 1. Get latest block
  const latestBlock = await provider.getBlockNumber();

  // 2. Get registries
  const producers = (await contractRO.producers()).map(p => p.toLowerCase());
  const companies = (await contractRO.companies()).map(c => c.toLowerCase());

  // 3. Query events
  const issueFilter = contractRO.filters.CertificateIssued();
  const purchaseFilter = contractRO.filters.CertificatePurchased();

  const issued = await contractRO.queryFilter(issueFilter, 0, latestBlock);
  const purchases = await contractRO.queryFilter(purchaseFilter, 0, latestBlock);

  const leaves = [];

  // 4. Process issued certificates
  for (const ev of issued) {
    const certId = ev.args.id?.toString();
    const owner = ev.args.owner?.toLowerCase();

    const pIndex = producers.findIndex(p => p === owner);
    const label = pIndex >= 0 ? `P${pIndex + 1}_ID${certId}` : `ID${certId}`;

    const leafInput = `${label}|${ev.transactionHash}`;
    const leaf = ethers.keccak256(ethers.toUtf8Bytes(leafInput));

    leaves.push({ label, leaf, txHash: ev.transactionHash });
  }

  // 5. Process purchases
  for (const ev of purchases) {
    const certId = ev.args.id?.toString();
    const to = ev.args.to?.toLowerCase();

    const cIndex = companies.findIndex(c => c === to);
    const label = cIndex >= 0 ? `C${cIndex + 1}_ID${certId}` : `ID${certId}`;

    const leafInput = `${label}|${ev.transactionHash}`;
    const leaf = ethers.keccak256(ethers.toUtf8Bytes(leafInput));

    leaves.push({ label, leaf, txHash: ev.transactionHash });
  }

  // 6. Build tree
  const tree = new MerkleTree(
    leaves.map(l => l.leaf),
    ethers.keccak256,
    { sortPairs: true }
  );

  const root = tree.getRoot().toString('hex');

  return { root: `0x${root}`, leaves, tree };
}

export async function getMerkleProof(label) {
  const { tree, leaves } = await buildMerkleTree();

  const leafObj = leaves.find(l => l.label === label);
  if (!leafObj) {
    throw new Error(`Leaf with label ${label} not found`);
  }

  const proof = tree.getProof(leafObj.leaf).map(p => p.data.toString('hex'));
  const root = tree.getRoot().toString('hex');

  return {
    label: leafObj.label,
    leaf: leafObj.leaf,
    proof: proof.map(p => `0x${p}`),
    root: `0x${root}`,
    txHash: leafObj.txHash,
  };
}
```

### Verification Process

```javascript
// Get proof for certificate
const proof = await getMerkleProof("P1_ID5");

// Verify proof
const MerkleTree = require('merkletreejs');
const isValid = MerkleTree.verify(
  proof.proof,
  proof.leaf,
  proof.root,
  ethers.keccak256
);

console.log("Proof valid:", isValid);  // true or false
```

**Why This Matters:**
- O(log n) verification complexity vs O(n)
- Can prove certificate exists without downloading entire blockchain
- Used in Bitcoin, Ethereum, IPFS
- Essential for scaling blockchains

---

## Metrics & Monitoring

### Metrics Service

**File:** `backend-node/src/services/metrics.service.js`

### 1. Throughput Metrics

```javascript
export async function getThroughputService() {
  const latestBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, latestBlock - 100);

  let totalTxs = 0;
  let totalTime = 0;
  const recentBlocks = [];

  for (let i = fromBlock; i <= latestBlock; i++) {
    const block = await provider.getBlock(i);
    if (!block) continue;

    const txCount = block.transactions?.length || 0;
    totalTxs += txCount;

    if (i > fromBlock) {
      const prevBlock = await provider.getBlock(i - 1);
      if (prevBlock) {
        const blockTime = block.timestamp - prevBlock.timestamp;
        totalTime += blockTime;

        recentBlocks.push({
          number: block.number,
          timestamp: block.timestamp,
          blockTime: blockTime,
          transactions: txCount
        });
      }
    }
  }

  const avgBlockTime = totalTime / Math.max(1, latestBlock - fromBlock);
  const tps = totalTime > 0 ? totalTxs / totalTime : 0;

  return {
    tps: tps.toFixed(2),
    avgBlockTime: avgBlockTime.toFixed(2),
    totalTransactions: totalTxs,
    blocksAnalyzed: latestBlock - fromBlock,
    recentBlocks: recentBlocks.slice(-20)  // Last 20 blocks
  };
}
```

### 2. Latency Tracking

```javascript
// In-memory storage (replace with DB for production)
const transactionMetrics = [];

export async function calculateLatencyService(txHash, submittedAt) {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error("Transaction not found");
  }

  const block = await provider.getBlock(receipt.blockNumber);
  const confirmedAt = block.timestamp * 1000; // Convert to ms

  const latency = confirmedAt - submittedAt;

  transactionMetrics.push({
    txHash,
    submittedAt,
    confirmedAt,
    latency,
    blockNumber: receipt.blockNumber
  });

  return { latency, blockNumber: receipt.blockNumber };
}

export function getLatencyStatsService() {
  if (transactionMetrics.length === 0) {
    return { avgLatency: 0, minLatency: 0, maxLatency: 0, count: 0 };
  }

  const latencies = transactionMetrics.map(m => m.latency);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);

  return {
    avgLatency: avgLatency.toFixed(2),
    minLatency,
    maxLatency,
    count: latencies.length,
    transactions: transactionMetrics
  };
}
```

### 3. Blockchain Analytics

```javascript
export async function getBlockchainAnalyticsService() {
  const latestBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, latestBlock - 1000);

  // Query events
  const issueFilter = contractRO.filters.CertificateIssued();
  const purchaseFilter = contractRO.filters.CertificatePurchased();
  const retireFilter = contractRO.filters.CertificateRetired();

  const issued = await contractRO.queryFilter(issueFilter, fromBlock, latestBlock);
  const purchased = await contractRO.queryFilter(purchaseFilter, fromBlock, latestBlock);
  const retired = await contractRO.queryFilter(retireFilter, fromBlock, latestBlock);

  return {
    blocksAnalyzed: latestBlock - fromBlock + 1,
    certificatesIssued: issued.length,
    certificatesPurchased: purchased.length,
    certificatesRetired: retired.length,
    totalEvents: issued.length + purchased.length + retired.length
  };
}
```

### Frontend Integration

**Automatic Latency Tracking:**

```javascript
// In Producers.jsx and Companies.jsx
import { recordLatency } from '../api/metrics';

async function handleTransaction() {
  const submittedAt = Date.now();

  const response = await api.post('/producers/issue', {...});

  if (response.data?.txHash) {
    try {
      await recordLatency(response.data.txHash, submittedAt);
    } catch (err) {
      console.warn("Failed to record latency:", err);
    }
  }
}
```

---

## Security Considerations

### Development vs Production

**⚠️ CRITICAL: This codebase is for development/testing only**

### Current Security Limitations

1. **Hardcoded Private Keys**
   - `HARDHAT_ACCOUNTS` array contains test account keys
   - **NEVER** use in production
   - **SOLUTION**: Use HSM, KMS, or hardware wallets

2. **In-Memory Data Storage**
   - `transactionMetrics` stored in memory
   - Data lost on server restart
   - **SOLUTION**: Use PostgreSQL, MongoDB, or Redis

3. **No Authentication**
   - Admin panel accessible to anyone
   - No JWT/session management
   - **SOLUTION**: Implement OAuth2, JWT, or session-based auth

4. **No Rate Limiting**
   - API endpoints unprotected
   - Vulnerable to DoS
   - **SOLUTION**: Use `express-rate-limit`

5. **CORS Wide Open**
   - Accepts requests from any origin
   - **SOLUTION**: Restrict to specific domains

6. **No Input Sanitization**
   - Basic validation only
   - **SOLUTION**: Use `express-validator`, `joi`

7. **Unencrypted HTTP**
   - No HTTPS
   - **SOLUTION**: Use SSL/TLS certificates

### Recommended Production Changes

```javascript
// 1. Environment-based key management
const wallet = new ethers.Wallet(
  process.env.PRODUCTION_PRIVATE_KEY,
  provider
);

// 2. Database for metrics
import { Pool } from 'pg';
const db = new Pool({ connectionString: process.env.DATABASE_URL });
await db.query('INSERT INTO metrics ...');

// 3. Authentication middleware
import jwt from 'jsonwebtoken';
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token...
  next();
};

// 4. Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// 5. CORS restriction
app.use(cors({
  origin: 'https://your-production-domain.com',
  credentials: true
}));
```

### Smart Contract Security

**✅ Good Practices Implemented:**
1. Checks-Effects-Interactions pattern
2. Use of `call{value}` instead of `transfer/send`
3. Access control modifiers
4. Input validation
5. Event emission for transparency

**⚠️ Additional Recommendations:**
1. **Audit**: Get professional security audit before mainnet
2. **Reentrancy Guard**: Consider OpenZeppelin's `ReentrancyGuard`
3. **Pausable**: Implement emergency pause functionality
4. **Upgradeable**: Consider proxy pattern for upgrades
5. **Testing**: Comprehensive unit and integration tests

---

## Deployment Guide

### Local Development Deployment

#### Prerequisites
- Node.js 18.x+
- npm 9.x+
- MetaMask browser extension
- Git

#### Step-by-Step Deployment

**1. Clone Repository**
```bash
cd /home/lenovo
git clone <your-repo-url> SEC_DAPP
cd SEC_DAPP
```

**2. Install Dependencies**
```bash
# Backend
cd backend-node
npm install

# Hardhat
cd hardhat
npm install

# Frontend
cd ../../frontend-vite
npm install
```

**3. Start Hardhat Node**
```bash
cd /home/lenovo/SEC_DAPP/backend-node/hardhat
npx hardhat node
```
Keep this terminal running. Note the accounts and private keys printed.

**4. Deploy Smart Contract**

Open new terminal:
```bash
cd /home/lenovo/SEC_DAPP/backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
```
**Copy the contract address** from output!

**5. Configure Environment Variables**

Update `backend-node/.env`:
```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PORT=5000
```

Update `frontend-vite/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**6. Start Backend**
```bash
cd /home/lenovo/SEC_DAPP/backend-node
npm run dev
```
Backend running on http://localhost:5000

**7. Start Frontend**
```bash
cd /home/lenovo/SEC_DAPP/frontend-vite
npm run dev
```
Frontend running on http://localhost:5173

**8. Configure MetaMask**
- Add network: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import test accounts using private keys from Hardhat node

**9. Test Application**
- Open http://localhost:5173
- Connect MetaMask
- Navigate to Admin panel
- Register producers and companies
- Test certificate issuance and purchase

### Production Deployment (Testnet/Mainnet)

**⚠️ NOT RECOMMENDED WITHOUT SECURITY IMPROVEMENTS**

If deploying to production:

1. **Use Real Network**
   - Sepolia testnet (for testing)
   - Ethereum mainnet (for production)

2. **Update hardhat.config.js**
```javascript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.DEPLOYER_PRIVATE_KEY]
  }
}
```

3. **Deploy to Testnet**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. **Verify Contract on Etherscan**
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

5. **Use Production Infrastructure**
   - Database: PostgreSQL/MongoDB
   - Hosting: AWS, Google Cloud, Azure
   - CDN: Cloudflare
   - Monitoring: Datadog, New Relic
   - Logging: ELK stack

6. **Implement Security**
   - Authentication (JWT/OAuth2)
   - Rate limiting
   - Input sanitization
   - HTTPS/SSL
   - Environment variable management (AWS Secrets Manager)

---

## Appendix: Quick Reference

### Test Accounts (Hardhat)

| Role | Account # | Address | Use Case |
|------|-----------|---------|----------|
| Admin | #0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | Deploy, register |
| Producer P1 | #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | Issue certificates |
| Producer P2 | #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | Issue certificates |
| Producer P3 | #3 | 0x90F79bf6EB2c4f870365E785982E1f101E93b906 | Issue certificates |
| Company C1 | #4 | 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 | Purchase certificates |
| Company C2 | #5 | 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc | Purchase certificates |
| Company C3 | #6 | 0x976EA74026E726554dB657fA54763abd0C3a0aa9 | Purchase certificates |

All accounts have 10,000 ETH on Hardhat network.

### Key Commands

```bash
# Start Hardhat node
cd backend-node/hardhat && npx hardhat node

# Deploy contract
cd backend-node/hardhat && npx hardhat run scripts/deploy.js --network localhost

# Start backend
cd backend-node && npm run dev

# Start frontend
cd frontend-vite && npm run dev

# Compile contracts
cd backend-node && npm run hh compile

# Run tests (if available)
cd backend-node/hardhat && npx hardhat test
```

### Useful URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Hardhat RPC: http://127.0.0.1:8545
- Admin Panel: http://localhost:5173/admin
- Producers: http://localhost:5173/producers
- Companies: http://localhost:5173/companies
- Block Explorer: http://localhost:5173/explorer
- Metrics: http://localhost:5173/metrics

---

**End of Codebase Documentation**

For additional help, see:
- SETUP_GUIDE.md - Installation instructions
- WEBSITE_GUIDE.md - User guide
- CLAUDE.md - AI assistant instructions
- Individual guide files for specific features

**Version:** 1.0
**Last Updated:** 2025-11-25
**Status:** ✅ Complete and Production-Ready for Development/Testing
