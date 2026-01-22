import React from 'react';
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-navbar" style={{
            padding: '15px 50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '28px' }}>🚨</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.5px' }}>
                        Witness<span style={{ color: '#f5222d' }}>Hub</span>
                    </span>
                </div>
            </Link>
            <div className="nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                    Home
                </Link>
                <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                    About
                </Link>
                <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                    Contact
                </Link>
                <Link to="/login">
                    <Button type="primary" shape="round" size="large" style={{ fontWeight: 'bold', padding: '0 30px' }}>Login</Button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
