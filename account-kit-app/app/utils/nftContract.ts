'use client';

import { ethers } from 'ethers';
import Hom3TownNFTABI from '../contracts/Hom3TownNFT.json';

// Contract configuration
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '';
export const GAS_POLICY_ID = process.env.NEXT_PUBLIC_GAS_POLICY_ID || '';

// Check if contract is configured
export const isContractConfigured = (): boolean => {
  return !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
};

/**
 * Get the NFT contract instance
 */
export const getNFTContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  if (!isContractConfigured()) {
    throw new Error('NFT contract address is not configured. Please set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in .env');
  }
  
  return new ethers.Contract(
    NFT_CONTRACT_ADDRESS,
    Hom3TownNFTABI.abi,
    signerOrProvider
  );
};

/**
 * Check if an address owns any NFTs from this collection
 */
export const checkNFTOwnership = async (
  address: string,
  provider: ethers.Provider
): Promise<{ owns: boolean; tokenId: string | null }> => {
  try {
    if (!isContractConfigured()) {
      console.warn('NFT contract not configured');
      return { owns: false, tokenId: null };
    }

    const contract = getNFTContract(provider);
    const balance = await contract.balanceOf(address);
    
    if (balance > 0) {
      // Get the first token ID owned by this address
      const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
      return { owns: true, tokenId: tokenId.toString() };
    }
    
    return { owns: false, tokenId: null };
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return { owns: false, tokenId: null };
  }
};

/**
 * Mint a new NFT with metadata URI
 */
export const mintNFT = async (
  to: string,
  tokenURI: string,
  signer: ethers.Signer
): Promise<{ success: boolean; tokenId: string | null; txHash: string | null; error?: string }> => {
  try {
    if (!isContractConfigured()) {
      return {
        success: false,
        tokenId: null,
        txHash: null,
        error: 'Contract not configured. Please deploy the contract and update .env.example'
      };
    }

    const contract = getNFTContract(signer);
    
    // Prepare transaction options
    const txOptions: any = {};
    
    // If Gas Manager policy is configured, use it for sponsored transactions
    if (GAS_POLICY_ID) {
      console.log('Using Gas Manager policy for sponsored mint:', GAS_POLICY_ID);
      // Note: Actual gas policy implementation depends on Alchemy's SDK
      // This is a placeholder for the gas policy configuration
      txOptions.gasPolicy = GAS_POLICY_ID;
    }
    
    console.log('Minting NFT to:', to, 'with tokenURI:', tokenURI);
    const tx = await contract.mint(to, tokenURI, txOptions);
    console.log('Mint transaction submitted:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Mint transaction confirmed:', receipt);
    
    // Extract tokenId from the Transfer event
    // Assuming the mint emits a Transfer(address(0), to, tokenId) event
    const transferEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'Transfer';
      } catch {
        return false;
      }
    });
    
    let tokenId = null;
    if (transferEvent) {
      const parsed = contract.interface.parseLog(transferEvent);
      tokenId = parsed?.args?.tokenId?.toString();
    }
    
    return {
      success: true,
      tokenId,
      txHash: receipt.hash
    };
  } catch (error: any) {
    console.error('Error minting NFT:', error);
    
    let errorMessage = 'Failed to mint NFT';
    if (error.message) {
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas. Please use Shape Sepolia faucet.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      tokenId: null,
      txHash: null,
      error: errorMessage
    };
  }
};

/**
 * Update the token URI for an existing NFT
 */
export const updateNFTMetadata = async (
  tokenId: string,
  newTokenURI: string,
  signer: ethers.Signer
): Promise<{ success: boolean; txHash: string | null; error?: string }> => {
  try {
    if (!isContractConfigured()) {
      return {
        success: false,
        txHash: null,
        error: 'Contract not configured'
      };
    }

    const contract = getNFTContract(signer);
    
    console.log('Updating NFT metadata for token:', tokenId, 'with new URI:', newTokenURI);
    const tx = await contract.updateTokenURI(tokenId, newTokenURI);
    console.log('Update transaction submitted:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Update transaction confirmed:', receipt);
    
    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error: any) {
    console.error('Error updating NFT metadata:', error);
    
    let errorMessage = 'Failed to update NFT metadata';
    if (error.message) {
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message.includes('not authorized') || error.message.includes('not owner')) {
        errorMessage = 'You do not own this NFT';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      txHash: null,
      error: errorMessage
    };
  }
};

/**
 * Create NFT metadata JSON for upload to IPFS
 */
export const createNFTMetadata = (
  name: string,
  description: string,
  imageURI: string,
  attributes: Array<{ trait_type: string; value: string | number }>
) => {
  return {
    name,
    description,
    image: imageURI,
    attributes,
    external_url: 'https://hom3town.com', // Update with actual URL
    background_color: '000000'
  };
};
