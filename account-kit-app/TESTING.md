# Testing Guide for Save → Mint Flow

## Overview
This document describes how to test the Hom3Town Save → Mint functionality on Shape Sepolia testnet.

## Prerequisites

1. **Deploy NFT Contract**
   - Deploy the Hom3Town NFT contract from [Hom3Town-Contracts](https://github.com/TalonDragon000/Hom3Town-Contracts) to Shape Sepolia
   - Copy the deployed contract address

2. **Get Testnet Funds**
   - Visit Shape Sepolia faucet: https://shapescan.xyz/faucet
   - Or Alchemy faucet: https://www.alchemy.com/faucets/shape-sepolia
   - Fund your test wallet address

3. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in required values:
     - `NEXT_PUBLIC_ALCHEMY_API_KEY`
     - `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` (from step 1)
     - `NEXT_PUBLIC_PINATA_JWT`
     - `NEXT_PUBLIC_PINATA_GATEWAY`
   - (Optional) `NEXT_PUBLIC_GAS_POLICY_ID` for sponsored mints

## Test Scenarios

### Scenario 1: First Time User (Mint Flow)

**Expected Flow:**
1. User logs in via Account Kit (Google OAuth)
2. Dashboard shows default avatar (from base URI)
3. User clicks "Edit Avatar" → Character Creator
4. User customizes avatar (body, hair, clothes, etc.)
5. User clicks "SAVE CONFIG" → saves locally
6. User clicks "Save & Mint" button
   - Avatar captured as PNG
   - Uploaded to IPFS
   - Metadata created and uploaded
   - NFT minted on Shape Sepolia
   - TokenId saved to local storage
   - Confetti celebration 🎉
7. Dashboard now shows custom avatar

**Testing Steps:**
```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Click "Login" → authenticate with Google
# Navigate to character creator
# Create an avatar
# Click "Save & Mint"
# Verify transaction on Shape Sepolia explorer
```

**Success Criteria:**
- ✅ Default avatar shows on login (no auto-mint)
- ✅ Avatar creator works
- ✅ "Save & Mint" triggers transaction
- ✅ Transaction succeeds on Shape Sepolia
- ✅ TokenId saved to localStorage
- ✅ Avatar shows on dashboard after mint

---

### Scenario 2: Returning User (Update Flow)

**Expected Flow:**
1. User logs in (already owns NFT from Scenario 1)
2. Dashboard shows existing custom avatar
3. User modifies avatar
4. User clicks "Save & Mint"
   - Checks ownership (finds existing tokenId)
   - Captures new avatar
   - Uploads to IPFS
   - Calls `updateTokenURI` instead of `mint`
5. NFT metadata updated

**Testing Steps:**
```bash
# Use same wallet from Scenario 1
# Login
# Edit avatar
# Save & Mint
# Verify tokenURI updated on contract
```

**Success Criteria:**
- ✅ Existing avatar loads on login
- ✅ Modification triggers update, not mint
- ✅ TokenURI updated on existing NFT
- ✅ No new NFT minted

---

### Scenario 3: Soft Fail (Contract Not Configured)

**Expected Flow:**
1. Remove `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` from `.env.local`
2. User creates avatar
3. User clicks "Save & Mint"
4. Warning shown: "Contract not configured"
5. Avatar saved locally only
6. User can still play/use avatar

**Testing Steps:**
```bash
# Remove or comment out NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
# Restart dev server
# Create avatar
# Click "Save & Mint"
# Verify local save works
# Verify avatar displays
```

**Success Criteria:**
- ✅ Warning message shown
- ✅ Avatar saved to localStorage
- ✅ Avatar displays correctly
- ✅ No blockchain transaction attempted
- ✅ User can continue playing

---

### Scenario 4: Soft Fail (Transaction Failure)

**Expected Flow:**
1. User attempts to mint
2. Transaction fails (insufficient gas, network error, etc.)
3. Error toast shown with specific message
4. Avatar still saved locally
5. User can retry later
6. User can still play with avatar

**Testing Steps:**
```bash
# Test with wallet that has no testnet funds
# Or simulate network failure
# Or reject transaction in wallet
# Create avatar
# Click "Save & Mint"
# Verify soft fail behavior
```

**Success Criteria:**
- ✅ Clear error message shown
- ✅ Avatar still playable locally
- ✅ No app crash
- ✅ User can retry

---

### Scenario 5: Gas Manager (Sponsored Mint)

**Expected Flow:**
1. Configure `NEXT_PUBLIC_GAS_POLICY_ID` with valid policy
2. Set up Gas Manager policy in Alchemy dashboard
3. User (with no testnet funds) mints avatar
4. Transaction sponsored by Gas Manager
5. User pays no gas fees

**Testing Steps:**
```bash
# Setup Gas Manager in Alchemy dashboard
# Create policy for Shape Sepolia
# Add policy ID to .env.local
# Use wallet with ZERO Shape Sepolia ETH
# Mint avatar
# Verify transaction succeeds without gas payment
```

**Success Criteria:**
- ✅ Transaction succeeds with no ETH
- ✅ Gas paid by Gas Manager
- ✅ NFT minted successfully

---

## Unit Tests

Run unit tests:
```bash
npm run test
```

Tests cover:
- Contract configuration checks
- NFT metadata creation
- Mock save → mint flow logic
- Soft fail scenarios

---

## Simulation Script

Run interactive simulation:
```bash
node scripts/simulateMintFlow.js
```

This script simulates the entire flow without requiring a real wallet or blockchain connection. Useful for:
- Understanding the flow
- Demo purposes
- Quick validation of logic

---

## Manual Verification Checklist

- [ ] Login shows default avatar (no mint)
- [ ] Character creator works correctly
- [ ] "Save & Mint" button appears
- [ ] First mint creates new NFT
- [ ] Confetti celebration on first mint
- [ ] TokenId saved to localStorage
- [ ] Subsequent saves update existing NFT
- [ ] Soft fail when contract not configured
- [ ] Soft fail when transaction fails
- [ ] Avatar always playable locally
- [ ] Gas Manager sponsors first mint (if configured)
- [ ] Error messages are clear and helpful

---

## Troubleshooting

### Issue: "Contract not configured"
**Solution:** Set `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` in `.env.local`

### Issue: "Insufficient funds"
**Solution:** Get testnet funds from Shape Sepolia faucet

### Issue: "Pinata authentication failed"
**Solution:** Check `NEXT_PUBLIC_PINATA_JWT` is valid

### Issue: Transaction pending forever
**Solution:** Check Shape Sepolia network status, try increasing gas

### Issue: NFT not showing after mint
**Solution:** Check tokenId in localStorage, verify on block explorer

---

## Next Steps After Testing

1. Test on mainnet (Shape Network) once contract is audited
2. Set up production Gas Manager policies
3. Configure production IPFS gateway
4. Add analytics to track mint success rate
5. Monitor gas costs and optimize if needed
