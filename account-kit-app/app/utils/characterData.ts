import { SPRITE_METADATA, SpriteProperties, getTraitOptions } from './spriteMetadata';

export type Category = 'body' | 'face' | 'clothes' | 'facialHair' | 'hair';
export type Gender = 'male' | 'female' | 'unisex';

// Categories that can have multiple selections
export const MULTI_SELECT_CATEGORIES = ['face', 'clothes', 'facialHair'];

export interface SelectedFrames {
  body: number | null;
  face: number[];
  clothes: number[];
  facialHair: number[];
  hair: number | null;
}

export const DEFAULT_SELECTED_FRAMES: SelectedFrames = {
  body: null,
  face: [],
  clothes: [],
  facialHair: [],
  hair: null
};

// Layer order for rendering sprites
export const LAYER_ORDER: Category[] = ['body', 'face', 'clothes', 'facialHair', 'hair'];

// Helper function to get the correct metadata key
const getMetadataKey = (category: Category): string => {
  // Map the category to the correct key in SPRITE_METADATA
  const keyMap: Record<Category, string> = {
    body: 'body',
    face: 'face',
    clothes: 'clothes',
    facialHair: 'facialHair',
    hair: 'hair'
  };
  return keyMap[category];
};

// Get frame IDs for each category
export const FRAME_TAGS: Record<Category, number[]> = {
  body: getTraitOptions('body').map(sprite => sprite.id),
  face: getTraitOptions('face').map(sprite => sprite.id),
  clothes: getTraitOptions('clothes').map(sprite => sprite.id),
  facialHair: getTraitOptions(getMetadataKey('facialHair')).map(sprite => {
    console.log('Loading facial hair frame:', sprite);
    return sprite.id;
  }),
  hair: getTraitOptions('hair').map(sprite => sprite.id)
};

// Debug log the frame tags
console.log('Initialized FRAME_TAGS:', FRAME_TAGS);

export const isBlankFrame = (frameId: number): boolean => {
  // Frame 23 is blank in the sprite sheet
  // Frames 31-35 are blank clothing frames
  const blankFrames = [23, 31, 32, 33, 34, 35, 128, 129, 130, 131];
  return blankFrames.includes(frameId);
};

export const determineGender = (bodyFrameId: number): Gender => {
  const bodySprite = SPRITE_METADATA.body.find(sprite => sprite.id === bodyFrameId);
  console.log(`Determining gender for body frame ${bodyFrameId}:`, bodySprite?.gender);
  return bodySprite?.gender.toLowerCase() as Gender || 'unisex';
};

export const isFrameAllowedForGender = (frameId: number, gender: Gender): boolean => {
  // Find the sprite in any category
  const sprite = Object.values(SPRITE_METADATA)
    .flat()
    .find(s => s.id === frameId);

  if (!sprite) {
    console.log(`No sprite found for frame ${frameId}`);
    return false;
  }

  const isAllowed = sprite.gender.toLowerCase() === gender || sprite.gender.toLowerCase() === 'unisex';
  console.log(`Frame ${frameId} (${sprite.gender}) allowed for ${gender}: ${isAllowed}`);
  return isAllowed;
};

export const isMultiSelectCategory = (category: Category): boolean => {
  const isMulti = MULTI_SELECT_CATEGORIES.includes(category);
  if (category === 'facialHair') {
    console.log('Checking if facialHair is multi-select:', isMulti);
  }
  return isMulti;
};