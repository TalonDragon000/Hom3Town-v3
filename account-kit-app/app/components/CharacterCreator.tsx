'use client';

import React, { useEffect } from 'react';
import { Category, FRAME_TAGS, isBlankFrame, isFrameAllowedForGender, isMultiSelectCategory } from '../utils/characterData';
import { getBackgroundStyle } from '../utils/spriteUtils';

interface CharacterCreatorProps {
    activeCategory: Category;
    selectedGender: 'male' | 'female' | 'unisex' | null;
    selectedFrames: Record<Category, number | null | number[]>;
    onCategoryChange: (category: Category) => void;
    onFrameSelect: (frameId: number, category: Category) => void;
    spriteSheetPath: string;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({
    activeCategory,
    selectedGender,
    selectedFrames,
    onCategoryChange,
    onFrameSelect,
    spriteSheetPath
}) => {
    // Debug log when category or gender changes
    useEffect(() => {
        if (activeCategory === 'facialHair') {
            console.log('Facial Hair Category Selected');
            console.log('Current Gender:', selectedGender);
            console.log('Available Frames:', FRAME_TAGS[activeCategory]);
        }
    }, [activeCategory, selectedGender]);

    const renderAssetButtons = () => {
        const frames = FRAME_TAGS[activeCategory] || [];
        //console.log(`Rendering frames for ${activeCategory}:`, frames);
        return frames.map((frameId) => {
            //console.log(`Rendering frame ${frameId} for ${activeCategory}`);
            
            // Skip blank frames
            if (isBlankFrame(frameId)) {
                //console.log(`Skipping blank frame ${frameId}`);
                return null;
            }
            
            // Check gender compatibility for all categories except body
            if (selectedGender && activeCategory !== 'body') {
                const isAllowed = isFrameAllowedForGender(frameId, selectedGender);
                if (!isAllowed) {
                    if (activeCategory === 'facialHair') {
                        //console.log(`Facial hair frame ${frameId} not allowed for ${selectedGender}`);
                    }
                    return null;
                } else if (activeCategory === 'facialHair') {
                    //console.log(`Facial hair frame ${frameId} allowed for ${selectedGender}`);
                }
            }
            
            const isSelected = isMultiSelectCategory(activeCategory)
                ? (selectedFrames[activeCategory] as number[]).includes(frameId)
                : selectedFrames[activeCategory] === frameId;

            const style = getBackgroundStyle(frameId, spriteSheetPath);
            if (activeCategory === 'facialHair') {
                //console.log(`Generated style for facial hair frame ${frameId}:`, style);
            }
            
            return (
                <div
                    key={frameId}
                    className={`sprite-option ${isSelected ? 'selected' : ''}`}
                    style={style}
                    onClick={() => onFrameSelect(frameId, activeCategory)}
                    data-frame-id={frameId}
                    data-category={activeCategory}
                >
                    <div className="frame-id-display">ID: {frameId}</div>
                </div> 
            );
        }).filter(Boolean); // Remove null values
    };

    return (
        <div className="create-container">
            <div className="text-center text-2xl mb-4">
                <h3>Create Character</h3>
            </div>
            <div className="asset-tabs">
                {Object.keys(FRAME_TAGS)
                    .filter(category => 
                        category !== 'male' && 
                        category !== 'female' && 
                        category !== 'unisex'
                    )
                    .map((category) => {
                        const isDisabled = category !== 'body' && 
                            (selectedFrames.body === null || selectedFrames.body === undefined);
                        return (
                            <button
                                key={category}
                                className={`tab ${activeCategory === category ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                onClick={() => onCategoryChange(category as Category)}
                                disabled={isDisabled}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        );
                    })}
            </div>
            <div className="asset-container">
                {renderAssetButtons()}
            </div>
            {isMultiSelectCategory(activeCategory) ? (
                <div className="text-sm text-gray-500 mt-1">
                    (Multiple selections allowed)
                </div>
            ) : (
                <div className="text-sm text-gray-500 mt-1">
                    (Select one)
                </div>
            )}
            <div className="frame-id-display">
                Selected ID(s): <span>
                    {isMultiSelectCategory(activeCategory)
                        ? (selectedFrames[activeCategory] as number[]).join(', ') || 'None'
                        : selectedFrames[activeCategory]?.toString() || 'None'
                    }
                </span>
            </div>
        </div>
    );
};

export default CharacterCreator;