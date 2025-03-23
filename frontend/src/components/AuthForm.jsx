// frontend/src/components/AuthForm.jsx
import React, { useState } from 'react';
import api from '../axiosConfig';
import GoogleLoginButton from './GoogleLoginButton';

const AuthForm = ({ setToken, setUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
      } else {
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }
        const res = await api.post('/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.status === 201) {
          setIsLogin(true);
          setFullName('');
          setEmail('');
          setPassword('');
          setProfilePicture(null);
          // Show success message
          setError('Inscription réussie, connectez-vous !');
        }
      }
    } catch (err) {
      console.error('Erreur:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form max-w-md mx-auto mt-8 bg-base-100 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Connexion' : 'Inscription'}</h2>
      
      {error && (
        <div className={`alert ${error.includes('réussie') ? 'alert-success' : 'alert-error'} mb-4`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nom complet</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              className="input input-bordered w-full"
            />
          </div>
        )}
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input input-bordered w-full"
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mot de passe</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {!isLogin && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Photo de profil</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>
      
      <div className="divider">OU</div>
      
      <GoogleLoginButton />
      
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
        }}
        className="btn btn-ghost mt-4 w-full"
      >
        {isLogin ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
      </button>
    </div>
  );
};

export default AuthForm;