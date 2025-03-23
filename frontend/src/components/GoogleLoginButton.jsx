// frontend/src/components/GoogleLoginButton.jsx
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to the backend Google auth route
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline w-full flex items-center justify-center gap-2 mt-4"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 3C16.96 3 21 7.04 21 12C21 16.96 16.96 21 12 21C7.04 21 3 16.96 3 12C3 7.04 7.04 3 12 3ZM13.15 7.63C12.28 7.63 11.52 7.91 10.91 8.46C10.3 9.01 9.94 9.72 9.81 10.57H8.45V11.83H9.81V14.32H8.45V15.56H9.81V17.94H11.08V15.56H13.52V14.32H11.08V11.83H13.52V10.57H11.08C11.18 9.94 11.45 9.45 11.9 9.08C12.35 8.71 12.9 8.52 13.55 8.52C14 8.52 14.35 8.61 14.59 8.78C14.84 8.95 15.04 9.15 15.21 9.38C15.39 9.61 15.53 9.85 15.65 10.09C15.77 10.33 15.86 10.53 15.91 10.7L15.99 10.96L17.19 10.47L17.1 10.16C17.05 9.98 16.96 9.73 16.82 9.43C16.68 9.13 16.49 8.84 16.25 8.55C16.01 8.26 15.71 8.02 15.36 7.83C15.02 7.7 14.55 7.63 13.95 7.63H13.15ZM7.56 7.85V9.13H8.44C8.07 8.95 7.74 8.45 7.56 7.85Z"
          fill="#4285F4"
        />
      </svg>
      Se connecter avec Google
    </button>
  );
};

export default GoogleLoginButton;