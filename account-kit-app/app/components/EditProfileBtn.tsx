'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfileBtn() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  // Add validation check
  const isValidUsername = username.trim().length >= 3; // Requires at least 3 characters

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUsername) return;
    
    // TODO: Add API call to update username
    console.log('Update username to:', username);
    setIsModalOpen(false);
    setUsername('');
  };

  return (
    <>
      <button 
        className="btn btn-hover text-xl mt-6"
        onClick={() => setIsModalOpen(true)}
      >
        Edit Profile
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white light-bg rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Profile (Coming Soon)</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg light-bg"
                  placeholder="Annon"
                  minLength={3}
                  required
                />
                {username && !isValidUsername && (
                  <p className="text-red-500 text-sm mt-1">
                    Username must be at least 3 characters long
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isValidUsername}
                  style={{ opacity: isValidUsername ? 1 : 0.5 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}