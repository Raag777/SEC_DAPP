# Producer Selection & Certificate ID Naming Guide

## Overview

The Producers dashboard now supports selecting from multiple registered producer accounts and issues certificates with proper ID naming (P1_ID1, P2_ID1, etc.).

## What Changed

### 1. Backend Updates

#### blockchain.js
- **Added HARDHAT_ACCOUNTS array**: Contains 10 test accounts with their private keys from Hardhat node
- **Added `getContractForProducer(address)`**: Returns a contract instance signed by the specific producer
- **Multi-signer support**: Each producer can now sign their own transactions

#### producer.service.js
- **Updated `issueCertificateService()`**: Now accepts `producerAddr` parameter
- **Dynamic signer**: Uses the correct producer's private key to sign transactions

#### producer.controller.js
- **Added validation**: Requires `producerAddress` in request body
- **Pass-through**: Forwards producer address to service layer

### 2. Frontend Updates

#### Producers.jsx
- **Producer dropdown**: Select from registered producers (P1, P2, P3...)
- **Auto-fetch producers**: Loads from `/admin/producers` API
- **Certificate display**: Shows certificate IDs as P1_ID1, P2_ID3, etc.
- **Filter certificates**: Only shows certificates for the selected producer

## Certificate ID Naming

The certificate IDs are generated automatically by the Merkle service:

### Pattern
- **Issued by Producer**: `P{producerIndex}_ID{certificateId}`
  - Example: P1_ID1, P1_ID2, P2_ID1, P2_ID5
- **Purchased by Company**: `C{companyIndex}_ID{certificateId}`
  - Example: C1_ID1, C2_ID3

### How It Works
1. Producer P1 issues certificate → Gets ID 1 from smart contract → Labeled **P1_ID1**
2. Producer P2 issues certificate → Gets ID 2 from smart contract → Labeled **P2_ID2**
3. Producer P1 issues another → Gets ID 3 from smart contract → Labeled **P1_ID3**

The `producerIndex` comes from the order in the `producerList` array in the smart contract.

## Testing Steps

### Step 1: Start the System

```bash
# Terminal 1: Start Hardhat node
cd backend-node/hardhat
npx hardhat node

# Terminal 2: Deploy contract
cd backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
# Note the contract address

# Terminal 3: Start backend (update .env first)
cd backend-node
npm run dev

# Terminal 4: Start frontend
cd frontend-vite
npm run dev
```

### Step 2: Register Producers in Admin Panel

1. Go to **Admin Panel** (http://localhost:5173/admin)
2. Register at least 3 producers using Hardhat test accounts:
   - **P1**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - **P2**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
   - **P3**: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`

3. Verify they show as **P1, P2, P3** in the admin panel

### Step 3: Use Producer Dashboard

1. Go to **Producers Dashboard** (http://localhost:5173/producers)
2. You should see a dropdown: **"Select Producer Account"**
3. The dropdown will show:
   ```
   P1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   P2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
   P3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
   ```

### Step 4: Issue Certificates

**As Producer P1:**
1. Select **P1** from dropdown
2. Enter energy: `10` kWh
3. Click **"Issue Certificate as P1"**
4. Wait for confirmation
5. Certificate will be created with ID: **P1_ID1**

**As Producer P2:**
1. Select **P2** from dropdown
2. Enter energy: `15` kWh
3. Click **"Issue Certificate as P2"**
4. Certificate will be created with ID: **P2_ID2**

**As Producer P1 again:**
1. Select **P1** from dropdown
2. Enter energy: `20` kWh
3. Click **"Issue Certificate as P1"**
4. Certificate will be created with ID: **P1_ID3**

### Step 5: Verify Certificate IDs

Check the Merkle tree endpoint to see the labels:

```bash
curl http://localhost:5000/merkle/tree
```

You should see leaves like:
```json
{
  "root": "0x...",
  "leaves": [
    "0x... (P1_ID1|0xTXHASH)",
    "0x... (P2_ID2|0xTXHASH)",
    "0x... (P1_ID3|0xTXHASH)"
  ]
}
```

### Step 6: Verify Multiple Transactions Per Block

With the interval mining (5 seconds), you can:

1. **Quickly issue 3 certificates** (within 5 seconds):
   - P1: Issue 10 kWh
   - P2: Issue 15 kWh
   - P3: Issue 20 kWh

2. **Check Hardhat console** - All 3 should be in the same block:
   ```
   Block #2:
     Transaction 1: issueCertificate (P1)
     Transaction 2: issueCertificate (P2)
     Transaction 3: issueCertificate (P3)
   ```

3. **Build Merkle tree** from all transactions in Block #2

## Architecture Diagram

```
Frontend (Producers.jsx)
    ↓
    Select Producer (P1, P2, P3)
    ↓
    POST /producers/issue { owner, energyWh, producerAddress }
    ↓
Backend (producer.controller.js)
    ↓
    issueCertificateService(owner, energyWh, producerAddress)
    ↓
Blockchain Service (blockchain.js)
    ↓
    getContractForProducer(producerAddress)
    ↓
    Contract signed with P1's private key
    ↓
Smart Contract (SolarEnergyCertificate.sol)
    ↓
    issueCertificate() - Creates certificate with ID
    ↓
Merkle Service (merkleService.js)
    ↓
    Queries CertificateIssued events
    ↓
    Generates label: P{index}_ID{certId}
```

## Important Notes

1. **Private Keys in Development Only**
   - The HARDHAT_ACCOUNTS array contains hardcoded test account keys
   - **NEVER** use this approach in production
   - For production, use proper key management (HSM, KMS, etc.)

2. **Producer Index**
   - Producer index (P1, P2, P3) is determined by registration order
   - First registered producer = P1
   - Second registered producer = P2
   - And so on...

3. **Certificate ID**
   - Certificate ID is a global counter in the smart contract
   - It increments for every certificate issued, regardless of producer
   - P1_ID5 means: Issued by P1, but it's the 5th certificate overall

4. **Merkle Tree Labels**
   - Labels are created by the Merkle service, not stored on-chain
   - Format: `keccak256("LABEL|TXHASH")`
   - Used for generating Merkle proofs

## Troubleshooting

### "No private key found for producer"
- Make sure the producer address is registered
- Verify the address is in the HARDHAT_ACCOUNTS array
- Check case sensitivity (addresses should match exactly)

### "Producer address is required"
- Frontend must send `producerAddress` in the request
- Check browser console for API request payload

### Dropdown is empty
- Make sure producers are registered in Admin panel
- Check backend API: `GET /admin/producers`
- Restart backend if needed

### Certificates not showing
- Select a producer from the dropdown first
- Check if the producer has issued any certificates
- Verify the certificate store is populated

## Next Steps

For demonstrating to your professor:

1. **Register 3-5 producers** (P1 through P5)
2. **Issue multiple certificates** from each producer quickly
3. **Show the block** containing multiple transactions
4. **Display the Merkle tree** with P1_ID1, P2_ID3, etc. labels
5. **Generate Merkle proof** for any certificate
6. **Verify the proof** against the Merkle root

This clearly demonstrates how multiple transactions are grouped in one block and how a Merkle tree is constructed from those transactions!
