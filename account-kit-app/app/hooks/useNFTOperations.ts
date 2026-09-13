'use client';

import { useState, useCallback } from 'react';
import { useUser, useSignerStatus } from '@account-kit/react';
import { ethers } from 'ethers';
import { 
  checkNFTOwnership, 
  mintNFT, 
  updateNFTMetadata,
  isContractConfigured 
} from '../utils/nftContract';

export const useNFTOperations = () => {
  const user = useUser();
  const { isConnected } = useSignerStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get provider and signer from Account Kit
   */
  const getProviderAndSigner = useCallback(async () => {
    if (!isConnected || !user) {
      throw new Error('Not connected to wallet');
    }

    // Create provider for Shape Sepolia
    const provider = new ethers.JsonRpcProvider(
      'https://shape-sepolia.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    );

    // Get signer from window.ethereum (Account Kit should inject this)
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await web3Provider.getSigner();
      return { provider, signer };
    }

    throw new Error('No ethereum provider found');
  }, [isConnected, user]);

  /**
   * Check if user owns an NFT
   */
  const checkOwnership = useCallback(async () => {
    if (!user?.address) {
      return { owns: false, tokenId: null };
    }

    try {
      const { provider } = await getProviderAndSigner();
      return await checkNFTOwnership(user.address, provider);
    } catch (error) {
      console.error('Error checking ownership:', error);
      return { owns: false, tokenId: null };
    }
  }, [user, getProviderAndSigner]);

  /**
   * Mint or update NFT based on ownership
   */
  const saveAvatar = useCallback(async (
    metadataURI: string
  ): Promise<{ success: boolean; tokenId: string | null; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isContractConfigured()) {
        const error = 'Contract not configured. Please check .env configuration.';
        setError(error);
        return { success: false, tokenId: null, error };
      }

      if (!user?.address) {
        const error = 'Please log in to save your avatar';
        setError(error);
        return { success: false, tokenId: null, error };
      }

      const { provider, signer } = await getProviderAndSigner();
      
      // Check if user already owns an NFT
      const ownership = await checkNFTOwnership(user.address, provider);
      
      if (ownership.owns && ownership.tokenId) {
        // Update existing NFT
        console.log('Updating existing NFT:', ownership.tokenId);
        const result = await updateNFTMetadata(ownership.tokenId, metadataURI, signer);
        
        if (result.success) {
          return { success: true, tokenId: ownership.tokenId };
        } else {
          setError(result.error || 'Failed to update NFT');
          return { success: false, tokenId: ownership.tokenId, error: result.error };
        }
      } else {
        // Mint new NFT (first time)
        console.log('Minting new NFT for:', user.address);
        const result = await mintNFT(user.address, metadataURI, signer);
        
        if (result.success) {
          return { success: true, tokenId: result.tokenId };
        } else {
          setError(result.error || 'Failed to mint NFT');
          return { success: false, tokenId: null, error: result.error };
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'An unexpected error occurred';
      console.error('Error in saveAvatar:', error);
      setError(errorMsg);
      return { success: false, tokenId: null, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [user, getProviderAndSigner]);

  return {
    saveAvatar,
    checkOwnership,
    isLoading,
    error,
    isConfigured: isContractConfigured()
  };
};
