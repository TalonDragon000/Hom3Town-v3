'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import { PinataSDK } from 'pinata';
import { UserDataManager } from '../utils/userDataManager';

interface ExportCharacterProps {
  characterRef: React.RefObject<HTMLDivElement>;
}

const ExportCharacter: React.FC<ExportCharacterProps> = ({ characterRef }) => {
  const exportCharacter = async () => {
    if (!characterRef.current) {
      console.error('Character element not found');
      return;
    }

    const characterElement = characterRef.current.querySelector(
      ".preview-character"
    ) as HTMLElement;

    if (!characterElement) {
      console.error('Preview character element not found');
      return;
    }

    try {
      // Create the canvas
      const canvas = await html2canvas(characterElement);

      // Download locally
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "character.png";
      link.click();

      // Check if we have the Pinata JWT
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (!pinataJWT) {
        throw new Error("Pinata JWT is not configured");
      }

     /* // Validate JWT format
      const jwtParts = pinataJWT.split(".");
      if (jwtParts.length !== 3) {
        throw new Error("Invalid JWT format - should have 3 segments");
      }

      console.log("JWT validation:", {
        length: pinataJWT.length,
        segments: jwtParts.length,
        firstChars: pinataJWT.substring(0, 10) + "...",
      });
      */

      // Initialize Pinata
      const pinata = new PinataSDK({
        pinataJwt: pinataJWT,
        pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        }, "image/png");
      });

      const file = new File([blob], "Hom3TownAvatar.png", { type: "image/png" });

      // Upload to Pinata
      const result = await pinata.upload.file(file, {
        metadata: {
          name: "Hom3TownAvatar.png",
          keyvalues: {
            timestamp: new Date().toISOString(),
            type: "Hom3Town Avatar",
          },
        },
      });

      // Store the Pinata metadata in UserDataManager
      const userDataManager = UserDataManager.getInstance();
      await userDataManager.saveUserData({
        avatarMetadata: {
          cid: result.cid,
          pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.cid}`,
          timestamp: new Date().toISOString(),
        }
      });

      console.log("Successfully uploaded to IPFS:", result);
      alert("Character successfully exported and uploaded to IPFS!");
    } catch (error) {
      console.error("Error during export/upload:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unexpected error occurred during export/upload.");
      }
    }
  };

  return (
    <button className="btn text-xl m-auto" onClick={exportCharacter}>
      Export .PNG
    </button>
  );
};

export default ExportCharacter;
