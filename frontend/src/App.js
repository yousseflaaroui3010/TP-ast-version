// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import api from './axiosConfig';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Board from './components/Board';
import AuthSuccess from './components/AuthSuccess';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userRes = await api.get('/auth/me');
          setUser(userRes.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setToken('');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUserData();
  }, [token]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-body-bg">
        <Header onLogout={logout} user={user} />
        <main className="flex-grow pt-16 container mx-auto px-4">
          <Routes>
            <Route 
              path="/auth-success" 
              element={<AuthSuccess />} 
            />
            <Route 
              path="/" 
              element={
                token ? <Board /> : <AuthForm setToken={setToken} setUser={setUser} />
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