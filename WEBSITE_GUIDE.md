# SEC_DAPP Website User Guide

Complete step-by-step guide for using the Solar Energy Certificate DApp website.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Running the Application](#running-the-application)
3. [MetaMask Setup](#metamask-setup)
4. [Page-by-Page Guide](#page-by-page-guide)
5. [Block Explorer Guide](#block-explorer-guide)
6. [Metrics Dashboard Guide](#metrics-dashboard-guide)
7. [Generating Graphs for Your Paper](#generating-graphs-for-your-paper)
8. [Complete Workflow Example](#complete-workflow-example)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Ensure you have installed:
- ✅ Node.js (v16 or higher)
- ✅ MetaMask browser extension
- ✅ Git

### Quick Start Commands

Open **3 separate terminals**:

**Terminal 1: Start Hardhat Blockchain**
```bash
cd backend-node/hardhat
npx hardhat node
```
**Keep this running!** You'll see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

**Terminal 2: Start Backend Server**
```bash
cd backend-node
npm run dev
```
**Output**: 🚀 Backend running on http://localhost:5000

**Terminal 3: Start Frontend**
```bash
cd frontend-vite
npm run dev
```
**Output**:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Verify Everything is Running

1. **Hardhat Node**: http://127.0.0.1:8545 (no UI, just running)
2. **Backend API**: http://localhost:5000 (should show "SEC Backend Running...")
3. **Frontend**: http://localhost:5173 (should show website)

---

## Running the Application

### First Time Setup (One-time only)

#### Step 1: Install Dependencies

```bash
# Backend dependencies
cd backend-node
npm install

# Hardhat dependencies
cd hardhat
npm install

# Frontend dependencies
cd ../../frontend-vite
npm install
```

#### Step 2: Deploy Smart Contract

```bash
cd backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
```

**Output**:
```
Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Contract deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**IMPORTANT**: Copy the contract address!

#### Step 3: Update Environment Files

**Backend** (`backend-node/.env`):
```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
PORT=5000
```

**Frontend** (`frontend-vite/.env`):
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

#### Step 4: Update ABIs (if contract changed)

```bash
# Copy ABI to backend
cd backend-node
node -e "const artifact = require('./hardhat/artifacts/contracts/SolarEnergyCertificate.sol/SolarEnergyCertificate.json'); console.log(JSON.stringify(artifact.abi, null, 2));" > src/abi/SolarEnergyCertificate.json

# Copy ABI to frontend
cd ../frontend-vite
node -e "const artifact = require('../backend-node/hardhat/artifacts/contracts/SolarEnergyCertificate.sol/SolarEnergyCertificate.json'); console.log(JSON.stringify(artifact.abi, null, 2));" > src/abi/SolarEnergyCertificate.json
```

### Daily Usage (After setup)

Just run the 3 commands in order:

```bash
# Terminal 1
cd backend-node/hardhat && npx hardhat node

# Terminal 2
cd backend-node && npm run dev

# Terminal 3
cd frontend-vite && npm run dev
```

Then open: http://localhost:5173

---

## MetaMask Setup

### Install MetaMask

1. Go to https://metamask.io/
2. Click "Download"
3. Install browser extension
4. Create wallet (set password, save seed phrase)

### Connect to Hardhat Network

1. Open MetaMask
2. Click network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
5. Click "Save"

### Import Test Accounts

You need to import accounts from Hardhat for testing.

#### Import Account #0 (Admin/Deployer)

1. MetaMask → Click account icon → "Import Account"
2. Paste private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
3. Click "Import"
4. Rename to "Admin" (click account → ⋮ → Account details → Pencil icon)

#### Import Account #1 (Producer)

1. Import Account
2. Private key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
3. Rename to "Producer 1"

#### Import Account #2 (Company)

1. Import Account
2. Private key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
3. Rename to "Company 1"

**Your MetaMask should now have**:
- ✅ Admin (0xf39F...) - 10000 ETH
- ✅ Producer 1 (0x7099...) - 10000 ETH
- ✅ Company 1 (0x3C44...) - 10000 ETH

---

## Page-by-Page Guide

### Home Page (`/`)

**Purpose**: Landing page and overview

**What you see**:
- Welcome message
- Project description
- Quick links to other pages

**Actions**:
- Click "Connect Wallet" to connect MetaMask
- Navigate to other pages via navbar

---

### Admin Panel (`/admin`)

**Purpose**: Manage producers, companies, and system settings

**Who can use**: Admin account only (Account #0)

#### Step 1: Switch to Admin Account

1. Open MetaMask
2. Select "Admin" account
3. Click "Connect Wallet" on website

#### Step 2: Register a Producer

1. Go to `/admin` page
2. Find "Register Producer" section
3. Enter producer address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
4. Click "Register Producer"
5. Wait for confirmation
6. **Result**: Producer is registered, can now issue certificates

#### Step 3: Register a Company

1. Find "Register Company" section
2. Enter company address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
3. Click "Register Company"
4. **Result**: Company is registered, can now purchase certificates

#### Step 4: Set Minimum Energy Requirement

1. Find "Set Minimum Energy" section
2. Enter value in Wh (e.g., `1000`)
3. Click "Set Min Energy"
4. **Result**: Certificates must have at least this much energy

#### Step 5: Set Default Price

1. Find "Set Default Price" section
2. Enter price in Wei (e.g., `1000000000000000000` = 1 ETH)
3. Click "Set Default Price"
4. **Result**: Default price for certificates

**Admin Actions Summary**:
```
✅ Register Producer → Allows address to issue certificates
✅ Remove Producer → Revokes issuing rights
✅ Register Company → Allows address to purchase certificates
✅ Remove Company → Revokes purchasing rights
✅ Set Min Energy → Minimum Wh required for certificates
✅ Set Default Price → Default certificate price in Wei
```

---

### Producers Page (`/producers`)

**Purpose**: Issue solar energy certificates

**Who can use**: Registered producers only

#### Step 1: Switch to Producer Account

1. MetaMask → Select "Producer 1" account
2. Website → Click "Connect Wallet"

#### Step 2: Set Producer-Specific Price (Optional)

1. Find "Set Producer Price" section
2. Enter price in Wei (e.g., `2000000000000000000` = 2 ETH)
3. Click "Set Price"
4. **Result**: Your certificates will use this price instead of default

#### Step 3: Issue a Certificate

1. Find "Issue Certificate" section
2. **Owner Address**: Enter who will receive the certificate
   - For yourself: Use your own address (0x7099...)
   - For a company: Use company address (0x3C44...)
3. **Energy (Wh)**: Enter energy amount (e.g., `5000`)
   - Must be ≥ minimum energy (1000 Wh)
4. Click "Issue Certificate"
5. **Backend processes the transaction**
6. **Result**:
   ```
   ✅ Certificate issued!
   Certificate ID: 1
   Transaction Hash: 0x8f3d2a1b...
   Block Number: 123
   ```

#### Step 4: View Your Certificates

1. Find "My Certificates" section
2. Click "Load My Certificates"
3. **Result**: List of certificate IDs you issued

**Producer Workflow**:
```
1. Get registered by admin
2. (Optional) Set custom price
3. Issue certificates for customers
4. Track issued certificates
```

---

### Companies Page (`/companies`)

**Purpose**: Purchase and manage certificates

**Who can use**: Registered companies

#### Step 1: Switch to Company Account

1. MetaMask → Select "Company 1"
2. Website → "Connect Wallet"

#### Step 2: Browse Available Certificates

1. Find "Available Certificates" section
2. Enter certificate ID to check (e.g., `1`)
3. Click "Get Certificate Details"
4. **Result**: Shows owner, energy, price, retired status

#### Step 3: Purchase a Certificate

1. Find "Purchase Certificate" section
2. **Certificate ID**: Enter ID (e.g., `1`)
3. **Value (Wei)**: Enter price in Wei (must match certificate price)
   - Example: `2000000000000000000` (2 ETH)
4. Click "Purchase Certificate"
5. **MetaMask popup appears** → Confirm transaction
6. Wait for confirmation
7. **Result**:
   ```
   ✅ Certificate purchased!
   Transaction Hash: 0x2c1a9f3b...
   Block Number: 124
   ```

#### Step 4: View Owned Certificates

1. Find "My Certificates" section
2. Enter your address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
3. Click "Load Certificates"
4. **Result**: List of certificate IDs you own

#### Step 5: Retire a Certificate

1. Find "Retire Certificate" section
2. Enter certificate ID you own (e.g., `1`)
3. Click "Retire Certificate"
4. **Result**: Certificate marked as retired (can't be transferred again)

**Company Workflow**:
```
1. Get registered by admin
2. Browse available certificates
3. Purchase certificate (pays in ETH)
4. Own the certificate (proof of renewable energy use)
5. Retire certificate (claim environmental benefit)
```

---

### Certificate View Page (`/certificate/:id`)

**Purpose**: View detailed information about a specific certificate

#### How to Access

**Method 1**: Direct URL
- Navigate to: http://localhost:5173/certificate/1

**Method 2**: From search
- Enter certificate ID on any page
- Click "View Details"

#### What You See

```
┌─────────────────────────────────────────────────────┐
│         Certificate #1 Details                       │
├─────────────────────────────────────────────────────┤
│ ID: 1                                                │
│ Owner: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC   │
│ Energy: 5000 Wh (5.000 kWh)                         │
│ Issuer: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8  │
│ Price: 2000000000000000000 Wei (2.0 ETH)            │
│ Timestamp: 2025-01-23 14:30:45                       │
│ Status: Active / Retired                             │
├─────────────────────────────────────────────────────┤
│ Actions:                                             │
│ [Download PDF] [Download Receipt] [View Merkle Proof]│
└─────────────────────────────────────────────────────┘
```

#### Actions Available

1. **Download Certificate PDF**
   - Click "Download PDF"
   - Opens certificate with QR code
   - Use for proof of renewable energy

2. **Download Purchase Receipt**
   - Click "Download Receipt" (if purchased)
   - Shows transaction details
   - Buyer, seller, price, timestamp

3. **View Merkle Proof**
   - Click "View Merkle Proof"
   - Shows cryptographic proof
   - Verify certificate authenticity

---

## Block Explorer Guide

**Purpose**: Visualize blockchain structure for your paper

**URL**: http://localhost:5173/explorer

### Overview

The Block Explorer shows the internal structure of the blockchain, including:
- Block headers (hash, parentHash, nonce, timestamp, difficulty)
- Block body (transactions, gas usage)
- Transaction details
- Chain continuity

### Step-by-Step Usage

#### Step 1: View Recent Blocks

1. Navigate to `/explorer`
2. **Left sidebar**: Shows last 20 blocks
3. **Each block displays**:
   - Block number
   - Number of transactions
   - Timestamp

#### Step 2: Select a Block

1. Click any block in the sidebar
2. **Block details appear on the right**

#### Step 3: Understand Block Structure

**Block Header** (metadata):
```
┌──────────────────────────────────────┐
│ Block Number: 123                    │  ← Sequential ID
│ Timestamp: 2025-01-23 14:30:45       │  ← When mined
│ Nonce: 0x0000000000000000            │  ← Proof-of-work value
│ Miner: 0xf39Fd6e51aad88F6F4ce6...    │  ← Who mined it
│ Difficulty: 0                         │  ← Mining difficulty
│ Gas Limit: 30,000,000                 │  ← Max gas allowed
│ Gas Used: 245,871                     │  ← Gas actually used
│ Gas Used %: 0.82%                     │  ← Usage percentage
├──────────────────────────────────────┤
│ Block Hash:                           │
│ 0x7a4bc9f2d8e3b5a1c6d4e7f8a9b2c5d... │  ← Unique identifier
│                                       │
│ Parent Hash:                          │
│ 0x3f2c8a1b7d9e4c6a5b8f1e2d3c7a9b... │  ← Links to previous block
└──────────────────────────────────────┘
```

**Key Concepts**:

1. **Block Hash**: Unique identifier calculated from block contents
   - Changes if ANY data in block changes
   - Used to detect tampering

2. **Parent Hash**: Hash of previous block
   - Creates the "chain" in blockchain
   - Block 123 parent hash = Block 122 hash
   - Ensures ordering and immutability

3. **Nonce**: Random number used in mining
   - Miners adjust this to find valid hash
   - Part of proof-of-work consensus

4. **Timestamp**: When block was mined
   - Unix timestamp (seconds since 1970)
   - Used for time-based logic

5. **Gas**: Computation cost
   - Each transaction consumes gas
   - Total gas used ≤ gas limit

**Block Body** (content):
```
┌──────────────────────────────────────┐
│ Transactions (3):                     │
├──────────────────────────────────────┤
│ 1. 0x8f3d2a1b... (CertificateIssued)  │
│ 2. 0x2c1a9f3b... (CertificatePurchased)│
│ 3. 0x9e5b4c7a... (CertificateRetired)  │
└──────────────────────────────────────┘
```

#### Step 4: Search for Specific Block

1. Enter block number in search box
2. Click "Search"
3. **Result**: Block details displayed

#### Step 5: Refresh for Latest Blocks

1. Click "Refresh" button
2. **Result**: Updates to latest blockchain state

### Using Block Explorer for Your Paper

#### Screenshot 1: Block Header Structure

**What to capture**:
- Full block details showing all header fields
- Highlight: hash, parentHash, nonce, timestamp

**How to use in paper**:
```
Figure X: Blockchain Block Structure
Caption: "Block header containing cryptographic hash, parent hash
linking to previous block, proof-of-work nonce, and timestamp"
```

#### Screenshot 2: Block Chain Visualization

**What to show**:
- Recent blocks list (sidebar)
- Multiple blocks with their numbers and timestamps

**How to use in paper**:
```
Figure X: Blockchain Sequence
Caption: "Sequence of blocks forming an immutable chain,
with each block linked to its predecessor via parent hash"
```

#### Screenshot 3: Block with Transactions

**What to capture**:
- Block containing certificate transactions
- Show transaction hashes and types

**How to use in paper**:
```
Figure X: Transactions in a Block
Caption: "Block containing multiple certificate-related transactions
including issuance, purchase, and retirement operations"
```

### Explaining Block Structure in Your Paper

**Introduction Section**:
> "The blockchain consists of a series of blocks, each containing
> a header with metadata and a body with transactions. The block
> header includes a cryptographic hash (Figure X) computed from
> the block contents, ensuring data integrity. Each block also
> stores the hash of the previous block (parent hash), creating
> an immutable chain where any modification to a previous block
> would invalidate all subsequent blocks."

**Implementation Section**:
> "Figure X shows the structure of a block in our implementation.
> Key components include:
> - **Block Hash**: SHA-256 hash uniquely identifying the block
> - **Parent Hash**: Link to previous block, ensuring chronological order
> - **Nonce**: Proof-of-work value used in consensus mechanism
> - **Timestamp**: Block creation time for temporal ordering
> - **Transactions**: List of certificate operations (issue, purchase, retire)
> - **Gas Usage**: Computational cost metrics"

---

## Metrics Dashboard Guide

**Purpose**: Collect performance data and generate graphs for your paper

**URL**: http://localhost:5173/metrics

### Overview

The Metrics Dashboard provides:
- **Throughput metrics**: TPS, block time, transactions per block
- **Latency metrics**: Transaction confirmation times
- **Activity summary**: Certificates issued/purchased/retired
- **Interactive graphs**: For your research paper

### Step-by-Step Usage

#### Step 1: Generate Transaction Activity

**Before viewing metrics, you need blockchain activity!**

1. Go to `/producers` → Issue 10 certificates
2. Go to `/companies` → Purchase 5 certificates
3. Go to `/companies` → Retire 2 certificates
4. **Result**: Blockchain has transactions across multiple blocks

#### Step 2: Open Metrics Dashboard

1. Navigate to `/metrics`
2. Dashboard loads automatically
3. **Auto-refresh**: Updates every 10 seconds

#### Step 3: View Summary Cards

**Top of page shows**:
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Current Block│ Total Certs  │ Avg Block    │    TPS       │
│     125      │      10      │    1.2s      │   0.83       │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Metrics Explained**:

1. **Current Block**: Latest block number
   - Shows blockchain progress
   - Increments with each transaction batch

2. **Total Certificates**: Count of all certificates issued
   - Cumulative across all producers
   - Retrieved from smart contract

3. **Avg Block Time**: Average time between blocks (seconds)
   - Calculated from last 100 blocks
   - Lower = faster confirmation
   - **For paper**: Report this as network performance

4. **TPS (Transactions Per Second)**:
   - Formula: Total Transactions / Time Span
   - Measures system throughput
   - **For paper**: Compare with other blockchains

#### Step 4: Analyze Throughput Graphs

**Graph 1: Block Time (Line Chart)**

**What it shows**:
- X-axis: Block number
- Y-axis: Time in seconds
- Line: Time between consecutive blocks

**How to read**:
- Flat line = consistent block time
- Spikes = delays in mining
- Low values = fast confirmations

**Screenshot for paper**:
- Take screenshot showing clear trend
- Include in Results section
- Caption: "Block generation time across X blocks"

**Graph 2: Transactions per Block (Bar Chart)**

**What it shows**:
- X-axis: Block number
- Y-axis: Transaction count
- Bars: Number of transactions in each block

**How to read**:
- Tall bars = many transactions (batch processing)
- Short bars = few transactions
- Empty (0) = no transactions in block

**Screenshot for paper**:
- Shows transaction distribution
- Caption: "Transaction distribution across blocks"

#### Step 5: Analyze Latency Metrics

**Latency Statistics Cards**:
```
┌──────────────┬──────────────┬──────────────┐
│ Avg Latency  │ Min Latency  │ Max Latency  │
│   1250 ms    │    800 ms    │   2100 ms    │
└──────────────┴──────────────┴──────────────┘
```

**What is latency?**
- Time from transaction submission to blockchain confirmation
- Lower = faster system
- Measured in milliseconds (ms)

**Graph: Transaction Latency Timeline**

**What it shows**:
- X-axis: Transaction number (sequential)
- Y-axis: Latency in milliseconds
- Line: Latency for each transaction

**How to read**:
- Flat line = consistent performance
- Outliers = occasional delays
- Trend = system behavior over time

**Screenshot for paper**:
- Shows latency distribution
- Caption: "Transaction confirmation latency over time"

#### Step 6: View Activity Summary

**Recent Activity** (bottom section):
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│Blocks Analyzed│ Certs Issued │Certs Purchased│ Certs Retired│
│    1001      │      45      │      32       │      12      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Use in paper**:
- Shows system usage
- Demonstrates real-world testing
- Include in Results section

#### Step 7: Refresh Data

1. Click "Refresh" button
2. **Result**: Updates all metrics and graphs
3. Use for real-time monitoring

### Generating Graphs for Your Paper

#### Graph 1: Throughput Analysis

**What to include**:
1. Screenshot of "Block Time" line chart
2. Screenshot of "Transactions per Block" bar chart

**Table to create**:
```
Table X: Throughput Metrics

Metric                | Value
---------------------|-------
Blocks Analyzed      | 100
Total Transactions   | 65
Time Span            | 78 seconds
Transactions/Second  | 0.83 TPS
Average Block Time   | 1.2 seconds
```

**Discussion in paper**:
> "System throughput was measured at 0.83 transactions per second
> (TPS) with an average block time of 1.2 seconds (Figure X).
> This is comparable to development blockchain networks and
> demonstrates sufficient performance for certificate management."

#### Graph 2: Latency Analysis

**What to include**:
1. Screenshot of "Transaction Latency" line chart

**Table to create**:
```
Table X: Latency Statistics

Statistic         | Value (ms)
-----------------|------------
Average Latency  | 1,250
Minimum Latency  | 800
Maximum Latency  | 2,100
Std Deviation    | 320
Sample Size      | 50 transactions
```

**Discussion in paper**:
> "Transaction confirmation latency averaged 1.25 seconds with
> a range of 0.8 to 2.1 seconds (Figure X). The relatively low
> latency ensures timely certificate issuance and transfers,
> meeting the requirements for real-world deployment."

#### Graph 3: System Activity

**Bar chart to create manually**:
```
Certificate Operations

Issued: ████████████████████████████ 45
Purchased: ████████████████████ 32
Retired: ████████ 12
```

**Discussion in paper**:
> "Over the testing period, the system processed 45 certificate
> issuances, 32 purchases, and 12 retirements across 1,001 blocks,
> demonstrating stable operation under varied workloads."

#### Comparison Table for Paper

**Create this table**:
```
Table X: Blockchain Platform Comparison

Platform        | TPS  | Block Time | Finality  | Notes
----------------|------|------------|-----------|------------------
This Work       | 0.83 | 1.2s       | Instant   | Hardhat (dev)
Ethereum        | 15   | 12s        | ~15 min   | Mainnet
Polygon         | 65   | 2s         | ~2 min    | PoS sidechain
Hyperledger     | 3500 | <1s        | Instant   | Permissioned
```

**Discussion**:
> "While our development environment shows lower TPS than
> production blockchains, the architecture is compatible with
> high-performance networks like Polygon (65 TPS) or Hyperledger
> (3500 TPS) for production deployment."

---

## Generating Graphs for Your Paper

### Required Graphs Checklist

For a complete research paper, capture these visualizations:

#### ✅ Graph 1: Block Structure Diagram
- **Source**: `/explorer` page
- **What to capture**: Single block with all details visible
- **Use in**: Implementation section
- **Caption**: "Blockchain block structure showing header and body components"

#### ✅ Graph 2: Block Chain Sequence
- **Source**: `/explorer` page sidebar
- **What to capture**: List of 10+ sequential blocks
- **Use in**: Background/Architecture section
- **Caption**: "Sequence of linked blocks forming the blockchain"

#### ✅ Graph 3: Block Time Chart
- **Source**: `/metrics` page
- **What to capture**: Line chart of block generation times
- **Use in**: Results section (Performance Analysis)
- **Caption**: "Block generation time across 100 blocks"

#### ✅ Graph 4: Transactions per Block
- **Source**: `/metrics` page
- **What to capture**: Bar chart of transaction distribution
- **Use in**: Results section (Throughput Analysis)
- **Caption**: "Transaction distribution across blocks"

#### ✅ Graph 5: Latency Timeline
- **Source**: `/metrics` page
- **What to capture**: Line chart of transaction latencies
- **Use in**: Results section (Latency Analysis)
- **Caption**: "Transaction confirmation latency over 50 transactions"

#### ✅ Graph 6: System Architecture Diagram
- **Source**: Create manually using draw.io or similar
- **Content**: Three-tier architecture (Frontend ↔ Backend ↔ Blockchain)
- **Use in**: System Design section
- **Caption**: "System architecture showing three-layer design"

#### ✅ Table 1: Performance Metrics Summary
```
Metric                    | Value
--------------------------|------------------
Average Block Time        | 1.2 seconds
Transactions Per Second   | 0.83 TPS
Average Latency           | 1,250 ms
Min Latency               | 800 ms
Max Latency               | 2,100 ms
Blocks Analyzed           | 100
Total Certificates Issued | 45
```

#### ✅ Table 2: Smart Contract Functions
```
Function              | Access Control | Gas Cost | Purpose
---------------------|----------------|----------|------------------
issueCertificate     | Producer only  | ~80k     | Create certificate
purchaseCertificate  | Anyone         | ~50k     | Transfer ownership
retireCertificate    | Owner only     | ~30k     | Retire certificate
registerProducer     | Admin only     | ~45k     | Add producer
```

### Screenshot Best Practices

1. **High Resolution**: Use full-screen browser (F11)
2. **Clean Background**: Hide bookmarks bar, extensions
3. **Good Contrast**: Use light mode for printing
4. **Annotations**: Add arrows/labels in image editor if needed
5. **Consistent Style**: Same zoom level, same theme for all screenshots

### Tools for Creating Diagrams

1. **draw.io** (free): https://app.diagrams.net/
   - Architecture diagrams
   - Flowcharts
   - Block structure visualization

2. **Excalidraw** (free): https://excalidraw.com/
   - Hand-drawn style diagrams
   - Quick sketches

3. **LaTeX TikZ** (for academic papers):
   - Professional publication-quality diagrams
   - Integrated with paper

---

## Complete Workflow Example

### Scenario: Complete Certificate Lifecycle

Let's walk through the entire process from start to finish.

#### Phase 1: Setup (5 minutes)

```bash
# Terminal 1: Start blockchain
cd backend-node/hardhat
npx hardhat node

# Terminal 2: Start backend
cd backend-node
npm run dev

# Terminal 3: Start frontend
cd frontend-vite
npm run dev
```

**Open browser**: http://localhost:5173

#### Phase 2: Admin Setup (2 minutes)

1. **MetaMask** → Select "Admin" account
2. **Website** → Click "Connect Wallet"
3. **Navigate** to `/admin`
4. **Register Producer**:
   - Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Click "Register Producer"
   - ✅ Confirmed
5. **Register Company**:
   - Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
   - Click "Register Company"
   - ✅ Confirmed
6. **Set Minimum Energy**: `1000` Wh
7. **Set Default Price**: `1000000000000000000` Wei (1 ETH)

#### Phase 3: Producer Issues Certificate (2 minutes)

1. **MetaMask** → Switch to "Producer 1"
2. **Website** → Click "Connect Wallet"
3. **Navigate** to `/producers`
4. **Set Producer Price** (optional):
   - Price: `2000000000000000000` (2 ETH)
   - Click "Set Price"
   - ✅ Confirmed
5. **Issue Certificate**:
   - Owner: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (self)
   - Energy: `5000` Wh
   - Click "Issue Certificate"
   - ✅ Confirmed
   - **Result**: Certificate ID: 1

#### Phase 4: Company Purchases Certificate (2 minutes)

1. **MetaMask** → Switch to "Company 1"
2. **Website** → Click "Connect Wallet"
3. **Navigate** to `/companies`
4. **Get Certificate Details**:
   - ID: `1`
   - Click "Get Details"
   - **Shows**: Owner, Energy, Price (2 ETH)
5. **Purchase Certificate**:
   - Certificate ID: `1`
   - Value: `2000000000000000000` Wei (2 ETH)
   - Click "Purchase"
   - **MetaMask** → Confirm transaction
   - ✅ Confirmed
   - **Result**: You now own certificate #1

#### Phase 5: View Certificate (1 minute)

1. **Navigate** to `/certificate/1`
2. **See details**:
   - ID: 1
   - Owner: Company 1 address
   - Energy: 5000 Wh
   - Price: 2 ETH
   - Issuer: Producer 1
   - Status: Active
3. **Download PDF**: Click "Download PDF"
   - Opens certificate with QR code
4. **Download Receipt**: Click "Download Receipt"
   - Shows purchase transaction details

#### Phase 6: Retire Certificate (1 minute)

1. **Navigate** to `/companies`
2. **Retire Certificate**:
   - Certificate ID: `1`
   - Click "Retire"
   - ✅ Confirmed
   - **Result**: Certificate marked as retired

#### Phase 7: Explore Blockchain (2 minutes)

1. **Navigate** to `/explorer`
2. **View recent blocks**: Sidebar shows all blocks
3. **Select a block**: Click block with transactions
4. **Examine**:
   - Block hash
   - Parent hash (links to previous block)
   - Timestamp
   - Transactions (should see your certificate operations)
5. **Take screenshot** for your paper

#### Phase 8: View Metrics (2 minutes)

1. **Navigate** to `/metrics`
2. **Dashboard shows**:
   - Current block number
   - Total certificates: 1
   - Average block time
   - TPS
3. **Scroll to graphs**:
   - Block Time chart
   - Transactions per Block chart
   - Latency Timeline (if you did multiple transactions)
4. **Take screenshots** for your paper

**Total time**: ~17 minutes for complete workflow!

### Repeat for More Data

To generate better graphs, repeat Phase 3-6 multiple times:
- Issue 10-20 certificates
- Purchase 5-10 certificates
- Retire 2-5 certificates
- **Result**: More data points = better graphs for your paper

---

## Troubleshooting

### Error: "Please install MetaMask"

**Cause**: MetaMask extension not installed or detected

**Solution**:
1. Install MetaMask from https://metamask.io
2. Refresh page
3. Click "Connect Wallet"

### Error: "Wrong network"

**Cause**: MetaMask not connected to Hardhat network

**Solution**:
1. MetaMask → Network dropdown → "Hardhat Local"
2. If not in list, add manually (Chain ID: 31337, RPC: http://127.0.0.1:8545)

### Error: "Transaction failed" or "Execution reverted"

**Possible causes**:

1. **Not authorized**:
   - Using wrong account (e.g., trying to issue as non-producer)
   - **Solution**: Switch to correct account in MetaMask

2. **Insufficient balance**:
   - Account doesn't have enough ETH
   - **Solution**: Use Hardhat test accounts (10000 ETH each)

3. **Invalid parameters**:
   - Energy below minimum
   - Wrong price
   - **Solution**: Check requirements, adjust values

4. **Contract not deployed**:
   - Backend can't find contract at address
   - **Solution**: Redeploy contract, update .env files

### Error: "Network Error" when calling API

**Cause**: Backend server not running or wrong URL

**Solution**:
1. Check backend is running: http://localhost:5000
2. Check VITE_BACKEND_URL in frontend/.env
3. Restart backend: `cd backend-node && npm run dev`

### Error: "could not decode result data"

**Cause**: ABI mismatch or wrong contract address

**Solution**:
1. Recompile: `cd backend-node && npm run hh compile`
2. Redeploy: `cd hardhat && npx hardhat run scripts/deploy.js --network localhost`
3. Update CONTRACT_ADDRESS in both .env files
4. Copy new ABI to backend and frontend
5. Restart backend

### Warning: Hardhat node restarted, data lost

**Cause**: Hardhat blockchain is ephemeral (resets on restart)

**Expected behavior**: This is normal for development

**Solution**:
1. After restart, redeploy contract
2. Re-register producers and companies
3. All previous certificates are lost (blockchain reset)

**For production**: Use persistent network (testnet or mainnet)

### Graph shows no data

**Cause**: No transactions have been made

**Solution**:
1. Perform transactions (issue, purchase, retire certificates)
2. Refresh metrics dashboard
3. Need at least 5-10 transactions for meaningful graphs

### MetaMask shows different balance

**Cause**: Hardhat network reset, but MetaMask cached old state

**Solution**:
1. MetaMask → Settings → Advanced → Reset Account
2. Confirms: "This will clear your transaction history"
3. Balance should show 10000 ETH again

### Page loads but shows errors

**Cause**: Blockchain or backend not accessible

**Check**:
1. Hardhat running? → http://127.0.0.1:8545 (should not show "connection refused")
2. Backend running? → http://localhost:5000 (should show "SEC Backend Running...")
3. Contract deployed? → Check .env has correct CONTRACT_ADDRESS

---

## Summary

### Key Pages

1. **`/admin`**: Manage producers, companies, settings
2. **`/producers`**: Issue certificates
3. **`/companies`**: Purchase and retire certificates
4. **`/certificate/:id`**: View certificate details
5. **`/explorer`**: Visualize blockchain structure
6. **`/metrics`**: Performance graphs and analytics

### Workflow

```
Admin → Register Producers/Companies
  ↓
Producer → Issue Certificates
  ↓
Company → Purchase Certificates
  ↓
Company → Retire Certificates
  ↓
Everyone → View on Explorer & Metrics
```

### For Your Paper

**Required screenshots**:
- ✅ Block structure from Explorer
- ✅ Block chain sequence
- ✅ Block time graph from Metrics
- ✅ Transactions per block graph
- ✅ Latency timeline graph

**Required data**:
- ✅ TPS (transactions per second)
- ✅ Average block time
- ✅ Latency statistics (avg, min, max)
- ✅ Total certificates processed

**Commands to run**:
```bash
# Start everything
cd backend-node/hardhat && npx hardhat node  # Terminal 1
cd backend-node && npm run dev                # Terminal 2
cd frontend-vite && npm run dev               # Terminal 3

# Access application
open http://localhost:5173
```

---

## Quick Reference

### Test Account Addresses

```
Admin:      0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Producer 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Company 1:  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

### Private Keys (for import)

```
Admin:      0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Producer 1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Company 1:  0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### Example Values

```
Energy:        5000 (Wh)
Min Energy:    1000 (Wh)
Default Price: 1000000000000000000 (Wei) = 1 ETH
Custom Price:  2000000000000000000 (Wei) = 2 ETH
```

### Wei Conversions

```
1 Wei          = 0.000000000000000001 ETH
1 Gwei         = 1,000,000,000 Wei
1 ETH          = 1,000,000,000,000,000,000 Wei (18 zeros)

Common values:
0.1 ETH  = 100000000000000000 Wei
1 ETH    = 1000000000000000000 Wei
2 ETH    = 2000000000000000000 Wei
10 ETH   = 10000000000000000000 Wei
```

---

**You're all set!** Follow this guide step-by-step to use the application and collect data for your research paper.
