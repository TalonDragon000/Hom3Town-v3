'use client';

import React, { useState, useEffect } from 'react';
import { useSignerStatus, useUser } from "@account-kit/react";
import CharacterPreview from './CharacterPreview';
import CharacterCreator from './CharacterCreator';
import { Category, DEFAULT_SELECTED_FRAMES, determineGender, SelectedFrames, isMultiSelectCategory } from '../utils/characterData';
import { SPRITE_SHEET_CONFIG } from '../utils/spriteMetadata';
import { UserDataManager } from '../utils/userDataManager';

interface CharacterCreatorClientProps {
    defaultImagePath: string;
}

const CharacterCreatorClient: React.FC<CharacterCreatorClientProps> = ({ defaultImagePath }) => {
    const { isConnected } = useSignerStatus();
    const user = useUser();
    const [selectedCategory, setSelectedCategory] = useState<Category>('body');
    const [selectedFrames, setSelectedFrames] = useState<SelectedFrames>(DEFAULT_SELECTED_FRAMES);
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'unisex' | null>(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (isConnected && user) {
            const userDataManager = UserDataManager.getInstance();
            const userData = userDataManager.getUserData();
            
            if (userData.avatarConfig) {
                setSelectedFrames(userData.avatarConfig);
                // Determine gender from saved body selection
                if (userData.avatarConfig.body) {
                    const gender = determineGender(userData.avatarConfig.body);
                    setSelectedGender(gender);
                }
            }
        }
    }, [isConnected, user]);

    const handleClear = () => {
        setSelectedFrames(DEFAULT_SELECTED_FRAMES);
        setSelectedGender(null);
        setSelectedCategory('body');
    };

    const handleConfirm = () => {
        if (!isConnected) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        if (!selectedFrames.body) {
            alert('Please select a body type first!');
            return;
        }

        try {
            const userDataManager = UserDataManager.getInstance();
            userDataManager.saveAvatarConfig(selectedFrames);
            console.log("Character configuration saved successfully:", selectedFrames);
        } catch (error) {
            console.error("Error saving character configuration:", error);
            alert('Failed to save character configuration. Please try again.');
        }
    };

    const handleCategoryChange = (category: Category) => {
        if (category === 'body' || 
            selectedFrames.body !== null && 
            selectedFrames.body !== undefined) {
            setSelectedCategory(category);
        }
    };

    const handleFrameSelect = (frameId: number, category: Category) => {
        if (category === 'body') {
            const newGender = determineGender(frameId);
            // Only reset other selections if the gender changes
            if (newGender !== selectedGender) {
                setSelectedGender(newGender);
                // Reset all selections except body when gender changes
                setSelectedFrames({
                    ...DEFAULT_SELECTED_FRAMES,
                    body: frameId
                });
            } else {
                // Just update the body without clearing other selections
                setSelectedFrames(prev => ({
                    ...prev,
                    body: frameId
                }));
            }
        } else if (isMultiSelectCategory(category)) {
            // For multi-select categories, toggle the selection
            setSelectedFrames(prev => {
                const currentSelections = prev[category] as number[];
                const newSelections = currentSelections.includes(frameId)
                    ? currentSelections.filter(id => id !== frameId)
                    : [...currentSelections, frameId];
                
                return {
                    ...prev,
                    [category]: newSelections
                };
            });
        } else {
            // For single-select categories, just update the specific part
            setSelectedFrames(prev => ({
                ...prev,
                [category]: frameId
            }));
        }
    };

    return (
        <div className="character-container">
            <CharacterPreview 
                onClear={handleClear} 
                onConfirm={handleConfirm}
                selectedFrames={selectedFrames}
                defaultImagePath={defaultImagePath}
                spriteSheetPath={SPRITE_SHEET_CONFIG.imagePath}
                showError={showError}
            />
            <CharacterCreator 
                activeCategory={selectedCategory}
                selectedGender={selectedGender}
                selectedFrames={selectedFrames}
                onCategoryChange={handleCategoryChange}
                onFrameSelect={handleFrameSelect}
                spriteSheetPath={SPRITE_SHEET_CONFIG.imagePath}
            />
        </div>
    );
};

export default CharacterCreatorClient; 