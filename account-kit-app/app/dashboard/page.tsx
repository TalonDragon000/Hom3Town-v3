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
import { useEffect, useState } from "react";
import EditAvatar from "../components/EditAvatar";
import { Avatar } from "../components/Avatar";

export default function Dashboard() {
    const user = useUser();
    const [userData, setUserData] = useState(UserDataManager.getInstance().getUserData());

    useEffect(() => {
        if (user) {
            const userDataManager = UserDataManager.getInstance();
            const updatedData = userDataManager.updateFromAccountKit(user);
            setUserData(updatedData);
        }
    }, [user]);

    return (
      <main className="page-container">

<nav className="nav-bar fixed top-0 inline-flex">
        <div className="nav-item-left font-bold"><a href="/">Hom3Town</a></div>
        <div className="nav-item-right mt-2">
            <Avatar 
              defaultImagePath={"/images/annon.png"} 
              size="small"
            />
        </div>
        <div><Login /></div>
      </nav>

        <div className="content-container">
          <h1 className="title-large">Welcome Home!</h1>
          <p className="subtitle">
            Now that you've logged in, you can start exploring the world of Hom3Town!
          </p>

          <div className="dashboard-grid">
            {/* Avatar Card */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Your Home</h3>
              <div className="flex flex-col items-center gap-4">
                <Avatar defaultImagePath={"/images/annon.png"} />
                <EditAvatar />
              </div>
            </div>

            {/* Profile Card */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Your Profile</h3>
              <div className="flex flex-col gap-3">
                <p><b>Username:</b> {userData.username}</p>
                <p><b>Email:</b> {user?.email || 'Not Connected'}</p>
                <p><b>Account#:</b> {user?.address || 'Not Connected'}</p>
                {user && (
                  <p><b>Last Updated:</b> {new Date(userData.lastUpdated).toLocaleString()}</p>
                )}
                <EditProfileBtn />
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Coming Soon</h3>
              <div className="flex flex-col gap-3">
                <button className="btn-disabled">View your Inventory</button>
                <button className="btn-disabled">Purchase a House</button>
                <button className="btn-disabled">Visit the Marketplace</button>
                <button className="btn-disabled">Explore Worlds</button>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <div>&copy; 2024 Hom3Town. All rights reserved.</div>
        </footer>
      </main>
    );
}
