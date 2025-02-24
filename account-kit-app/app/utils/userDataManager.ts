'use client';
import { User } from "@account-kit/react";
import { SelectedFrames } from "./characterData";

export interface UserData {
    address: string | null;
    email: string | null;
    username: string;
    avatarConfig: SelectedFrames | null;
    lastUpdated: string;
}

export const DEFAULT_USER_DATA: UserData = {
    address: null,
    email: null,
    username: 'Annon',
    avatarConfig: null,
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

    saveUserData(data: Partial<UserData>): UserData {
        console.log('UserDataManager - Saving user data:', data);
        const currentData = this.getUserData();
        const updatedData: UserData = {
            ...currentData,
            ...data,
            lastUpdated: new Date().toISOString()
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
            console.log('UserDataManager - Saved updated data:', updatedData);
        } else {
            console.log('UserDataManager - Window undefined, data not saved');
        }

        return updatedData;
    }

    updateFromAccountKit(user: User): UserData {
        console.log('UserDataManager - Updating from AccountKit:', user);
        // Preserve existing avatar config when updating from AccountKit
        const currentData = this.getUserData();
        return this.saveUserData({
            address: user.address || null,
            avatarConfig: currentData.avatarConfig // Preserve existing avatar config
        });
    }

    saveAvatarConfig(avatarConfig: SelectedFrames): UserData {
        console.log('UserDataManager - Saving avatar config:', avatarConfig);
        return this.saveUserData({ avatarConfig });
    }

    setUsername(username: string): UserData {
        return this.saveUserData({ username });
    }

    clearUserData(): void {
        if (typeof window !== 'undefined') {
            console.log('UserDataManager - Clearing user data');
            localStorage.removeItem(this.storageKey);
        }
    }
} 