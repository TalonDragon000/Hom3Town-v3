import { useState, useEffect } from 'react';
import { useUser, useSignerStatus } from "@account-kit/react";
import { UserDataManager } from '../utils/userDataManager';
import { SelectedFrames, DEFAULT_SELECTED_FRAMES } from '../utils/characterData';

export const useAvatarConfig = () => {
    const user = useUser();
    const { isConnected } = useSignerStatus();
    const [avatarConfig, setAvatarConfig] = useState<SelectedFrames>(DEFAULT_SELECTED_FRAMES);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (isConnected && user) {
            const userDataManager = UserDataManager.getInstance();
            const userData = userDataManager.getUserData();
            if (userData.avatarConfig) {
                setAvatarConfig(userData.avatarConfig);
            }
        }
        setIsLoading(false);
    }, [isConnected, user]);

    const updateAvatarConfig = (newConfig: SelectedFrames) => {
        const userDataManager = UserDataManager.getInstance();
        userDataManager.saveAvatarConfig(newConfig);
        setAvatarConfig(newConfig);
    };

    return {
        avatarConfig,
        updateAvatarConfig,
        isLoading,
        hasAvatar: !!avatarConfig.body,
    };
}; 