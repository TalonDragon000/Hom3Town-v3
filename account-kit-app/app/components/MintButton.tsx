'use client';

import React, { useState, useRef } from 'react';
import { useUser, useSignerStatus } from '@account-kit/react';
import html2canvas from 'html2canvas';
import { PinataSDK } from 'pinata';
import { UserDataManager } from '../utils/userDataManager';
import { useNFTOperations } from '../hooks/useNFTOperations';
import { createNFTMetadata } from '../utils/nftContract';
import confetti from 'canvas-confetti';

interface MintButtonProps {
  characterRef?: React.RefObject<HTMLDivElement>;
  onMintSuccess?: (tokenId: string) => void;
  onMintError?: (error: string) => void;
}

const MintButton: React.FC<MintButtonProps> = ({ 
  characterRef,
  onMintSuccess,
  onMintError 
}) => {
  const user = useUser();
  const { isConnected } = useSignerStatus();
  const { saveAvatar, checkOwnership, isLoading, error: nftError, isConfigured } = useNFTOperations();
  const [status, setStatus] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const userDataManager = UserDataManager.getInstance();

  const handleSaveAndMint = async () => {
    if (!isConnected || !user) {
      setStatus('Please log in to save your avatar');
      setShowError(true);
      return;
    }

    if (!isConfigured) {
      setStatus('⚠️ Contract not configured. Avatar saved locally only.');
      setShowError(true);
      // Still allow local save
      await saveLocally();
      return;
    }

    try {
      setStatus('Saving avatar...');
      setShowError(false);

      // 1. Capture avatar as image
      const { imageBlob, imageCID } = await captureAndUploadAvatar();
      
      if (!imageBlob || !imageCID) {
        throw new Error('Failed to upload avatar image');
      }

      // 2. Create and upload metadata
      const metadataCID = await uploadMetadata(imageCID);
      
      // 3. Check ownership and mint/update
      setStatus('Checking NFT ownership...');
      const ownership = await checkOwnership();
      
      if (ownership.owns) {
        setStatus('Updating NFT metadata...');
      } else {
        setStatus('Minting your avatar NFT... (first mint may be sponsored!)');
      }

      const metadataURI = `ipfs://${metadataCID}`;
      const result = await saveAvatar(metadataURI);

      if (result.success) {
        // Save to local storage
        await userDataManager.saveUserData({
          tokenId: result.tokenId,
          avatarMetadata: {
            cid: imageCID,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${imageCID}`,
            timestamp: new Date().toISOString()
          }
        });

        // Success feedback
        setStatus(ownership.owns ? '✅ Avatar updated!' : '🎉 Avatar minted!');
        
        // Celebration for first mint
        if (!ownership.owns) {
          celebrateFirstMint();
        }
        
        if (onMintSuccess && result.tokenId) {
          onMintSuccess(result.tokenId);
        }

        // Clear status after delay
        setTimeout(() => setStatus(''), 3000);
      } else {
        // Soft fail - keep avatar playable
        await saveLocally();
        const errorMsg = result.error || 'Failed to save NFT';
        setStatus(`⚠️ ${errorMsg}. Avatar saved locally.`);
        setShowError(true);
        
        if (onMintError) {
          onMintError(errorMsg);
        }
      }
    } catch (error: any) {
      console.error('Error in save and mint:', error);
      
      // Soft fail - save locally
      await saveLocally();
      const errorMsg = error.message || 'Unexpected error';
      setStatus(`⚠️ ${errorMsg}. Avatar saved locally.`);
      setShowError(true);
      
      if (onMintError) {
        onMintError(errorMsg);
      }
    }
  };

  const captureAndUploadAvatar = async (): Promise<{ imageBlob: Blob | null; imageCID: string | null }> => {
    try {
      // Find character element
      let characterElement: HTMLElement | null = null;
      
      if (characterRef?.current) {
        characterElement = characterRef.current.querySelector('.preview-character') as HTMLElement;
      } else {
        // Fallback: search in document
        characterElement = document.querySelector('.preview-character') as HTMLElement;
      }

      if (!characterElement) {
        throw new Error('Character element not found');
      }

      // Capture as canvas
      const canvas = await html2canvas(characterElement);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        }, 'image/png');
      });

      // Upload to IPFS via Pinata
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (!pinataJWT) {
        throw new Error('Pinata not configured');
      }

      const pinata = new PinataSDK({
        pinataJwt: pinataJWT,
        pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
      });

      const file = new File([blob], 'Hom3TownAvatar.png', { type: 'image/png' });
      const result = await pinata.upload.file(file, {
        metadata: {
          name: 'Hom3Town Avatar',
          keyvalues: {
            timestamp: new Date().toISOString(),
            owner: user?.address || 'unknown',
          },
        },
      });

      return { imageBlob: blob, imageCID: result.cid };
    } catch (error) {
      console.error('Error capturing and uploading avatar:', error);
      return { imageBlob: null, imageCID: null };
    }
  };

  const uploadMetadata = async (imageCID: string): Promise<string> => {
    const userData = userDataManager.getUserData();
    
    // Create NFT metadata
    const metadata = createNFTMetadata(
      `${userData.username || 'Hom3Town'} Avatar`,
      'A unique Hom3Town avatar created by the owner',
      `ipfs://${imageCID}`,
      [
        { trait_type: 'Created', value: new Date().toISOString() },
        { trait_type: 'Owner', value: user?.address || 'unknown' }
      ]
    );

    // Upload metadata to IPFS
    const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!pinataJWT) {
      throw new Error('Pinata not configured');
    }

    const pinata = new PinataSDK({
      pinataJwt: pinataJWT,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    });

    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
    
    const result = await pinata.upload.file(metadataFile, {
      metadata: {
        name: 'Hom3Town Avatar Metadata',
      },
    });

    return result.cid;
  };

  const saveLocally = async () => {
    // Save avatar config locally even if mint fails
    const userData = userDataManager.getUserData();
    if (userData.avatarConfig) {
      await userDataManager.saveUserData({
        avatarConfig: userData.avatarConfig
      });
    }
  };

  const celebrateFirstMint = () => {
    // Confetti celebration for first mint
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return (
    <div className="mint-button-container">
      <button
        className="btn text-xl m-auto"
        onClick={handleSaveAndMint}
        disabled={isLoading || !isConnected}
      >
        {isLoading ? 'Saving...' : 'Save & Mint'}
      </button>
      
      {status && (
        <div className={`mt-2 text-sm ${showError ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </div>
      )}
      
      {!isConfigured && (
        <div className="mt-2 text-xs text-yellow-600">
          ⚠️ NFT contract not configured - local save only
        </div>
      )}
    </div>
  );
};

export default MintButton;
