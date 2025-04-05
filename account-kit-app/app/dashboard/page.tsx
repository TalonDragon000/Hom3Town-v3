'use client';
/* eslint-disable react/no-unescaped-entities */
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import "../globals.css";
import Login from "../login/page";
import EditProfileBtn from "../components/EditProfileBtn";
import { UserDataManager } from "../utils/userDataManager";
import { useEffect, useState, useRef } from "react";
import EditAvatar from "../components/EditAvatar";
import { Avatar } from "../components/Avatar";
import MintBtn from "../components/MintBtn";
import ClaimCharacterBtn from "../components/ClaimCharacterBtn";
import MintButton from "../components/MintButton";

export default function Dashboard() {
    const user = useUser();
    const { isConnected } = useSignerStatus();
    const [userData, setUserData] = useState(UserDataManager.getInstance().getUserData());
    const characterRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Dashboard: Component mounted");
        setIsLoading(true);
        
        if (user) {
            console.log("Dashboard: User detected", {
                address: user.address,
                email: user.email
            });
            
            const userDataManager = UserDataManager.getInstance();
            userDataManager.updateFromAccountKit(user)
                .then(data => {
                    console.log("Dashboard: User data updated from AccountKit", {
                        username: data.username,
                        hasAvatar: !!data.avatarConfig,
                        hasMetadata: !!data.avatarMetadata,
                        tokenId: data.tokenId
                    });
                    setUserData(data);
                })
                .catch(err => {
                    console.error("Dashboard: Error updating user data", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            console.log("Dashboard: No user detected");
            setIsLoading(false);
        }
    }, [user]);

    // Determine if user has already minted an NFT
    const hasMintedNFT = userData?.tokenId !== null;
    console.log("Dashboard: User NFT status", { hasMintedNFT, tokenId: userData?.tokenId });

    return (
      <main className="flex flex-col items-center justify-center p-12">
        <div className="text-center">
            <h1 className="text-6xl font-bold mb-10">Welcome Home!</h1>
            <p className="text-xl mb-5">
                Now that you've logged in, you can start exploring the world of Hom3Town!
            </p>
        </div>
        <div className="flex justify-center gap-5">
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2 text-center">Your Home</h3>
            <div className="flex justify-center gap-4 text-center align-center" style={{flexDirection: 'column'}} ref={characterRef}>
              <p>Customize your avatar and home</p>
              <div className="flex justify-center preview-character align-center">
                <Avatar defaultImagePath={"/images/anon.png"} />
              </div>
              <div className="flex justify-center"><EditAvatar /></div>
              <div className="flex justify-center"><MintButton /></div>
            </div>
          </div>
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Your Profile</h3>
            <div className="flex justify-center gap-4">This is where you can view your profile and see your avatar and home.</div>
            <div className="justify-center grid grid-cols-1 gap-4 mt-4 min-w-96">
              <p><b>Username:</b> {userData.username}</p>
              <p><b>Email:</b> {user?.email || 'Not Connected'}</p>
              <p><b>Account ID:</b> {user?.address || 'Not Connected'}</p>
              <p><b>Avatar CID:</b> {userData.avatarMetadata?.cid || 'Not Connected'}</p>
              <p><b>Last Updated:</b> {new Date(userData.lastUpdated).toLocaleString()}</p>
            </div>
            <div className="flex gap-4 mt-4"><EditProfileBtn /></div>
          </div>
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2 text-center">Coming Soon</h3>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">View your Inventory</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Purchase a House</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Visit the Marketplace</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Explore Worlds</button></div>
            </div>
        </div>
      </main>
    );
  }