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
    <footer>
      <div className="justify-items-center w-full mt-5 mb-2 grid grid-cols-3 gap-4 items-center">
        <button className="footer-btn" onClick={openShape}>
          Shape
        </button>
        <button className="footer-btn" onClick={openAlchemy}>
          Powered by Alchemy
        </button>
        <button className="footer-btn" onClick={openGitHub}>
          Github
        </button>
      <div className="text-center col-span-3">&copy; 2025 Hom3Town. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default FooterButtons;