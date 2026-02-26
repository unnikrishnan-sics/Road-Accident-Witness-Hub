import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, App } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

import { formatDisplayName } from '../utils/userUtils';

const { Header, Sider, Content } = Layout;

const ReporterLayout = ({ children }) => {
    const { modal } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user')) || { email: 'Reporter' };

    const handleLogout = () => {
        modal.confirm({
            title: 'Logout Confirmation',
            content: 'Are you sure you want to logout?',
            okText: 'Yes, Logout',
            cancelText: 'Cancel',
            okButtonProps: { danger: true },
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            },
        });
    };

    const userItems = [
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    const menuItems = [
        {
            key: '/reporter/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/reporter/my-reports',
            icon: <FileTextOutlined />,
            label: 'My Reports',
        },
        {
            key: '/reporter/profile',
            icon: <UserOutlined />,
            label: 'My Profile',
        },
    ];

    // Determine selected key based on path (or partial path)
    const getSelectedKey = () => {
        if (location.pathname === '/reporter/dashboard') return '/reporter/dashboard';
        if (location.pathname === '/report') return '/reporter/dashboard'; // Treat report as part of dashboard
        return location.pathname;
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250} theme="dark" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {collapsed ? 'Hub' : 'Witness Hub'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    onClick={(e) => navigate(e.key)}
                    style={{ background: 'transparent' }}
                    items={menuItems}
                />
            </Sider>
            <Layout className="site-layout" style={{ background: 'transparent' }}>
                <Header style={{ padding: '0 24px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '20px', cursor: 'pointer', color: '#fff' }
                    })}
                    <Dropdown menu={{ items: userItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <span style={{ fontWeight: 500, color: '#fff' }}>{formatDisplayName(user)}</span>
                        </div>
                    </Dropdown>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReporterLayout;
