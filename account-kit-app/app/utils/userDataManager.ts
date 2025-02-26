'use client';
import { SelectedFrames } from "./characterData";

interface User {
    address: string | null;
    // Add other properties you need
}

interface AvatarMetadata {
    cid: string;
    pinataUrl: string;
    timestamp: string;
  }

/* Access the IPFS metadata and use it anywhere in the application with the following:
    const userDataManager = UserDataManager.getInstance();
    const userData = userDataManager.getUserData();
    const avatarMetadata = userData.avatarMetadata;
*/

export interface UserData {
    address: string | null;
    email: string | null;
    username: string | null;
    avatarConfig: SelectedFrames | null;
    avatarMetadata: AvatarMetadata | null;
    lastUpdated: string;
}

export const DEFAULT_USER_DATA: UserData = {
    address: null,
    email: null,
    username: 'Anon',
    avatarConfig: null,
    avatarMetadata: null,
    lastUpdated: new Date().toISOString()
};

export class UserDataManager {
    private static instance: UserDataManager;
    private storageKey = 'hom3town_user_data';

    private constructor() {}

    static getInstance(): UserDataManager {
        if (!UserDataManager.instance) {
            UserDataManager.instance = new UserDataManager();
        }
        return UserDataManager.instance;
    }

    getUserData(): UserData {
        if (typeof window === 'undefined') {
            console.log('UserDataManager - Window undefined, returning default data');
            return DEFAULT_USER_DATA;
        }
        
        const storedData = localStorage.getItem(this.storageKey);
        const parsedData = storedData ? JSON.parse(storedData) : DEFAULT_USER_DATA;
        console.log('UserDataManager - Retrieved user data:', parsedData);
        return parsedData;
    }

    async saveUserData(data: Partial<UserData>): Promise<UserData> {
        console.log('UserDataManager - Saving user data:', data);
        const currentData = this.getUserData();
        const updatedData: UserData = {
            ...currentData,
            ...data,
            lastUpdated: new Date().toISOString()
        };
        console.log('UserDataManager - Updated data:', updatedData);

        if (updatedData.avatarConfig) {
            await this.logAvatarAsPNG(updatedData.avatarConfig);
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
            console.log('UserDataManager - Saved updated data:', updatedData);
        } else {
            console.log('UserDataManager - Window undefined, data not saved');
        }

        return updatedData;
    }

    private async logAvatarAsPNG(avatarConfig: SelectedFrames): Promise<void> {
        const canvas = document.createElement('canvas');
        canvas.width = 500;  // Set appropriate size
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        // Load all images first
        const loadImagePromises = Object.entries(avatarConfig).map(async ([layer, frameUrl]) => {
            if (frameUrl) {
                const img = new Image();
                img.crossOrigin = 'anonymous';  // Add this to handle CORS
                return new Promise<[string, HTMLImageElement]>((resolve, reject) => {
                    img.onload = () => resolve([layer, img]);
                    img.onerror = reject;
                    img.src = frameUrl;
                });
            }
            return null;
        });

        try {
            // Wait for all images to load
            const loadedImages = await Promise.all(loadImagePromises);
            
            // Draw images in order
            loadedImages.forEach(result => {
                if (result) {
                    const [layer, img] = result;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            });

            // Convert canvas to PNG and log it
            const pngDataUrl = canvas.toDataURL('image/png');
            console.log('UserDataManager - Avatar PNG:', pngDataUrl);
        } catch (error) {
            console.error('Failed to load or draw images:', error);
        }
    }

    async updateFromAccountKit(user: User): Promise<UserData> {
        console.log('UserDataManager - Updating from AccountKit:', user);
        // Preserve existing avatar config when updating from AccountKit
        const currentData = this.getUserData();
        return await this.saveUserData({
            address: user.address || null,
            avatarConfig: currentData.avatarConfig // Preserve existing avatar config
        });
    }

    saveAvatarConfig(avatarConfig: SelectedFrames): Promise<UserData> {
        console.log('UserDataManager - Saving avatar config:', avatarConfig);
        return this.saveUserData({ avatarConfig });
    }

    setUsername(username: string): Promise<UserData> {
        return this.saveUserData({ username });
    }

    clearUserData(): void {
        if (typeof window !== 'undefined') {
            console.log('UserDataManager - Clearing user data');
            localStorage.removeItem(this.storageKey);
        }
    }
} 