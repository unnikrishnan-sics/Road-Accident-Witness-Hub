import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Row, Col, ConfigProvider } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    CarOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ClockCircleOutlined,
    AlertOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const PoliceDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const navigate = useNavigate();

    // User is guaranteed to be police here (handled by Login/Route)
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'police', email: 'Officer' };
    const displayRole = 'Police Officer';

    // Force Blue Background for Police Dashboard
    React.useEffect(() => {
        const originalBackground = document.body.style.background;
        document.body.style.background = 'linear-gradient(135deg, #001529 0%, #003a8c 100%)'; // Deep Blue

        return () => {
            // Restore original (Red) on unmount
            document.body.style.background = originalBackground || '';
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const userItems = [
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
    };

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return (
                    <div className="glass-panel">
                        <Title level={4} style={{ marginBottom: '20px' }}>Field Overview</Title>
                        <p style={{ fontSize: '16px', marginBottom: '30px' }}>Active Units & Assignments</p>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center', borderColor: 'rgba(24, 144, 255, 0.5)', background: 'rgba(24, 144, 255, 0.05)' }}>
                                    <AlertOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>8</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>My Assignments</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center', borderColor: 'rgba(250, 173, 20, 0.5)', background: 'rgba(250, 173, 20, 0.05)' }}>
                                    <ClockCircleOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>15</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Pending updates</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center', borderColor: 'rgba(82, 196, 26, 0.5)', background: 'rgba(82, 196, 26, 0.05)' }}>
                                    <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>3</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Resolved Today</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center', borderColor: 'rgba(24, 144, 255, 0.5)', background: 'rgba(24, 144, 255, 0.05)' }}>
                                    <CarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>On Patrol</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Status</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            case '2':
                return (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '100px 20px' }}>
                        <FileTextOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
                        <Title level={2}>My Assignments</Title>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>Manage your assigned accident reports.</p>
                        <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(24, 144, 255, 0.1)', display: 'inline-block', borderRadius: '8px', color: '#1890ff', fontWeight: 'bold' }}>
                            COMING SOON
                        </div>
                    </div>
                );
            case '3':
                return (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '100px 20px' }}>
                        <CarOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
                        <Title level={2}>Vehicle Lookup</Title>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>Search vehicle history.</p>
                        <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(24, 144, 255, 0.1)', display: 'inline-block', borderRadius: '8px', color: '#1890ff', fontWeight: 'bold' }}>
                            COMING SOON
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
            <div className="police-theme">
                <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                    <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} style={{ background: 'rgba(0,10,20,0.6)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(24, 144, 255, 0.1)' }}>
                        <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {collapsed ? 'Hub' : <span style={{ color: '#1890ff' }}>Police Hub</span>}
                        </div>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            selectedKeys={[selectedKey]}
                            onClick={handleMenuClick}
                            style={{ background: 'transparent' }}
                            items={[
                                {
                                    key: '1',
                                    icon: <DashboardOutlined />,
                                    label: 'Dashboard',
                                },
                                {
                                    key: '2',
                                    icon: <FileTextOutlined />,
                                    label: 'Assignments',
                                },
                                {
                                    key: '3',
                                    icon: <CarOutlined />,
                                    label: 'Vehicle Lookup',
                                },
                            ]}
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
                                    <span style={{ fontWeight: 500, color: '#fff' }}>{displayRole}</span>
                                </div>
                            </Dropdown>
                        </Header>
                        <Content
                            className="site-layout-background"
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: 'transparent',
                            }}
                        >
                            {renderContent()}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </ConfigProvider>
    );
};

export default PoliceDashboard;
