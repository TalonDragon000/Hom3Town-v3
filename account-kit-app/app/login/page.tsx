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
        <div className="flex gap-4 items-center align-center">
          <span>{(user.address ?? "anon").slice(0, 6)}...</span>
          <button onClick={() => logout()}>
            LOGOUT
          </button>
        </div>
      ) : (
        <button onClick={openAuthModal}>
          LOGIN
        </button>
      )}
    </>
  );
} 