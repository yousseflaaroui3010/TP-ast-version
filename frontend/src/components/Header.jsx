// frontend/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { FaTasks, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from '../axiosConfig';

const Header = ({ onLogout, user }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const availableThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", 
    "garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
    "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
    "business", "acid", "lemonade", "night", "coffee", "winter",
  ];

  // Update document theme when theme state changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch active tasks when user is available
  useEffect(() => {
    const fetchActiveTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const res = await api.get('/tasks');
        // Filter for incomplete tasks only
        const incompleteTasks = res.data.filter(task => !task.completed);
        setActiveTasks(incompleteTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTasks();
  }, [user]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Change to a specific theme
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsSidebarOpen(false); // Close sidebar after selection
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigate to settings page
  const goToSettings = () => {
    navigate('/settings');
  };

  // Navigate to home/board
  const goToHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="navbar bg-base-100 shadow-lg fixed top-0 w-full z-20 h-16">
        <div className="navbar-start">
          <button onClick={toggleSidebar} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <button onClick={goToHome} className="btn btn-ghost text-xl cursor-pointer">
            To-Do App
          </button>
        </div>
        
        <div className="navbar-end gap-2">
          {/* Tasks Indicator - Only show for logged in users */}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <FaTasks className="h-5 w-5" />
                  <span className="badge badge-sm indicator-item">
                    {loading ? '...' : activeTasks.length}
                  </span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">{activeTasks.length} Tâches</span>
                  <span className="text-info">En cours</span>
                  <div className="card-actions">
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={goToHome}
                    >
                      Voir toutes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={
              theme === "light"
                ? "Passer au thème sombre"
                : "Passer au thème clair"
            }
          >
            {theme === "light" ? (
              <FaMoon className="h-5 w-5" />
            ) : (
              <FaSun className="h-5 w-5" />
            )}
          </button>
          
          {/* User Profile Dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full overflow-hidden">
                  <img
                    alt="Profil utilisateur"
                    src={
                      user.profilePicture
                        ? user.profilePicture.startsWith('http') 
                          ? user.profilePicture 
                          : `http://localhost:3001${user.profilePicture}`
                        : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-72 p-4 shadow"
              >
                <li className="text-center mb-4">
                  <span className="text-lg font-bold">COMPTE</span>
                </li>
                <li>
                  <div className="flex items-center gap-4">
                    <div className="w-16 rounded-full overflow-hidden">
                      <img
                        alt="Profil utilisateur"
                        src={
                          user.profilePicture
                            ? user.profilePicture.startsWith('http') 
                              ? user.profilePicture 
                              : `http://localhost:3001${user.profilePicture}`
                            : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {user.fullName || user.email.split("@")[0]}
                      </p>
                      <p className="text-sm text-base-content/70">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </li>
                <div className="divider my-2"></div>
                <li>
                  <button onClick={goToSettings} className="flex items-center w-full text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Paramètres
                  </button>
                </li>
                <li>
                  <button onClick={onLogout} className="flex items-center w-full text-left text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Theme Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-base-200 z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } pt-4`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Thèmes</h2>
            <button 
              onClick={toggleSidebar}
              className="btn btn-sm btn-ghost"
            >
              ×
            </button>
          </div>
          
          <div className="divider mb-4"></div>
          
          <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
            <ul className="menu bg-base-200 w-full rounded-box">
              {availableThemes.map((themeName) => (
                <li key={themeName}>
                  <a
                    onClick={() => handleThemeChange(themeName)}
                    className={theme === themeName ? "active font-bold" : ""}
                  >
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay for closing sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Header;