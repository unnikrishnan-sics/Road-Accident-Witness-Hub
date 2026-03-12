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
    SearchOutlined,
    HistoryOutlined
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
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    // Vehicle LookUp State
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [searchingVehicle, setSearchingVehicle] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    // User is guaranteed to be admin here
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'admin', email: 'Admin' };
    const displayRole = 'Administrator';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchReports();
    }, [navigate]);

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

    const handleVehicleSearch = async () => {
        if (!vehicleSearch.trim()) return;
        setSearchingVehicle(true);
        setHasSearched(true);
        try {
            const res = await axiosInstance.get(`/reports?vehicleNo=${vehicleSearch}`);
            if (res.data.success) {
                setVehicleHistory(res.data.data);
            }
        } catch (error) {
            console.error(error);
            message.error('Search failed');
        } finally {
            setSearchingVehicle(false);
        }
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
            icon: <HistoryOutlined />,
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
        {
            title: 'Reports',
            key: 'duplicates',
            render: (_, record) => (
                record.duplicateCount > 0 ? (
                    <Tag color="purple">+{record.duplicateCount} More</Tag>
                ) : (
                    <Tag color="default">Single</Tag>
                )
            ),
        }
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
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{reports.filter(r => r.isPrimary).length}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Unique Incidents</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <AlertOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                                        {reports.filter(r => r.status === 'Pending' && r.isPrimary).length}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Pending Alerts</div>
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
                                dataSource={reports.filter(r => r.isPrimary).slice(0, 5)}
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
                            dataSource={reports.filter(r => r.isPrimary)}
                            columns={columns}
                            rowKey="_id"
                            loading={loading}
                            className="glass-table"
                            expandable={{
                                expandedRowRender: (record) => {
                                    const duplicates = reports.filter(r =>
                                        r._id !== record._id &&
                                        r.coordinates && record.coordinates &&
                                        Math.abs(r.coordinates.lat - record.coordinates.lat) <= 0.0045 &&
                                        Math.abs(r.coordinates.lng - record.coordinates.lng) <= 0.0045 &&
                                        Math.abs(new Date(r.timestamp) - new Date(record.timestamp)) <= 3600000
                                    );

                                    return (
                                        <div style={{ padding: '0 50px' }}>
                                            <Title level={5} style={{ color: 'white', marginBottom: '15px' }}>Related Witness Reports</Title>
                                            <Table
                                                columns={[
                                                    { title: 'Witness ID', dataIndex: 'reporter', key: 'reporter', render: (id) => id.slice(-6) },
                                                    { title: 'Time', dataIndex: 'timestamp', key: 'timestamp', render: (t) => new Date(t).toLocaleTimeString() },
                                                    { title: 'Description', dataIndex: 'description', key: 'description' },
                                                    { title: 'Vehicle', dataIndex: 'vehicleNo', key: 'vehicleNo' }
                                                ]}
                                                dataSource={duplicates}
                                                rowKey="_id"
                                                pagination={false}
                                                size="small"
                                                className="glass-table"
                                            />
                                        </div>
                                    );
                                },
                                rowExpandable: (record) => record.duplicateCount > 0,
                            }}
                        />
                    </div>
                );
            case '3':
                return (
                    <div className="glass-panel">
                        <Title level={2}>Vehicle History Search</Title>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Search accident history by Vehicle Registration Number.</p>

                        <div className="glass-card" style={{ maxWidth: '600px', marginBottom: '40px', padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Input
                                    size="large"
                                    placeholder="Enter Vehicle No (e.g. KL01AZ1234)"
                                    prefix={<CarOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                                    value={vehicleSearch}
                                    onChange={(e) => setVehicleSearch(e.target.value.toUpperCase())}
                                    onPressEnter={handleVehicleSearch}
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.25)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white'
                                    }}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SearchOutlined />}
                                    onClick={handleVehicleSearch}
                                    loading={searchingVehicle}
                                    style={{ background: '#f5222d', borderColor: '#f5222d' }}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Show all reports by default if no search, or filtered results */}
                        <div className="fade-in">
                            <Title level={4} style={{ marginBottom: '20px', color: 'white' }}>
                                {vehicleSearch ? `Records for "${vehicleSearch}"` : 'Cumulative Incident History'}
                                {(vehicleSearch ? vehicleHistory.length : reports.filter(r => r.isPrimary).length) > 0 &&
                                    <Tag color="error" style={{ marginLeft: '10px' }}>
                                        {vehicleSearch ? vehicleHistory.length : reports.filter(r => r.isPrimary).length} INCIDENTS
                                    </Tag>
                                }
                            </Title>

                            {(vehicleSearch ? vehicleHistory : reports.filter(r => r.isPrimary)).length > 0 ? (
                                <Table
                                    dataSource={vehicleSearch ? vehicleHistory : reports.filter(r => r.isPrimary)}
                                    columns={columns.filter(c => c.key !== 'duplicates')}
                                    rowKey="_id"
                                    className="glass-table"
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                    <CarOutlined style={{ fontSize: '48px', color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
                                        {vehicleSearch ? 'No accident records found for this vehicle.' : 'No incident history found.'}
                                    </div>
                                </div>
                            )}
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
