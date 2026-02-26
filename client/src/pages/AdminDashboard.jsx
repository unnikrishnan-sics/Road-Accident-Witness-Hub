import { Layout, Menu, Button, Typography, Avatar, Dropdown, Row, Col, Table, Tag, App } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    CarOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    TeamOutlined,
    AlertOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatDisplayName } from '../utils/userUtils';
import axiosInstance from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
    const { modal, message } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // User is guaranteed to be admin here
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'admin', email: 'Admin' };
    const displayRole = 'Administrator';

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/reports');
            if (res.data.success) {
                setReports(res.data.data);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

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
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '2',
            icon: <FileTextOutlined />,
            label: 'Accident Reports',
        },
        {
            key: '3',
            icon: <CarOutlined />,
            label: 'Vehicle History',
        },
    ];

    // Table Columns for Reports
    const columns = [
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            render: (text) => {
                let color = 'green';
                if (text === 'Major') color = 'gold';
                if (text === 'Critical') color = 'red';
                return <Tag color={color}>{text.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Vehicle No',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <Tag color={text === 'Pending' ? 'orange' : 'blue'}>{text}</Tag>,
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => new Date(text).toLocaleString(),
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                // Overview
                return (
                    <div className="glass-panel">
                        <Title level={4} style={{ marginBottom: '20px' }}>Overview</Title>
                        <p style={{ fontSize: '16px', marginBottom: '30px' }}>Welcome to the {displayRole} Dashboard.</p>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <FileTextOutlined style={{ fontSize: '32px', color: '#f5222d', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{reports.length}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Total Reports</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <AlertOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                                        {reports.filter(r => r.status === 'Pending').length}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Pending Verification</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <TeamOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>12</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Active Police Units</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>98%</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>System Health</div>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ marginTop: '40px' }}>
                            <Title level={4}>Recent Reports</Title>
                            <Table
                                dataSource={reports.slice(0, 5)}
                                columns={columns}
                                rowKey="_id"
                                pagination={false}
                                className="glass-table"
                            />
                        </div>
                    </div>
                );
            case '2':
                // Accident Reports
                return (
                    <div className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={4}>All Accident Reports</Title>
                            <Button icon={<ClockCircleOutlined />} onClick={fetchReports} loading={loading}>
                                Refresh Data
                            </Button>
                        </div>

                        <Table
                            dataSource={reports}
                            columns={columns}
                            rowKey="_id"
                            loading={loading}
                            className="glass-table"
                        />
                    </div>
                );
            case '3':
                return (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '100px 20px' }}>
                        <CarOutlined style={{ fontSize: '64px', color: '#f5222d', marginBottom: '20px' }} />
                        <Title level={2}>Vehicle History</Title>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>This feature is under development.</p>
                        <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(245, 34, 45, 0.1)', display: 'inline-block', borderRadius: '8px', color: '#f5222d', fontWeight: 'bold' }}>
                            COMING SOON
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
                <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {collapsed ? 'Hub' : 'Witness Hub'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
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
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f5222d' }} />
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
                        background: 'transparent',
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
