# Hom3Town

## Your home in the metaverse

A Next.js 13+ application featuring a character creation sim game with an account abstracted login. It is a homebase for users to customize their avatars, homes, and explore other worlds.

## 📹 [VIEW THE DEMO VIDEO!](https://www.alchemy.com/university/projects/hom3town) 📹

![image](https://github.com/user-attachments/assets/411ca16d-a10f-4871-9f7b-92147f39c2ed)

![image](https://github.com/user-attachments/assets/c5bb9c08-0249-43fc-8295-1e517a47822f)

![image](https://github.com/user-attachments/assets/c91169eb-2dc8-4f33-b9b9-09ba425e91e2)

## 🏆Shapecraft Hackathon Storyweaving Category Winner!🏆

![image](https://github.com/user-attachments/assets/ecd51cc9-02d7-48ce-bc2e-54c9446d18c2)

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"> I won $2,500 in the Storyweaving category!! I&#39;m so glad the judges recognized the vision and appreciated the art of my project.

It wasn&#39;t easy going up against teams of experienced developers, so I appreciate a category that allowed artists to play to our strengths. 🤩🥰🥳❤️‍🔥💪👩‍🎨 </p>&mdash; TalonDragon000 💜 (@talondragon000) <a href="https://twitter.com/talondragon000/status/1877435147361882360?ref_src=twsrc%5Etfw"> January 9, 2025 </a></blockquote>

## About the Project

The project was created for the [2024 ShapeCraft Hackathon.](https://shape.network/shapecraft)

The goal of this project was to implement the following features if time and talent allowed:

- Once the user logs in, their default NFT is automatically minted on the Shape Mainnet
- The NFT has updatable metadata to allow for future avatar asset and trait add-ons
- With the NFT linked to the account, it would also be allowed to transfer to other worlds through the `Avatar.tsx` component
- The dashboard would provide links to other worlds built on this one as its account base with gas-back incentives

The architecture was specifically aimed to create a seamless and simplified WEB3 onboarding experience.
As an artist, I wanted to address infamous WEB3 onboarding issues as I integrated the ShapeCraft Worlds concept.

- Alchemy's Account Kit makes creating a WEB3 account simple and easy.
- Receiving a free Shape Mainnet Default NFT automatically during login allows users to play with token-gated security and no immediate paywalls.
- A dynamic NFT with updatable off-chain metadata and sprite sheets provides a scalable solution for additional assets without re-mints, saving gas.
- A familiar character creator interface for visual customization and metadata refreshes removes the need for third-party redirects.

## Demo Project

Due to time and expertise constraints, this demo project has the following features in place:

- Account Kit login to Shape Mainnet
- Character Creation with multiple asset options
- Foundation for future additions
- Avatar saved to localstorage and linked to the account address for easy transfer to other worlds via metadata.

## Prerequisites

- Node.js 18+
- NPM or Yarn
- React 18+ `npm i react`
- Typescript 5+ `npm i typescript`
- Tailwindcss `npx tailwindcss init -p`
- pin viem to 2.20.0 `(yarn add viem@2.20.0)`
- pin wagmi to 2.12.7 `(yarn add wagmi@2.12.7)`
- [Alchemy Account Kit](https://accountkit.alchemy.com/react/quickstart#existing-project) (for authentication)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/TalonDragon000/Hom3Town-v3.git

# Navigate to the project directory
cd account-kit-app

# Install dependencies
npm install
npm install @account-kit/infra @account-kit/react @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Dependencies

- Next.js 13+ (for server-side rendering)
- React 18+ (for UI)
- Tailwind CSS (for styling)
- AlchemyAccount Kit (for authentication)
- Shape Network and Shape Sepolia (for blockchain)

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
3. Configure Account Kit authentication `ALCHEMY_API_KEY`
4. Configure Pinata API Key `PINATA_API_KEY`

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Features

- Deploy off localhost using Vercel or Heroku
- Username ENS account link
- Auto avatar mint on Shape Main Network during account creation
- Dynamic NFT metadata updates on each confirmation
- Additional worlds to explore with Shape Gas Back incentive
- Shop in an online marketplace
- Create your shop and assets to add to the marketplace
- In-game and On-chain currency
- Import other world NFTs to view in your inventory and equip to your avatar
- Purchase and furnish your home with additional items from other worlds and the marketplace
- Mini-games to earn currency for avatar and home upgrades
- Add an easy-contribution feature for others to build and link their worlds and shops
- And more??

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Account Kit for authentication
- Next.js team for the amazing framework
- Contributors and maintainers