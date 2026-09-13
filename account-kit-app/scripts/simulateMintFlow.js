#!/usr/bin/env node

/**
 * Simulation script for testing the Save → Mint flow
 * This script simulates the complete user journey without requiring a real wallet
 * 
 * Usage: node scripts/simulateMintFlow.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function simulateMintFlow() {
  console.clear();
  log('='.repeat(60), 'cyan');
  log('  Hom3Town Save → Mint Flow Simulation', 'cyan');
  log('='.repeat(60), 'cyan');
  console.log();

  // Step 1: Login
  log('Step 1: User Login', 'blue');
  log('  ✓ User logs in with Account Kit (Google OAuth)', 'green');
  log('  ✓ Address generated: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'green');
  await prompt('  Press Enter to continue...');
  console.log();

  // Step 2: Check existing NFT
  log('Step 2: Check NFT Ownership', 'blue');
  const hasNFT = await prompt('  Does user own an NFT? (y/n): ');
  console.log();

  let tokenId = null;
  if (hasNFT.toLowerCase() === 'y') {
    tokenId = Math.floor(Math.random() * 1000);
    log(`  ✓ Found existing NFT with tokenId: ${tokenId}`, 'green');
  } else {
    log('  ✓ No existing NFT found', 'green');
    log('  → Will mint new NFT', 'yellow');
  }
  await prompt('  Press Enter to continue...');
  console.log();

  // Step 3: Show default avatar
  log('Step 3: Display Avatar', 'blue');
  if (!hasNFT || hasNFT.toLowerCase() !== 'y') {
    log('  ✓ Showing default avatar from base URI', 'green');
    log('  → No mint required on login', 'yellow');
  } else {
    log('  ✓ Loading custom avatar from NFT metadata', 'green');
  }
  await prompt('  Press Enter to continue...');
  console.log();

  // Step 4: Create/Customize
  log('Step 4: Character Creation', 'blue');
  log('  ✓ User selects body type', 'green');
  log('  ✓ User customizes hair, clothes, etc.', 'green');
  log('  ✓ Avatar saved locally', 'green');
  await prompt('  Press Enter to continue...');
  console.log();

  // Step 5: Save & Mint
  log('Step 5: Save & Mint', 'blue');
  
  // Simulate contract check
  const contractConfigured = await prompt('  Is contract configured? (y/n): ');
  
  if (contractConfigured.toLowerCase() !== 'y') {
    log('  ⚠️  Contract not configured', 'red');
    log('  ✓ Avatar saved locally only', 'green');
    log('  → User can still play with avatar', 'yellow');
    await prompt('  Press Enter to continue...');
    console.log();
    log('Simulation Complete (Soft Fail Mode)', 'cyan');
    rl.close();
    return;
  }

  log('  ✓ Contract configured', 'green');
  log('  → Capturing avatar as image...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 1000));
  log('  ✓ Avatar captured', 'green');
  
  log('  → Uploading to IPFS (Pinata)...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 1500));
  const imageCID = 'Qm' + Math.random().toString(36).substring(2, 15);
  log(`  ✓ Image uploaded: ${imageCID}`, 'green');
  
  log('  → Creating metadata...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 500));
  log('  ✓ Metadata created', 'green');
  
  log('  → Uploading metadata to IPFS...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 1000));
  const metadataCID = 'Qm' + Math.random().toString(36).substring(2, 15);
  log(`  ✓ Metadata uploaded: ${metadataCID}`, 'green');
  
  console.log();

  if (hasNFT.toLowerCase() === 'y') {
    // Update flow
    log('  → Updating existing NFT...', 'yellow');
    log(`  → Calling updateTokenURI(${tokenId}, "ipfs://${metadataCID}")`, 'yellow');
    
    const shouldFail = await prompt('  Should transaction fail? (y/n): ');
    
    if (shouldFail.toLowerCase() === 'y') {
      log('  ✗ Transaction failed!', 'red');
      log('  ✓ Avatar still saved locally', 'green');
      log('  → User can still play', 'yellow');
      log('  ⚠️  Toast: "Failed to update NFT. Avatar saved locally."', 'yellow');
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txHash = '0x' + Math.random().toString(36).substring(2, 15);
      log(`  ✓ Transaction confirmed: ${txHash}`, 'green');
      log(`  ✓ NFT ${tokenId} metadata updated!`, 'green');
      log('  → User sees success message', 'yellow');
    }
  } else {
    // Mint flow
    log('  → Minting new NFT...', 'yellow');
    log(`  → Calling mint("0x742d35Cc...", "ipfs://${metadataCID}")`, 'yellow');
    
    const useGasPolicy = await prompt('  Use Gas Manager for sponsored mint? (y/n): ');
    if (useGasPolicy.toLowerCase() === 'y') {
      log('  ✓ Using Gas Manager policy for first mint!', 'green');
      log('  → Transaction sponsored (no gas cost)', 'yellow');
    }
    
    const shouldFail = await prompt('  Should transaction fail? (y/n): ');
    
    if (shouldFail.toLowerCase() === 'y') {
      log('  ✗ Transaction failed!', 'red');
      log('  ✓ Avatar still saved locally', 'green');
      log('  → User can still play', 'yellow');
      log('  ⚠️  Toast: "Failed to mint NFT. Avatar saved locally."', 'yellow');
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const txHash = '0x' + Math.random().toString(36).substring(2, 15);
      const newTokenId = Math.floor(Math.random() * 1000);
      log(`  ✓ Transaction confirmed: ${txHash}`, 'green');
      log(`  ✓ NFT minted! Token ID: ${newTokenId}`, 'green');
      log('  ✓ Saved tokenId to local storage', 'green');
      log('  🎉 CONFETTI CELEBRATION! 🎉', 'green');
      log('  → "Welcome home!" message shown', 'yellow');
    }
  }
  
  console.log();
  log('='.repeat(60), 'cyan');
  log('  Simulation Complete', 'cyan');
  log('='.repeat(60), 'cyan');
  
  rl.close();
}

// Run simulation
simulateMintFlow().catch(error => {
  console.error('Error running simulation:', error);
  rl.close();
  process.exit(1);
});
