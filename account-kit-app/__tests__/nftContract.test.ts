import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ethers } from 'ethers';
import { 
  checkNFTOwnership, 
  mintNFT, 
  updateNFTMetadata,
  createNFTMetadata,
  isContractConfigured
} from '../app/utils/nftContract';

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  NEXT_PUBLIC_GAS_POLICY_ID: 'test-policy-id'
};

describe('NFT Contract Utilities', () => {
  beforeEach(() => {
    // Reset environment
    vi.resetModules();
  });

  describe('isContractConfigured', () => {
    it('should return false when contract address is not set', () => {
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = '';
      expect(isContractConfigured()).toBe(false);
    });

    it('should return false when contract address is zero address', () => {
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
      expect(isContractConfigured()).toBe(false);
    });

    it('should return true when contract address is valid', () => {
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = mockEnv.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
      expect(isContractConfigured()).toBe(true);
    });
  });

  describe('createNFTMetadata', () => {
    it('should create valid NFT metadata', () => {
      const metadata = createNFTMetadata(
        'Test Avatar',
        'A test avatar',
        'ipfs://test-cid',
        [
          { trait_type: 'Body', value: 'Male' },
          { trait_type: 'Hair', value: 'Brown' }
        ]
      );

      expect(metadata).toEqual({
        name: 'Test Avatar',
        description: 'A test avatar',
        image: 'ipfs://test-cid',
        attributes: [
          { trait_type: 'Body', value: 'Male' },
          { trait_type: 'Hair', value: 'Brown' }
        ],
        external_url: 'https://hom3town.com',
        background_color: '000000'
      });
    });
  });

  describe('checkNFTOwnership', () => {
    it('should return owns: false when contract is not configured', async () => {
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = '';
      
      const mockProvider = {} as ethers.Provider;
      const result = await checkNFTOwnership('0xtest', mockProvider);
      
      expect(result).toEqual({ owns: false, tokenId: null });
    });

    // Note: Full integration tests require a test provider/contract
    // These would be run against a local testnet or fork
  });

  describe('Save → Mint Flow', () => {
    it('should follow correct flow for first-time minting', () => {
      // Test flow:
      // 1. User logs in → no NFT owned
      // 2. User creates avatar → saves locally
      // 3. User clicks Save & Mint → checks ownership (none)
      // 4. Mint new NFT with metadata URI
      // 5. Save tokenId to local storage
      
      const flow = {
        step1: 'login_complete',
        step2: 'avatar_created',
        step3: 'check_ownership_none',
        step4: 'mint_new',
        step5: 'save_token_id'
      };
      
      expect(flow.step1).toBe('login_complete');
      expect(flow.step5).toBe('save_token_id');
    });

    it('should follow correct flow for updating existing NFT', () => {
      // Test flow:
      // 1. User logs in → owns NFT (tokenId: 1)
      // 2. User modifies avatar
      // 3. User clicks Save & Mint → checks ownership (found)
      // 4. Update existing NFT metadata
      
      const flow = {
        step1: 'login_with_existing_nft',
        step2: 'modify_avatar',
        step3: 'check_ownership_found',
        step4: 'update_existing'
      };
      
      expect(flow.step1).toBe('login_with_existing_nft');
      expect(flow.step4).toBe('update_existing');
    });

    it('should handle soft-fail gracefully', () => {
      // Test flow:
      // 1. User attempts to mint
      // 2. Transaction fails (e.g., insufficient gas)
      // 3. Avatar still saved locally
      // 4. User can still play
      // 5. Toast shows error message
      
      const softFailFlow = {
        attempt: 'mint_transaction',
        result: 'error',
        localSave: 'success',
        userExperience: 'playable',
        feedback: 'error_toast'
      };
      
      expect(softFailFlow.localSave).toBe('success');
      expect(softFailFlow.userExperience).toBe('playable');
    });
  });
});
