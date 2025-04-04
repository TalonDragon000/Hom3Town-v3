"use client";

import React from 'react';

const FooterButtons: React.FC = () => {
  const openGitHub = () => {
    window.open('https://github.com/TalonDragon000/Hom3Town-v3', '_blank');
  };

  const openAlchemy = () => {
    window.open('https://www.alchemy.com/', '_blank');
  };

  const openShape = () => {
    window.open('https://shape.network/', '_blank');
  };

  return (
    <footer className="flex flex-col items-center p-4 bg-gray-100 border-t border-gray-300">
      
      <div className="flex justify-around w-full mt-5 mb-2">
        <button className="px-2 py-1 text-sm btn" onClick={openShape}>
          Shape
        </button>
        <button className="px-2 py-1 text-sm btn" onClick={openAlchemy}>
          Powered by Alchemy
        </button>
        <button className="px-2 py-1 text-sm btn" onClick={openGitHub}>
          Github
        </button>
      </div>
      <div className="text-black mb-2 mt-2">&copy; 2024 Hom3Town. All rights reserved.</div>
    </footer>
  );
};

export default FooterButtons;