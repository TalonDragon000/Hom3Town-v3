import { SPRITE_SHEET_CONFIG } from './spriteMetadata';

export interface SpritePosition {
    x: number;
    y: number;
}

export const calculateSpritePosition = (frameIndex: number): SpritePosition => {
    const column = frameIndex % SPRITE_SHEET_CONFIG.columns;
    const row = Math.floor(frameIndex / SPRITE_SHEET_CONFIG.columns);
    
    return {
        x: -(column * SPRITE_SHEET_CONFIG.tileWidth),
        y: -(row * SPRITE_SHEET_CONFIG.tileHeight)
    };
};

export const getBackgroundStyle = (frameId: number, spriteSheetPath: string) => {
    console.log(`Calculating background style for frame ${frameId}`);
    
    const { tileWidth, tileHeight, columns } = SPRITE_SHEET_CONFIG;
    
    // Calculate position in sprite sheet
    const row = Math.floor(frameId / columns);
    const col = frameId % columns;
    
    const xPos = col * tileWidth;
    const yPos = row * tileHeight;
    
    console.log(`Frame ${frameId} position: row=${row}, col=${col}, x=${xPos}px, y=${yPos}px`);
    
    const style = {
        backgroundImage: `url(${spriteSheetPath})`,
        backgroundPosition: `-${xPos}px -${yPos}px`,
        backgroundSize: `${SPRITE_SHEET_CONFIG.imageWidth}px ${SPRITE_SHEET_CONFIG.imageHeight}px`,
    };
    
    console.log(`Generated style:`, style);
    
    return style;
}; 