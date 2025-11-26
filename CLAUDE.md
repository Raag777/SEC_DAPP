# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SEC_DAPP (Solar Energy Certificate Decentralized Application) is a blockchain-based system for managing renewable energy certificates. The system allows producers to issue solar energy certificates, companies to purchase them, and administrators to manage the ecosystem. It features Merkle tree verification for certificate authenticity and generates PDFs with QR codes for certificate validation.

## Architecture

### Three-Tier Structure

1. **Frontend** (`frontend-vite/`): React + Vite SPA with Tailwind CSS
2. **Backend** (`backend-node/`): Express.js REST API server
3. **Blockchain** (`backend-node/hardhat/`): Hardhat development environment with Solidity smart contracts

### Key Components

- **Smart Contract**: `SolarEnergyCertificate.sol` - Core blockchain logic managing roles (admins, producers, companies), certificate issuance, purchase/transfer, and retirement
- **Merkle Service**: Builds Merkle trees from blockchain events for certificate verification
- **Certificate Store**: In-memory cache for certificate data with labels (P1_ID5, C2_ID7)
- **PDF Generation**: Creates certificates with QR codes and Merkle proofs
- **Wallet Integration**: Frontend connects to MetaMask for blockchain transactions

### Backend Service Layer

The backend follows a layered architecture:
- **API routes** (`src/api/`) - Express routers
- **Controllers** (`src/controllers/`) - Request handlers
- **Services** (`src/services/`) - Business logic and blockchain interaction
- **Utils** (`src/utils/`) - Validation and helpers

### Frontend Architecture

- **Context**: `ContractProvider` wraps the app with blockchain connection state
- **Hooks**: `useWallet` for wallet connection management
- **Pages**: Role-based views (Admin, Producers, Companies, Certificate View)
- **API layer**: Axios client with centralized configuration

## Development Commands

### Blockchain (Hardhat)

Start local blockchain node:
```bash
cd backend-node/hardhat
npx hardhat node
```

Deploy contract to local network:
```bash
cd backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
```

Compile contracts:
```bash
cd backend-node
npm run hh compile
```

### Backend

Start development server with hot reload:
```bash
cd backend-node
npm run dev
```

Start production server:
```bash
cd backend-node
npm start
```

### Frontend

Start development server:
```bash
cd frontend-vite
npm run dev
```

Build for production:
```bash
cd frontend-vite
npm run build
```

Preview production build:
```bash
cd frontend-vite
npm run preview
```

Lint code:
```bash
cd frontend-vite
npm run lint
```

## Environment Configuration

### Backend `.env` (backend-node/.env)

Required environment variables:
```
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x...  # Account #0 from Hardhat node (admin/deployer)
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PORT=5000
```

**IMPORTANT**: `PRIVATE_KEY` must be account #0 from the Hardhat node for admin operations.

## Smart Contract Details

### Contract Address
Default local deployment: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Key Functions
- **Admin**: `registerProducer()`, `registerCompany()`, `setMinEnergyWh()`, `setDefaultPriceWei()`
- **Producer**: `issueCertificate()`, `setProducerPrice()`
- **Company**: `purchaseCertificate()` (payable)
- **Anyone**: `retireCertificate()` (owner/company/admin only)

### Events
- `CertificateIssued` - Emitted when producer issues certificate
- `CertificatePurchased` - Emitted when certificate is purchased/transferred
- `CertificateRetired` - Emitted when certificate is retired

The Merkle service builds trees from transaction hashes of these events.

## Certificate Labeling System

Certificates use structured labels for Merkle tree leaves:
- **Producer issuance**: `P{producerIndex}_ID{certificateId}` (e.g., P1_ID5)
- **Company purchase**: `C{companyIndex}_ID{certificateId}` (e.g., C2_ID7)

Leaf format: `keccak256("LABEL|TXHASH")`

## API Endpoints

### Admin (`/admin`)
- `GET /admin/producers` - List all registered producers
- `GET /admin/companies` - List all registered companies
- `POST /admin/registerProducer` - Register new producer
- `POST /admin/removeProducer` - Remove producer
- `POST /admin/registerCompany` - Register new company
- `POST /admin/removeCompany` - Remove company
- `POST /admin/setMinEnergy` - Set minimum energy requirement
- `POST /admin/setDefaultPrice` - Set default certificate price

### Producers (`/producers`)
- `POST /producers/setPrice` - Set producer-specific pricing
- `POST /producers/issue` - Issue new certificate

### Companies (`/companies`)
- `POST /companies/purchase` - Purchase certificate

### Certificates (`/certificates`)
- `GET /certificates/:id` - Get certificate details
- `GET /certificates/owner/:address` - Get certificates by owner
- `POST /certificates/retire` - Retire certificate

### Merkle (`/merkle`)
- `GET /merkle/tree` - Get Merkle tree root and leaves
- `POST /merkle/proof` - Get Merkle proof for certificate

### PDF (`/api`)
- `GET /api/certificate-pdf/:id` - Generate certificate PDF
- `GET /api/purchase-receipt/:id` - Generate purchase receipt PDF

## Blockchain Interaction Patterns

### Read Operations (contractRO)
Use the read-only contract instance from `services/blockchain.js`:
```javascript
import { contractRO } from '../services/blockchain.js';
const cert = await contractRO.getCertificate(id);
```

### Write Operations (contractRW)
Use the read-write contract instance with wallet signer:
```javascript
import { contractRW } from '../services/blockchain.js';
const tx = await contractRW.issueCertificate(owner, energyWh);
await tx.wait();
```

### Event Querying
Query past events for Merkle tree building:
```javascript
const filter = contract.filters.CertificateIssued();
const events = await contract.queryFilter(filter, fromBlock, toBlock);
```

## Testing Workflow

1. Start Hardhat node: `cd backend-node/hardhat && npx hardhat node`
2. Deploy contract (note the address output)
3. Update `backend-node/.env` with contract address
4. Start backend: `cd backend-node && npm run dev`
5. Start frontend: `cd frontend-vite && npm run dev`
6. Connect MetaMask to localhost:8545 (Chain ID: 31337)
7. Import test accounts from Hardhat node output

## Common Development Patterns

### Adding New API Endpoint
1. Create controller in `backend-node/src/controllers/`
2. Add route in corresponding router file in `src/api/`
3. Import and use route in `src/server.js`
4. Create corresponding API function in frontend `src/api/`

### Adding New Smart Contract Function
1. Update `SolarEnergyCertificate.sol`
2. Recompile: `npm run hh compile`
3. Copy ABI from `artifacts/` to `backend-node/src/abi/` and `frontend-vite/src/abi/`
4. Redeploy contract and update `CONTRACT_ADDRESS` in .env
5. Update service layers to use new function

### Updating Merkle Tree Logic
The Merkle service in `backend-node/src/services/merkleService.js` queries blockchain events. When adding new event types or changing label formats, update:
1. Event filter queries
2. Label generation logic
3. Leaf input formatting

## Important Notes

- The backend stores certificate metadata in-memory (`certificateStore.js`). Data is lost on restart. For production, integrate a database.
- Hardhat node provides 20 test accounts with 10000 ETH each
- The first account (index 0) is used as the contract deployer and default admin
- MetaMask must be configured to localhost:8545 with Chain ID 31337 for local development
- PDF generation uses PDFKit and requires certificate data from both blockchain and in-memory store
- Merkle proofs are regenerated on-demand by querying all historical events
