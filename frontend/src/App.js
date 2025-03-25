// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import api from './axiosConfig';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Board from './components/Board';
import AuthSuccess from './components/AuthSuccess';
import UserSettings from './components/UserSettings';
import './App.css';

// Create a protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          setLoading(true);
          const userRes = await api.get('/auth/me');
          setUser(userRes.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setToken('');
          localStorage.removeItem('token');
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-body-bg">
        <Header onLogout={logout} user={user} tasks={[]} />
        <main className="flex-grow pt-16 container mx-auto px-4">
          <Routes>
            <Route 
              path="/auth-success" 
              element={<AuthSuccess setToken={setToken} setUser={setUser} />} 
            />
            <Route 
              path="/" 
              element={
                token ? 
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute> : 
                <AuthForm setToken={setToken} setUser={setUser} />
              } 
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <UserSettings user={user} setUser={setUser} onLogout={logout} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;