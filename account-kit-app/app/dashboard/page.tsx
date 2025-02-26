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
import ExportCharacterBtn from "../components/ExportCharacterBtn";

export default function Dashboard() {
    const user = useUser();
    const [userData, setUserData] = useState(UserDataManager.getInstance().getUserData());
    const characterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            const userDataManager = UserDataManager.getInstance();
            const updatedData = userDataManager.updateFromAccountKit(user);
            updatedData.then(data => setUserData(data));
        }
    }, [user]);

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-12">
        <nav className="nav-bar navbar-bg fixed top-0 inline-flex items-center">
          <div className="nav-item-left font-bold"><a href="/">Hom3Town</a></div>
          <div className="nav-item-right flex items-center justify-center p-1">
            <Avatar 
              defaultImagePath={"/images/annon.png"} 
              size="small"
              className="rounded"
            />
          </div>
          <div className="nav-login"><Login /></div>
        </nav>
        <div className="text-center">
            <h1 className="text-6xl font-bold mb-10">Welcome Home!</h1>
            <p className="text-xl mb-5">
                Now that you've logged in, you can start exploring the world of Hom3Town!
            </p>
        </div>
        <div className="flex justify-center gap-10">
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Your Home</h3>
            <div className="flex justify-center gap-4" style={{flexDirection: 'column'}} ref={characterRef}>
              <p>Customize your avatar and home</p>
              <div className="flex justify-center preview-character">
                <Avatar defaultImagePath={"/images/annon.png"} />
              </div>
              <div className="flex justify-center"><EditAvatar /></div>
              <div className="flex justify-center"><ExportCharacterBtn characterRef={characterRef} /></div>
            </div>
          </div>
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Your Profile</h3>
            <div className="flex justify-center gap-4">This is where you can view your profile and see your avatar and home.</div>
            <div className="justify-center grid grid-cols-1 gap-4 mt-4">
              <p><b>Username:</b> {userData.username}</p>
              <p><b>Email:</b> {user?.email || 'Not Connected'}</p>
              <p><b>Account ID:</b> {user?.address || 'Not Connected'}</p>
              <p><b>Avatar CID:</b> {userData.avatarMetadata?.cid || 'Not Connected'}</p>
              <p><b>Last Updated:</b> {new Date(userData.lastUpdated).toLocaleString()}</p>
            </div>
            <div className="flex gap-4 mt-4"><EditProfileBtn /></div>
          </div>
          <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">View your Inventory</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Purchase a House</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Visit the Marketplace</button></div>
              <div className="flex justify-center gap-4 mt-4"><button className="btn-disabled">Explore Worlds</button></div>
            </div>
        </div>
        <footer className="fixed bottom-0 left-0 right-0">
          <div>&copy; 2024 Hom3Town. All rights reserved.</div>
        </footer>
      </main>
    );
  }