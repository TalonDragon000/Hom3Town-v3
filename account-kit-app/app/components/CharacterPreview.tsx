"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Category, LAYER_ORDER, isMultiSelectCategory } from '../utils/characterData';
import { getBackgroundStyle } from '../utils/spriteUtils';
import html2canvas from 'html2canvas';
import {PinataSDK} from 'pinata';

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
    showError,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
    // Debug log for selectedFrames
    useEffect(() => {
        console.log("Selected Frames:", selectedFrames);
    }, [selectedFrames]);

    const hasAnySelection = selectedFrames.body !== null;
    console.log("Has Any Selection:", hasAnySelection); // Debug log

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

  // const exportCharacter = () => {
  //     if (previewRef.current) {
  //         const characterElement = previewRef.current.querySelector('.preview-character');
  //         if (characterElement) {
  //             html2canvas(characterElement).then(canvas => {
  //                 const link = document.createElement('a');
  //                 link.href = canvas.toDataURL('image/png');
  //                 link.download = 'character.png';
  //                 link.click();
  //             });
  //         }
  //     }
  // };

  const exportCharacter = async () => {
    if (previewRef.current) {
      const characterElement = previewRef.current.querySelector(
        ".preview-character"
      ) as HTMLElement;
      if (characterElement) {
        try {
          // First create the canvas
          const canvas = await html2canvas(characterElement);

          // Download locally
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "character.png";
          link.click();

          // Check if we have the Pinata JWT
          const pinataJWT = process.env.PINATA_ADMIN_API_KEY;
          if (!pinataJWT) {
            throw new Error("Pinata JWT is not configured");
          }

          // Validate JWT format (should have 3 parts separated by dots)
          const jwtParts = pinataJWT.split(".");
          if (jwtParts.length !== 3) {
            throw new Error("Invalid JWT format - should have 3 segments");
          }

          console.log("JWT validation:", {
            length: pinataJWT.length,
            segments: jwtParts.length,
            firstChars: pinataJWT.substring(0, 10) + "...",
          });

          // Initialize Pinata with proper JWT
          const pinata = new PinataSDK({
            pinataJwt: pinataJWT,
            pinataGateway: process.env.PINATA_GATEWAY_API_KEY,
          });

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to create blob"));
            }, "image/png");
          });

          const file = new File([blob], "character.png", { type: "image/png" });

          // Upload to Pinata
          const result = await pinata.upload.file(file, {
            metadata: {
              name: "character.png",
              keyvalues: {
                timestamp: new Date().toISOString(),
                type: "character-preview",
              },
            },
          });

          console.log("Successfully uploaded to IPFS:", result);
          alert("Character successfully exported and uploaded to IPFS!");
        } catch (error) {
          console.error("Error during export/upload:", error);

          // More specific error messages
          if (error instanceof Error) {
            if (error.message.includes("INVALID_CREDENTIALS")) {
              alert(
                "Failed to authenticate with Pinata. Please check your JWT configuration."
              );
            } else if (error.message === "Pinata JWT is not configured") {
              alert(
                "Pinata JWT is not configured. Please check your environment variables."
              );
            } else {
              alert(`Error: ${error.message}`);
            }
          } else {
            alert("An unexpected error occurred during export/upload.");
          }
        }
      }
    }
  };

    return (
        <div className="preview-container" ref={previewRef}>
            <div className="text-center text-2xl mb-4">
                <h3>Preview Character</h3></div>

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
                    LAYER_ORDER.map((layer) => {
                        console.log(`Processing layer: ${layer}`); // Debug log
                        return renderLayer(layer);
                    })
                )}
            </div>
            <div className="text-center mt-4">
                <button className="action-btn" onClick={onClear}>CLEAR</button>
                <button className="action-btn" onClick={exportCharacter}>EXPORT</button>
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