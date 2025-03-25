// frontend/src/components/UserSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const UserSettings = ({ user, setUser, onLogout }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      
      // Set profile picture preview
      if (user.profilePicture) {
        const imgSrc = user.profilePicture.startsWith('http') 
          ? user.profilePicture 
          : `http://localhost:3001${user.profilePicture}`;
        setProfilePicturePreview(imgSrc);
      }
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('fullName', fullName);
    
    // Only append profile picture if a new one is selected
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const res = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUser(res.data);
      setMessage({ text: 'Profil mis à jour avec succès!', type: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la mise à jour du profil', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ text: 'Mot de passe mis à jour avec succès!', type: 'success' });
    } catch (err) {
      console.error('Error updating password:', err);
      setMessage({ 
        text: err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.')) {
      try {
        await api.delete('/auth/account');
        onLogout(); // Log out the user
        navigate('/'); // Redirect to home page
      } catch (err) {
        console.error('Error deleting account:', err);
        setMessage({ 
          text: err.response?.data?.message || 'Erreur lors de la suppression du compte', 
          type: 'error' 
        });
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres du compte</h1>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar/Profile Summary */}
        <div className="md:col-span-1">
          <div className="bg-base-200 rounded-lg p-6 sticky top-20">
            <div className="flex flex-col items-center">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={profilePicturePreview || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                    alt="Profile" 
                    onError={(e) => {
                      e.target.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                    }}
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold">{fullName || email.split('@')[0]}</h2>
              <p className="text-sm opacity-70">{email}</p>
              
              <div className="divider"></div>
              
              <ul className="menu menu-vertical w-full">
                <li><a className="active">Profil</a></li>
                <li><a>Sécurité</a></li>
                <li><a>Notifications</a></li>
              </ul>
              
              <button 
                onClick={handleDeleteAccount}
                className="btn btn-error btn-outline w-full mt-4"
              >
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Information */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Informations de profil</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nom complet</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered" 
                  value={email}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">L'email ne peut pas être modifié</span>
                </label>
              </div>
              
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Photo de profil</span>
                </label>
                <input 
                  type="file" 
                  className="file-input file-input-bordered" 
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                <label className="label">
                  <span className="label-text-alt">Formats acceptés: JPG, PNG (max 5MB)</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                Mettre à jour le profil
              </button>
            </form>
          </div>
          
          {/* Password Change */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mot de passe actuel</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nouveau mot de passe</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Confirmer le nouveau mot de passe</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                Changer le mot de passe
              </button>
            </form>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Paramètres de notification</h2>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Recevoir des notifications par email</span> 
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
              </label>
            </div>
            
            <button 
              className="btn btn-primary mt-4"
              onClick={() => setMessage({ text: 'Paramètres de notification enregistrés', type: 'success' })}
            >
              Enregistrer les préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;