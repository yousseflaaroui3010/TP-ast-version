// frontend/src/components/AuthSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../axiosConfig';

const AuthSuccess = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get token from URL params
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Token non trouvé dans l\'URL');
          return;
        }
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Get user info
        const res = await api.get('/auth/me');
        
        // Redirect to the main app
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (err) {
        console.error('Erreur lors de l\'authentification:', err);
        setError('Échec de l\'authentification. Veuillez réessayer.');
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleAuthSuccess();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-center bg-base-200 p-8 rounded-lg shadow-lg max-w-md w-full">
        {error ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-error">Erreur</h2>
            <p className="mb-4">{error}</p>
            <p>Redirection vers la page de connexion...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-success">Connexion réussie</h2>
            <p className="mb-4">Vous êtes maintenant connecté!</p>
            <p>Redirection en cours...</p>
            <div className="mt-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess;