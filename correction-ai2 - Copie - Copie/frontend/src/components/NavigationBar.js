import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaGoogle, FaFacebook } from 'react-icons/fa';
import '../NavigationBar.css';

const NavigationBar = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="correcto-nav">
            <div className="nav-header">
                <h1>CorrectoAI</h1>
            </div>
            <ul className="nav-links">
                <li><Link to="/translate">Traduction</Link></li>
                <li><Link to="/rewrite">Reformulation</Link></li>
                <li><Link to="/correct">Correction</Link></li>
            </ul>
            <div className="user-menu-container">
                <button 
                    className="user-icon-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <FaUserCircle className="user-icon" />
                </button>
                {showUserMenu && (
                    <div className="user-dropdown">
                        <button className="dropdown-item">
                            <span>S'inscrire</span>
                        </button>
                        <button className="dropdown-item">
                            <FaGoogle className="social-icon" />
                            <span>Se connecter avec Google</span>
                        </button>
                        <button className="dropdown-item">
                            <FaFacebook className="social-icon" />
                            <span>Se connecter avec Facebook</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;