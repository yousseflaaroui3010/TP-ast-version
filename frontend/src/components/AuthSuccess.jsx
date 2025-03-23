// frontend/src/components/AuthSuccess.jsx
import React, { useEffect } from 'react';

const AuthSuccess = () => {
  useEffect(() => {
    // Get token from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Redirect to the main app
      window.location.href = '/';
    } else {
      // If no token, redirect to login
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Connexion réussie</h2>
        <p>Redirection en cours...</p>
        <div className="mt-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;