'use client';

import React from 'react';
import { useAvatarConfig } from '../hooks/useAvatarConfig';
import { SPRITE_SHEET_CONFIG } from '../utils/spriteMetadata';
import { LAYER_ORDER, isMultiSelectCategory, Category } from '../utils/characterData';
import { getBackgroundStyle } from '../utils/spriteUtils';
import Image from 'next/image';

interface AvatarProps {
    defaultImagePath: string;
    className?: string;
    size?: 'small' | 'normal';
}

const sizeMap = {
    small: {
        container: 'w-8 h-16', // 32x64px container
        sprite: {
            width: 64,
            height: 128,
            scale: 0.5
        },
        defaultImage: {
            width: 64,
            height: 128,
            scale: 1 // Scale from 256x512 to 32x64
        }
    },
    normal: {
        container: 'w-16 h-32', // 64x128px container
        sprite: {
            width: 64,
            height: 128,
            scale: 1
        },
        defaultImage: {
            width: 64,
            height: 128,
            scale: 1 // Scale from 256x512 to 64x128
        }
    }
};

export const Avatar: React.FC<AvatarProps> = ({ 
    defaultImagePath,
    className = '',
    size = 'normal'
}) => {
    const { avatarConfig, isLoading, hasAvatar } = useAvatarConfig();
    const sizeConfig = sizeMap[size];

    if (isLoading) {
        return <div className={`${sizeConfig.container} animate-pulse bg-gray-200 rounded ${className}`} />;
    }

    if (!hasAvatar) {
        return (
            <div className={`${sizeConfig.container} relative overflow-hidden ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={defaultImagePath}
                        alt="Default Avatar"
                        width={sizeConfig.defaultImage.width}
                        height={sizeConfig.defaultImage.height}
                        className="object-contain"
                        style={{
                            transform: `scale(${sizeConfig.defaultImage.scale})`,
                            transformOrigin: 'center'
                        }}
                        priority
                    />
                </div>
            </div>
        );
    }

    const renderLayer = (layer: Category) => {
        if (isMultiSelectCategory(layer)) {
            // For multi-select categories, render each frame
            const frameIds = avatarConfig[layer] as number[];
            return frameIds.map(frameId => (
                <div
                    key={`${layer}-${frameId}`}
                    className="absolute inset-0"
                    style={{
                        ...getBackgroundStyle(frameId, SPRITE_SHEET_CONFIG.imagePath),
                        width: `${sizeConfig.sprite.width}px`,
                        height: `${sizeConfig.sprite.height}px`,
                        transform: `scale(${sizeConfig.sprite.scale})`,
                        transformOrigin: 'top left'
                    }}
                />
            ));
        } else {
            // For single-select categories
            const frameId = avatarConfig[layer] as number;
            if (!frameId) return null;

            return (
                <div
                    key={`${layer}-${frameId}`}
                    className="absolute inset-0"
                    style={{
                        ...getBackgroundStyle(frameId, SPRITE_SHEET_CONFIG.imagePath),
                        width: `${sizeConfig.sprite.width}px`,
                        height: `${sizeConfig.sprite.height}px`,
                        transform: `scale(${sizeConfig.sprite.scale})`,
                        transformOrigin: 'top left'
                    }}
                />
            );
        }
    };

    return (
        <div className={`${sizeConfig.container} relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center">
                {LAYER_ORDER.map(layer => renderLayer(layer))}
            </div>
        </div>
    );
};
