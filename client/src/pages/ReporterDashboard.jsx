import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Row, Col, Table, Tag, Card, Statistic, Button, Typography, Avatar, App } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    LogoutOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SafetyCertificateOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AccidentMap from '../components/AccidentMap';
import { io } from 'socket.io-client';

const { Title, Text } = Typography;

const ReporterDashboard = () => {
    const { message } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [reports, setReports] = useState([]);
    const [policePatrols, setPolicePatrols] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get user from local storage
    const user = JSON.parse(localStorage.getItem('user')) || { email: 'Reporter' };

    useEffect(() => {
        fetchMyReports();

        // Socket for live patrols
        const socket = io('http://localhost:5001');
        socket.on('patrol_update', (patrols) => {
            setPolicePatrols(patrols);
        });

        return () => socket.disconnect();
    }, []);

    const fetchMyReports = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/reports/my-reports');
            if (res.data.success) {
                setReports(res.data.data);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch your reports');
        } finally {
            setLoading(false);
        }
    };

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

    // Table Columns for Reports
    const columns = [
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => <span style={{ color: 'rgba(255,255,255,0.9)' }}>{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => <span style={{ color: 'rgba(255,255,255,0.9)' }}>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                let bgColor = '#e0e0e0';
                if (text === 'Verified') bgColor = '#b7eb8f'; // Light Green
                if (text === 'False') bgColor = '#ffa39e'; // Light Red
                if (text === 'Pending') bgColor = '#ffd591'; // Light Orange

                return (
                    <Tag style={{
                        color: 'black',
                        backgroundColor: bgColor,
                        border: 'none',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        {text || 'UNKNOWN'}
                    </Tag>
                );
            },
        },
        {
            title: 'Police Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    {record.status === 'Verified' ? (
                        <Tag icon={<CheckCircleOutlined style={{ color: 'black' }} />} style={{ color: 'black', backgroundColor: '#b7eb8f', border: 'none', padding: '4px 12px', fontWeight: '500' }}>Action Taken</Tag>
                    ) : record.status === 'False' ? (
                        <Tag style={{ color: 'black', backgroundColor: '#ffa39e', border: 'none', padding: '4px 12px', fontWeight: '500' }}>Rejected</Tag>
                    ) : (
                        <Tag icon={<ClockCircleOutlined style={{ color: 'black' }} />} style={{ color: 'black', backgroundColor: '#91d5ff', border: 'none', padding: '4px 12px', fontWeight: '500' }}>In Review</Tag>
                    )}
                </span>
            ),
        }
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                // Dashboard Overview
                return (
                    <div className="glass-panel">
                        <Title level={3}>Welcome back!</Title>
                        <Text type="secondary" style={{ color: 'rgba(255,255,255,0.7)' }}>Here is what's happening with your reported incidents.</Text>

                        <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
                            <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card">
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Total Reports</span>}
                                        value={reports.length}
                                        prefix={<FileTextOutlined />}
                                        styles={{ content: { color: '#fff' } }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card">
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Verified & Acted Upon</span>}
                                        value={reports.filter(r => r.status === 'Verified').length}
                                        prefix={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
                                        styles={{ content: { color: '#52c41a' } }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card">
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Pending Review</span>}
                                        value={reports.filter(r => r.status === 'Pending').length}
                                        prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                                        styles={{ content: { color: '#faad14' } }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <Title level={4}>Recent Activity</Title>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Button.Group style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
                                        <Button
                                            type={viewMode === 'list' ? 'primary' : 'text'}
                                            icon={<FileTextOutlined />}
                                            onClick={() => setViewMode('list')}
                                            style={{ borderRadius: '8px', color: viewMode === 'list' ? '#fff' : 'rgba(255,255,255,0.6)' }}
                                        >
                                            List
                                        </Button>
                                        <Button
                                            type={viewMode === 'map' ? 'primary' : 'text'}
                                            icon={<EnvironmentOutlined />}
                                            onClick={() => setViewMode('map')}
                                            style={{ borderRadius: '8px', color: viewMode === 'map' ? '#fff' : 'rgba(255,255,255,0.6)' }}
                                        >
                                            Map
                                        </Button>
                                    </Button.Group>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => navigate('/report')}
                                        style={{ background: '#f5222d', borderColor: '#f5222d', borderRadius: '8px', fontWeight: 'bold' }}
                                    >
                                        Make New Report
                                    </Button>
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <Table
                                    dataSource={reports.slice(0, 5)}
                                    columns={columns}
                                    rowKey="_id"
                                    pagination={false}
                                    className="glass-table"
                                />
                            ) : (
                                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <AccidentMap reports={reports} policePatrols={policePatrols} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            case '2':
                // All Reports
                return (
                    <div className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={3}>My Reports History</Title>
                            <Button type="primary" icon={<ClockCircleOutlined />} onClick={fetchMyReports} loading={loading}>Refresh</Button>
                        </div>
                        <Table
                            dataSource={reports}
                            columns={columns}
                            rowKey="_id"
                            className="glass-table"
                        />
                    </div>
                );
            case '3':
                // Profile
                return (
                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
                        <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#f5222d', marginBottom: '20px' }} />
                        <Title level={3}>{user.email}</Title>
                        <Tag style={{
                            color: 'black',
                            backgroundColor: '#13c2c2',
                            border: 'none',
                            padding: '6px 16px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}>
                            CITIZEN REPORTER
                        </Tag>

                        <div style={{ marginTop: '40px', width: '100%', maxWidth: '400px' }}>
                            <Card title="Account Info" variant="borderless" className="glass-card">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
                                <p><strong>Reputation Score:</strong> High</p>
                            </Card>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={250} theme="dark" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {collapsed ? 'Hub' : 'Witness Hub'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    style={{ background: 'transparent' }}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
                        { key: '2', icon: <FileTextOutlined />, label: 'My Reports' },
                        { key: '3', icon: <UserOutlined />, label: 'My Profile' }
                    ]}
                />
            </Layout.Sider>
            <Layout className="site-layout" style={{ background: 'transparent' }}>
                <Layout.Header style={{ padding: '0 24px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '20px', cursor: 'pointer', color: '#fff' }
                    })}
                    <Dropdown menu={{ items: userItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <span style={{ fontWeight: 500, color: '#fff' }}>{user.email?.split('@')[0]}</span>
                        </div>
                    </Dropdown>
                </Layout.Header>
                <Layout.Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {renderContent()}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default ReporterDashboard;
