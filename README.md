# Hom3Town

A Next.js 13+ application featuring a sprite-based character creator system with real-time preview and persistent storage.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/TalonDragon000/Hom3Town-v3.git

# Navigate to the project directory
cd account-kit-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Prerequisites

- Node.js 18+
- NPM or Yarn
- Alchemy Account Kit (for authentication)

## Project Structure

```
account-kit-app/
├── app/
│   ├── components/        # React components
│   │   ├── Avatar.tsx     # Reusable avatar display
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── styles/            # CSS styles
├── public/
│   └── images/            # Sprite sheets and images
└── package.json
```

## Features

- Sprite-based character customization
- Real-time preview
- Multiple avatar display sizes (32x64px, 64x128px)
- Persistent storage using localStorage
- Gender-specific traits
- Multi-select categories for detailed customization

## Configuration

1. Place your sprite sheet in `public/images/`
2. Update sprite metadata in `app/utils/spriteMetadata.ts`
3. Configure Account Kit authentication

## Usage

### Avatar Display Component
```tsx
// Small size (32x64px)
<Avatar 
    defaultImagePath="/images/default-avatar.png"
    size="small"
/>

// Normal size (64x128px)
<Avatar 
    defaultImagePath="/images/default-avatar.png"
    size="normal"
/>
```

### Character Creator
```tsx
<CharacterCreatorClient defaultImagePath="/images/default-avatar.png" />
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Data Structure

Avatar configurations are stored with the following structure:
```typescript
interface SelectedFrames {
    body: number | null;
    face: number[];
    clothes: number[];
    facialHair: number[];
    hair: number | null;
}
```

## Dependencies

- Next.js 13+ (for server-side rendering)
- React 18+ (for UI)
- Tailwind CSS (for styling)
- AlchemyAccount Kit (for authentication)
- Shape Network and Shape Sepolia (for blockchain)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Account Kit for authentication
- Next.js team for the amazing framework
- Contributors and maintainers