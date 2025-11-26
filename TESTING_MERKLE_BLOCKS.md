# Testing Multiple Transactions Per Block (Merkle Tree Demonstration)

## What Changed

### 1. Admin Panel UI Fixes
- **Fixed address mirroring**: Producer and company input boxes now use separate state variables
- **Display format**: Producers show as **P1, P2, P3** and companies show as **C1, C2, C3** instead of raw addresses

### 2. Hardhat Mining Configuration
- **Before**: Auto-mining (one transaction = one block)
- **After**: Interval mining (multiple transactions in one block every 5 seconds)

## Understanding Blockchain Transactions

**Important**: In Ethereum, ANY state-changing operation is a transaction, including:
- ✅ Registering producers/companies (changes contract state)
- ✅ Issuing certificates (creates new certificate)
- ✅ Purchasing certificates (transfers ownership)

With the new configuration, **all these transactions can be grouped into one block** if they occur within the 5-second mining interval.

## Testing Steps

### Step 1: Start Fresh Hardhat Node
```bash
cd backend-node/hardhat
npx hardhat node
```

**Note**: The node will now mine blocks every 5 seconds instead of immediately.

### Step 2: Deploy Contract
```bash
# In a new terminal
cd backend-node/hardhat
npx hardhat run scripts/deploy.js --network localhost
```

Update the `CONTRACT_ADDRESS` in `backend-node/.env` with the deployed address.

### Step 3: Start Backend
```bash
cd backend-node
npm run dev
```

### Step 4: Start Frontend
```bash
cd frontend-vite
npm run dev
```

### Step 5: Demonstrate Multiple Transactions Per Block

To show your professor multiple transactions in one block:

1. **Quick succession operations** (within 5 seconds):
   ```
   - Register Producer P1
   - Register Producer P2
   - Register Company C1
   - Issue certificate from P1
   - Purchase certificate by C1
   ```

2. **All these will be in ONE BLOCK** because they happened within the 5-second interval

3. **Check the Hardhat node console** to see block numbers:
   ```
   Block #1: Contains all 5 transactions
   - Transaction 1: registerProducer(P1)
   - Transaction 2: registerProducer(P2)
   - Transaction 3: registerCompany(C1)
   - Transaction 4: issueCertificate(...)
   - Transaction 5: purchaseCertificate(...)
   ```

### Step 6: Build Merkle Tree from Block Transactions

The backend's Merkle service will build a tree from all transactions in the block:

```
Merkle Tree (Block #1):
         ROOT
        /    \
      H1      H2
     /  \    /  \
   Tx1  Tx2 Tx3  Tx4
```

## Why This Works for Merkle Tree Demonstration

1. **Merkle trees require multiple leaves**: You need at least 2 transactions in one block
2. **Interval mining groups transactions**: The 5-second window allows you to submit multiple transactions
3. **Single block verification**: You can prove all transactions in Block #1 using the Merkle root

## Adjusting the Mining Interval

If 5 seconds is too short, you can increase it in `backend-node/hardhat/hardhat.config.js`:

```javascript
mining: {
  auto: false,
  interval: 10000  // 10 seconds for more time to submit transactions
}
```

## Admin Panel Improvements

The admin panel now correctly:
- Shows separate input boxes for producers and companies
- Displays registered entities as **P1, P2, P3** (blue) and **C1, C2, C3** (green)
- Does not mirror input between the two fields

## Viewing Block Data

You can query block data using Web3/Ethers in the backend or frontend:

```javascript
// Get block with transaction details
const block = await provider.getBlock(blockNumber, true);
console.log(`Block #${block.number} has ${block.transactions.length} transactions`);
```

## For Your Professor

Explain:
1. **Block structure**: Each block contains multiple transactions
2. **Merkle tree**: Built from transaction hashes in a single block
3. **Verification**: Any transaction can be verified using the Merkle proof and root
4. **Efficiency**: Merkle trees allow O(log n) verification instead of O(n)

The demonstration will clearly show how multiple transactions (register, issue, purchase) are grouped into one block and how a Merkle tree is constructed from those transactions.
