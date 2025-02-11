'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Category, LAYER_ORDER, isMultiSelectCategory } from '../utils/characterData';
import { getBackgroundStyle } from '../utils/spriteUtils';

interface CharacterPreviewProps {
    onClear: () => void;
    onConfirm: () => void;
    selectedFrames: Record<Category, number | null | number[]>;
    defaultImagePath: string;
    spriteSheetPath: string;
    showError: boolean;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ 
    onClear, 
    onConfirm, 
    selectedFrames,
    defaultImagePath,
    spriteSheetPath,
    showError
}) => {
    // Debug log for selectedFrames
    useEffect(() => {
        console.log('Selected Frames:', selectedFrames);
    }, [selectedFrames]);

    const hasAnySelection = selectedFrames.body !== null;
    console.log('Has Any Selection:', hasAnySelection); // Debug log

    const renderLayer = (layer: Category) => {
        const frameIds = selectedFrames[layer];
        console.log(`Attempting to render layer: ${layer}, frameIds:`, frameIds); // Debug log

        // Early return if no frameIds (including 0)
        if (frameIds === null || frameIds === undefined) {
            console.log(`No frameIds for layer ${layer}`);
            return null;
        }

        if (isMultiSelectCategory(layer)) {
            // Render multiple frames for multi-select categories
            return (frameIds as number[]).map(frameId => {
                console.log(`Rendering multi-select frame ${frameId} for layer ${layer}`);
                const style = {
                    ...getBackgroundStyle(frameId, spriteSheetPath),
                };
                
                return (
                    <div
                        key={`${layer}-${frameId}`}
                        id={`preview-${layer}-${frameId}`}
                        className="preview-layer"
                        style={style}
                    />
                );
            });
        } else {
            // Render single frame for single-select categories
            const frameId = frameIds as number;
            console.log(`Rendering single-select frame ${frameId} for layer ${layer}`);
            
            const style = {
                ...getBackgroundStyle(frameId, spriteSheetPath),
            };
            console.log(`Generated style for frame ${frameId}:`, style);
            
            return (
                <div
                    key={`${layer}-${frameId}`}
                    id={`preview-${layer}-${frameId}`}
                    className="preview-layer"
                    style={style}
                    data-frame-id={frameId} // Add data attribute for debugging
                />
            );
        }
    };

    return (
        <div className="preview-container">
            <div className="text-center text-2xl mb-4"><h3>Preview Character</h3></div>
            <div className="preview-character flex justify-center items-center">
                {!hasAnySelection ? (
                    <div className="preview-default">
                        <Image
                            src={defaultImagePath}
                            alt="Default Character"
                            width={64}
                            height={128}
                            priority
                        />
                    </div>
                ) : (
                    LAYER_ORDER.map(layer => {
                        console.log(`Processing layer: ${layer}`); // Debug log
                        return renderLayer(layer);
                    })
                )}
            </div>
            <div className="text-center mt-4">
                <button className="action-btn" onClick={onClear}>CLEAR</button>
                <button className="action-btn" onClick={onConfirm}>CONFIRM</button>
                <button className="action-btn" onClick={() => window.location.href = '/dashboard'}>RETURN HOME</button>
            </div>
            <div className="error-message" style={{ display: showError ? 'block' : 'none' }}>
                Please log in to save your character
            </div>
        </div>
    );
};

export default CharacterPreview;