// Sprite sheet metadata for character customization
export interface SpriteProperties {
  id: number;
  gender: 'Male' | 'Female' | 'Unisex';
  trait: string;
  traitType?: string;
  color?: string;
  hairstyle?: string;
}

export const SPRITE_SHEET_CONFIG = {
  tileWidth: 64,
  tileHeight: 128,
  columns: 12,
  totalTiles: 132,
  imagePath: '/images/starter-set.png',
  imageWidth: 768,
  imageHeight: 1408
};

// Organized by trait categories for easier lookup
export const SPRITE_METADATA: Record<string, SpriteProperties[]> = {
  body: [
    { id: 0, gender: 'Male', trait: 'Body', traitType: 'Light' },
    { id: 1, gender: 'Male', trait: 'Body', traitType: 'Tan' },
    { id: 2, gender: 'Male', trait: 'Body', traitType: 'Dark' },
    { id: 3, gender: 'Female', trait: 'Body', traitType: 'Light' },
    { id: 4, gender: 'Female', trait: 'Body', traitType: 'Tan' },
    { id: 5, gender: 'Female', trait: 'Body', traitType: 'Dark' }
  ],
  face: [
    { id: 6, gender: 'Male', trait: 'Face', traitType: 'Eyes', color: 'Blue' },
    { id: 7, gender: 'Male', trait: 'Face', traitType: 'Eyes', color: 'Brown' },
    { id: 8, gender: 'Male', trait: 'Face', traitType: 'Eyes', color: 'Green' },
    { id: 9, gender: 'Female', trait: 'Face', traitType: 'Eyes', color: 'Blue' },
    { id: 10, gender: 'Female', trait: 'Face', traitType: 'Eyes', color: 'Brown' },
    { id: 11, gender: 'Female', trait: 'Face', traitType: 'Eyes', color: 'Green' },
    { id: 12, gender: 'Male', trait: 'Face', traitType: 'Eyebrows', color: 'Black' },
    { id: 13, gender: 'Male', trait: 'Face', traitType: 'Eyebrows', color: 'Blonde' },
    { id: 14, gender: 'Male', trait: 'Face', traitType: 'Eyebrows', color: 'Brown' },
    { id: 15, gender: 'Male', trait: 'Face', traitType: 'Eyebrows', color: 'Red' },
    { id: 16, gender: 'Female', trait: 'Face', traitType: 'Eyebrows', color: 'Black' },
    { id: 17, gender: 'Female', trait: 'Face', traitType: 'Eyebrows', color: 'Blonde' },
    { id: 18, gender: 'Female', trait: 'Face', traitType: 'Eyebrows', color: 'Brown' },
    { id: 19, gender: 'Female', trait: 'Face', traitType: 'Eyebrows', color: 'Red' },
    { id: 20, gender: 'Female', trait: 'Face', traitType: 'Lashes' },
    { id: 21, gender: 'Unisex', trait: 'Face', traitType: 'Mouth' },
    { id: 22, gender: 'Unisex', trait: 'Face', traitType: 'Mouth' }
  ],
  clothes: [
    { id: 24, gender: 'Male', trait: 'Clothes', traitType: 'Underwear' },
    { id: 25, gender: 'Female', trait: 'Clothes', traitType: 'Underwear' },
    { id: 26, gender: 'Male', trait: 'Clothes', traitType: 'Shoes' },
    { id: 27, gender: 'Female', trait: 'Clothes', traitType: 'Shoes' },
    { id: 28, gender: 'Male', trait: 'Clothes', traitType: 'Top' },
    { id: 29, gender: 'Male', trait: 'Clothes', traitType: 'Bottom' },
    { id: 30, gender: 'Female', trait: 'Clothes', traitType: 'Top' },
    { id: 31, gender: 'Female', trait: 'Clothes', traitType: 'Bottom' },
    { id: 32, gender: 'Male', trait: 'Clothes', traitType: 'Full' },
    { id: 33, gender: 'Female', trait: 'Clothes', traitType: 'Full' },
    { id: 34, gender: 'Male', trait: 'Clothes', traitType: 'Accessory' },
    { id: 35, gender: 'Female', trait: 'Clothes', traitType: 'Accessory' }
  ],
  facialHair: [
    // Shadow
    { id: 36, gender: 'Male', trait: 'facialHair', hairstyle: 'Shadow', color: 'Black' },
    { id: 37, gender: 'Male', trait: 'facialHair', hairstyle: 'Shadow', color: 'Blonde' },
    { id: 38, gender: 'Male', trait: 'facialHair', hairstyle: 'Shadow', color: 'Brown' },
    { id: 39, gender: 'Male', trait: 'facialHair', hairstyle: 'Shadow', color: 'Red' },
    // Beard
    { id: 40, gender: 'Male', trait: 'facialHair', hairstyle: 'Beard', color: 'Black' },
    { id: 41, gender: 'Male', trait: 'facialHair', hairstyle: 'Beard', color: 'Blonde' },
    { id: 42, gender: 'Male', trait: 'facialHair', hairstyle: 'Beard', color: 'Brown' },
    { id: 43, gender: 'Male', trait: 'facialHair', hairstyle: 'Beard', color: 'Red' },
    // Sideburns
    { id: 44, gender: 'Male', trait: 'facialHair', hairstyle: 'Sideburn', color: 'Black' },
    { id: 45, gender: 'Male', trait: 'facialHair', hairstyle: 'Sideburn', color: 'Blonde' },
    { id: 46, gender: 'Male', trait: 'facialHair', hairstyle: 'Sideburn', color: 'Brown' },
    { id: 47, gender: 'Male', trait: 'facialHair', hairstyle: 'Sideburn', color: 'Red' },
    // Goatee
    { id: 48, gender: 'Male', trait: 'facialHair', hairstyle: 'Goatee', color: 'Black' },
    { id: 49, gender: 'Male', trait: 'facialHair', hairstyle: 'Goatee', color: 'Blonde' },
    { id: 50, gender: 'Male', trait: 'facialHair', hairstyle: 'Goatee', color: 'Brown' },
    { id: 51, gender: 'Male', trait: 'facialHair', hairstyle: 'Goatee', color: 'Red' },
    // Long Mustache
    { id: 52, gender: 'Male', trait: 'facialHair', hairstyle: 'Long Mustache', color: 'Black' },
    { id: 53, gender: 'Male', trait: 'facialHair', hairstyle: 'Long Mustache', color: 'Blonde' },
    { id: 54, gender: 'Male', trait: 'facialHair', hairstyle: 'Long Mustache', color: 'Brown' },
    { id: 55, gender: 'Male', trait: 'facialHair', hairstyle: 'Long Mustache', color: 'Red' },
    // Short Mustache
    { id: 56, gender: 'Male', trait: 'facialHair', hairstyle: 'Short Mustache', color: 'Black' },
    { id: 57, gender: 'Male', trait: 'facialHair', hairstyle: 'Short Mustache', color: 'Blonde' },
    { id: 58, gender: 'Male', trait: 'facialHair', hairstyle: 'Short Mustache', color: 'Brown' },
    { id: 59, gender: 'Male', trait: 'facialHair', hairstyle: 'Short Mustache', color: 'Red' },
    // Full Beard
    { id: 128, gender: 'Male', trait: 'facialHair', hairstyle: 'Full Beard', color: 'Black' },
    { id: 129, gender: 'Male', trait: 'facialHair', hairstyle: 'Full Beard', color: 'Blonde' },
    { id: 130, gender: 'Male', trait: 'facialHair', hairstyle: 'Full Beard', color: 'Brown' },
    { id: 131, gender: 'Male', trait: 'facialHair', hairstyle: 'Full Beard', color: 'Red' }
  ],
  hair: [
    // Buzz Cut
    { id: 60, gender: 'Male', trait: 'Hair', hairstyle: 'Buzz', color: 'Black' },
    { id: 61, gender: 'Male', trait: 'Hair', hairstyle: 'Buzz', color: 'Blonde' },
    { id: 62, gender: 'Male', trait: 'Hair', hairstyle: 'Buzz', color: 'Brown' },
    { id: 63, gender: 'Male', trait: 'Hair', hairstyle: 'Buzz', color: 'Red' },
    { id: 64, gender: 'Female', trait: 'Hair', hairstyle: 'Buzz', color: 'Black' },
    { id: 65, gender: 'Female', trait: 'Hair', hairstyle: 'Buzz', color: 'Blonde' },
    { id: 66, gender: 'Female', trait: 'Hair', hairstyle: 'Buzz', color: 'Brown' },
    { id: 67, gender: 'Female', trait: 'Hair', hairstyle: 'Buzz', color: 'Red' },
    // Messy
    { id: 68, gender: 'Unisex', trait: 'Hair', hairstyle: 'Messy', color: 'Black' },
    { id: 69, gender: 'Unisex', trait: 'Hair', hairstyle: 'Messy', color: 'Blonde' },
    { id: 70, gender: 'Unisex', trait: 'Hair', hairstyle: 'Messy', color: 'Brown' },
    { id: 71, gender: 'Unisex', trait: 'Hair', hairstyle: 'Messy', color: 'Red' },
    // Spiked
    { id: 72, gender: 'Male', trait: 'Hair', hairstyle: 'Spiked', color: 'Black' },
    { id: 73, gender: 'Male', trait: 'Hair', hairstyle: 'Spiked', color: 'Blonde' },
    { id: 74, gender: 'Male', trait: 'Hair', hairstyle: 'Spiked', color: 'Brown' },
    { id: 75, gender: 'Male', trait: 'Hair', hairstyle: 'Spiked', color: 'Red' },
    { id: 76, gender: 'Female', trait: 'Hair', hairstyle: 'Spiked', color: 'Black' },
    { id: 77, gender: 'Female', trait: 'Hair', hairstyle: 'Spiked', color: 'Blonde' },
    { id: 78, gender: 'Female', trait: 'Hair', hairstyle: 'Spiked', color: 'Brown' },
    { id: 79, gender: 'Female', trait: 'Hair', hairstyle: 'Spiked', color: 'Red' },
    // Ponytail
    { id: 80, gender: 'Male', trait: 'Hair', hairstyle: 'Ponytail', color: 'Black' },
    { id: 81, gender: 'Male', trait: 'Hair', hairstyle: 'Ponytail', color: 'Blonde' },
    { id: 82, gender: 'Male', trait: 'Hair', hairstyle: 'Ponytail', color: 'Brown' },
    { id: 83, gender: 'Male', trait: 'Hair', hairstyle: 'Ponytail', color: 'Red' },
    { id: 84, gender: 'Female', trait: 'Hair', hairstyle: 'Ponytail', color: 'Black' },
    { id: 85, gender: 'Female', trait: 'Hair', hairstyle: 'Ponytail', color: 'Blonde' },
    { id: 86, gender: 'Female', trait: 'Hair', hairstyle: 'Ponytail', color: 'Brown' },
    { id: 87, gender: 'Female', trait: 'Hair', hairstyle: 'Ponytail', color: 'Red' },
    // Bun
    { id: 88, gender: 'Male', trait: 'Hair', hairstyle: 'Bun', color: 'Black' },
    { id: 89, gender: 'Male', trait: 'Hair', hairstyle: 'Bun', color: 'Blonde' },
    { id: 90, gender: 'Male', trait: 'Hair', hairstyle: 'Bun', color: 'Brown' },
    { id: 91, gender: 'Male', trait: 'Hair', hairstyle: 'Bun', color: 'Red' },
    { id: 92, gender: 'Female', trait: 'Hair', hairstyle: 'Bun', color: 'Black' },
    { id: 93, gender: 'Female', trait: 'Hair', hairstyle: 'Bun', color: 'Blonde' },
    { id: 94, gender: 'Female', trait: 'Hair', hairstyle: 'Bun', color: 'Brown' },
    { id: 95, gender: 'Female', trait: 'Hair', hairstyle: 'Bun', color: 'Red' },
    // Short
    { id: 96, gender: 'Male', trait: 'Hair', hairstyle: 'Short', color: 'Black' },
    { id: 97, gender: 'Male', trait: 'Hair', hairstyle: 'Short', color: 'Blonde' },
    { id: 98, gender: 'Male', trait: 'Hair', hairstyle: 'Short', color: 'Brown' },
    { id: 99, gender: 'Male', trait: 'Hair', hairstyle: 'Short', color: 'Red' },
    { id: 100, gender: 'Female', trait: 'Hair', hairstyle: 'Short', color: 'Black' },
    { id: 101, gender: 'Female', trait: 'Hair', hairstyle: 'Short', color: 'Blonde' },
    { id: 102, gender: 'Female', trait: 'Hair', hairstyle: 'Short', color: 'Brown' },
    { id: 103, gender: 'Female', trait: 'Hair', hairstyle: 'Short', color: 'Red' },
    // Afro
    { id: 104, gender: 'Male', trait: 'Hair', hairstyle: 'Afro', color: 'Black' },
    { id: 105, gender: 'Male', trait: 'Hair', hairstyle: 'Afro', color: 'Blonde' },
    { id: 106, gender: 'Male', trait: 'Hair', hairstyle: 'Afro', color: 'Brown' },
    { id: 107, gender: 'Male', trait: 'Hair', hairstyle: 'Afro', color: 'Red' },
    { id: 108, gender: 'Female', trait: 'Hair', hairstyle: 'Afro', color: 'Black' },
    { id: 109, gender: 'Female', trait: 'Hair', hairstyle: 'Afro', color: 'Blonde' },
    { id: 110, gender: 'Female', trait: 'Hair', hairstyle: 'Afro', color: 'Brown' },
    { id: 111, gender: 'Female', trait: 'Hair', hairstyle: 'Afro', color: 'Red' },
    // Braided
    { id: 112, gender: 'Male', trait: 'Hair', hairstyle: 'Braided', color: 'Black' },
    { id: 113, gender: 'Male', trait: 'Hair', hairstyle: 'Braided', color: 'Blonde' },
    { id: 114, gender: 'Male', trait: 'Hair', hairstyle: 'Braided', color: 'Brown' },
    { id: 115, gender: 'Male', trait: 'Hair', hairstyle: 'Braided', color: 'Red' },
    { id: 116, gender: 'Female', trait: 'Hair', hairstyle: 'Braided', color: 'Black' },
    { id: 117, gender: 'Female', trait: 'Hair', hairstyle: 'Braided', color: 'Blonde' },
    { id: 118, gender: 'Female', trait: 'Hair', hairstyle: 'Braided', color: 'Brown' },
    { id: 119, gender: 'Female', trait: 'Hair', hairstyle: 'Braided', color: 'Red' },
    // Long
    { id: 120, gender: 'Male', trait: 'Hair', hairstyle: 'Long', color: 'Black' },
    { id: 121, gender: 'Male', trait: 'Hair', hairstyle: 'Long', color: 'Blonde' },
    { id: 122, gender: 'Male', trait: 'Hair', hairstyle: 'Long', color: 'Brown' },
    { id: 123, gender: 'Male', trait: 'Hair', hairstyle: 'Long', color: 'Red' },
    { id: 124, gender: 'Female', trait: 'Hair', hairstyle: 'Long', color: 'Black' },
    { id: 125, gender: 'Female', trait: 'Hair', hairstyle: 'Long', color: 'Blonde' },
    { id: 126, gender: 'Female', trait: 'Hair', hairstyle: 'Long', color: 'Brown' },
    { id: 127, gender: 'Female', trait: 'Hair', hairstyle: 'Long', color: 'Red' }
  ]
};

// Helper functions
export const getTraitOptions = (trait: string, gender?: 'Male' | 'Female' | 'Unisex'): SpriteProperties[] => {
  console.log(`Getting trait options for: ${trait}`);
  
  // Get the exact key that matches the trait in SPRITE_METADATA
  const metadataKey = Object.keys(SPRITE_METADATA).find(
    key => key.toLowerCase() === trait.toLowerCase()
  );
  console.log(`Found metadata key: ${metadataKey}`);
  
  if (!metadataKey) {
    console.log(`No metadata found for trait: ${trait}`);
    return [];
  }
  
  const metadata = SPRITE_METADATA[metadataKey];
  console.log(`Found metadata for ${trait}:`, metadata);
  
  const options = metadata || [];
  console.log(`Options before gender filter:`, options);
  
  if (!gender) return options;
  
  const filtered = options.filter(sprite => sprite.gender === gender || sprite.gender === 'Unisex');
  console.log(`Options after gender filter:`, filtered);
  
  return filtered;
};

export const getTraitColors = (trait: string): string[] => {
  const options = SPRITE_METADATA[trait.toLowerCase()] || [];
  return Array.from(new Set(options.map(sprite => sprite.color).filter(Boolean))) as string[];
};

export const getTraitStyles = (trait: string): string[] => {
  const options = SPRITE_METADATA[trait.toLowerCase()] || [];
  return Array.from(new Set(options.map(sprite => sprite.hairstyle).filter(Boolean))) as string[];
};