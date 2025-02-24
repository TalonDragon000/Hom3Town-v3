"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";

export default function AuthButton() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  return (
    <>
      {signerStatus.isInitializing ? (
        <>Loading...</>
      ) : user ? (
        <div className="flex gap-4 items-center">
          <span>{(user.address ?? "anon").slice(0, 6)}...</span>
          <button className="btn" onClick={() => logout()}>
            Log out
          </button>
        </div>
      ) : (
        <button className="btn" onClick={openAuthModal}>
          Login
        </button>
      )}
    </>
  );
} 