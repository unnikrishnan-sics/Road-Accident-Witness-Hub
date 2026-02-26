import React from 'react';
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-navbar" style={{
            padding: '20px 60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            background: 'rgba(10, 10, 10, 0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#f5222d',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 0 20px rgba(245, 34, 45, 0.3)'
                    }}>
                        🚨
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
                        Witness<span style={{ color: '#f5222d' }}>Hub</span>
                    </span>
                </div>
            </Link>

            <div className="nav-links" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                {[
                    { name: 'Home', path: '/' },
                    // { name: 'Safety Map', path: '/safety-map' },
                    { name: 'About', path: '/about' },
                    { name: 'Contact', path: '/contact' },
                ].map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="nav-link"
                        style={{
                            textDecoration: 'none',
                            position: 'relative',
                            color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.6)',
                            fontWeight: isActive(link.path) ? '700' : '400',
                            transition: 'all 0.3s'
                        }}
                    >
                        {link.name}
                        {isActive(link.path) && (
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                left: '0',
                                width: '100%',
                                height: '2px',
                                background: '#f5222d',
                                borderRadius: '2px',
                                boxShadow: '0 0 10px rgba(245, 34, 45, 0.5)'
                            }} />
                        )}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/report">
                    <Button type="text" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                        Report Incident
                    </Button>
                </Link>
                {localStorage.getItem('token') ? (
                    <Link to="/reporter/dashboard">
                        <Button type="primary" shape="round" style={{ fontWeight: '700', padding: '0 25px', height: '44px' }}>Dashboard</Button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <Button type="primary" shape="round" style={{ fontWeight: '700', padding: '0 25px', height: '44px' }}>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
