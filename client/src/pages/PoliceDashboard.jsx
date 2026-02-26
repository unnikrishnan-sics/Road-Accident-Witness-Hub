import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Row, Col, Card, Statistic, Table, Tag, Button, App, Modal, Switch, Input, Empty } from 'antd';
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
    CloseCircleOutlined,
    SearchOutlined,
    HistoryOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AccidentMap from '../components/AccidentMap';
import { io } from 'socket.io-client';
import { formatDisplayName } from '../utils/userUtils';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const PoliceDashboard = () => {
    const { message, modal, notification } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [selectedKey, setSelectedKey] = useState('1');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [isPatrol, setIsPatrol] = useState(false);
    const isPatrol = false; // Force disabled

    // Vehicle LookUp State
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [searchingVehicle, setSearchingVehicle] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigate = useNavigate();

    // User is guaranteed to be police here (handled by Login/Route)
    const user = JSON.parse(localStorage.getItem('user')) || { role: 'police', email: 'Officer' };
    const displayRole = 'Police Officer';



    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5001');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });

        newSocket.on('new_report', (newReport) => {
            // Show Notification
            if (newReport.severity === 'Critical') {
                notification.error({
                    message: '🚨 CRITICAL ACCIDENT ALERT',
                    description: `New Critical Report at ${newReport.location}. Vehicle: ${newReport.vehicleNo}`,
                    duration: 0, // Keep open
                    placement: 'topRight'
                });
            } else {
                notification.info({
                    message: 'New Incident Reported',
                    description: `${newReport.severity} accident at ${newReport.location}`,
                    placement: 'topRight'
                });
            }

            // Update Report List Live
            setReports(prev => [newReport, ...prev]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Live Location Tracking for Patrol
    /* useEffect(() => {
        let watchId = null;

        if (isPatrol && socket) {
            console.log("[Patrol] Starting live location sharing...");
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    socket.emit('update_location', {
                        userId: user.email,
                        lat: latitude,
                        lng: longitude
                    });
                },
                (err) => console.error("Location watch error:", err),
                { enableHighAccuracy: true }
            );
        } else if (!isPatrol && socket) {
            socket.emit('stop_patrol');
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isPatrol, socket]); */

    useEffect(() => {
        const originalBackground = document.body.style.background;
        document.body.style.background = 'linear-gradient(135deg, #001529 0%, #003a8c 100%)';

        return () => {
            document.body.style.background = originalBackground || '';
        };
    }, []);

    useEffect(() => {
        fetchAllReports();
        // fetchPatrolStatus();
    }, []);

    /* const fetchPatrolStatus = async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            if (res.data) {
                console.log("[Frontend] Fetched Patrol Status:", res.data.isPatrol);
                setIsPatrol(!!res.data.isPatrol);
            }
        } catch (error) {
            console.error("Failed to fetch patrol status", error);
        }
    }; */

    const fetchAllReports = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/reports');
            if (res.data.success) {
                setReports(res.data.data);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to update feed');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            const res = await axiosInstance.put(`/reports/${reportId}/status`, { status: newStatus });
            if (res.data.success) {
                message.success(`Report marked as ${newStatus}`);
                fetchAllReports();
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to update status');
        }
    };

    /* const togglePatrol = async (checked) => {
        try {
            const res = await axiosInstance.put('/auth/patrol', { isPatrol: checked });
            if (res.data.success) {
                setIsPatrol(checked);
                if (checked) {
                    message.success({ content: 'Patrol Started: You are now active.', icon: <CarOutlined /> });
                } else {
                    message.info('Patrol Ended: Status set to inactive.');
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to update patrol status');
        }
    }; */

    const handleRowClick = (record) => {
        setSelectedReport(record);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedReport(null);
    };

    const handleVehicleSearch = async () => {
        if (!vehicleSearch.trim()) return;
        setSearchingVehicle(true);
        setHasSearched(true);
        try {
            // Use the filter endpoint we just created
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

    const showConfirm = (reportId, status, confirmText) => {
        modal.confirm({
            title: `Do you want to mark this report as ${status}?`,
            content: 'This action will update the report status and notify the reporter.',
            onOk() {
                handleUpdateStatus(reportId, status);
            },
            onCancel() { },
        });
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

    // Data filtering
    const pendingReports = reports.filter(r => r.status === 'Pending');
    const resolvedReports = reports.filter(r => r.status === 'Verified' || r.status === 'False');
    const assignments = reports;

    // Reusable Columns
    const getColumns = (showActions = false) => [
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            defaultSortOrder: 'descend',
            render: (text) => <span style={{ color: 'rgba(255,255,255,0.9)' }}>{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => <span style={{ color: 'rgba(255,255,255,0.9)' }}>{text}</span>,
        },
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            render: (text) => {
                let bgColor = '#e0e0e0';
                if (text === 'Minor') bgColor = '#b7eb8f';
                if (text === 'Major') bgColor = '#ffd591';
                if (text === 'Critical') bgColor = '#ffa39e';
                return (
                    <Tag style={{
                        color: 'black',
                        backgroundColor: bgColor,
                        border: 'none',
                        padding: '4px 12px',
                        fontWeight: 'bold'
                    }}>
                        {text}
                    </Tag>
                );
            }
        },
        {
            title: 'Vehicle No',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
            render: (text) => <span style={{ color: '#fff', fontWeight: 'bold' }}>{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                let bgColor = '#e0e0e0';
                if (text === 'Verified') bgColor = '#b7eb8f';
                if (text === 'False') bgColor = '#ffa39e';
                if (text === 'Pending') bgColor = '#ffd591';
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
        ...(showActions ? [{
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {record.status === 'Pending' && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => showConfirm(record._id, 'Verified', 'Verify')}
                            >
                                Verify
                            </Button>
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => showConfirm(record._id, 'False', 'Reject')}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </div>
            )
        }] : [])
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return (
                    <div className="glass-panel">
                        <Title level={3} style={{ marginBottom: '20px' }}>Field Overview</Title>
                        <p style={{ fontSize: '16px', marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>Active Units & Assignments</p>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card">
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>My Assignments (Pending)</span>}
                                        value={pendingReports.length}
                                        prefix={<AlertOutlined style={{ color: '#faad14' }} />}
                                        styles={{ content: { color: '#faad14' } }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card">
                                    <Statistic
                                        title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Resolved Today</span>}
                                        value={resolvedReports.length}
                                        prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                        styles={{ content: { color: '#52c41a' } }}
                                    />
                                </Card>
                            </Col>
                            {/* <Col xs={24} sm={8}>
                                <Card variant="borderless" className="glass-card" styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Patrol Status</span>}
                                            value={isPatrol ? 'Active' : 'Inactive'}
                                            className={isPatrol ? 'patrol-active' : 'patrol-inactive'}
                                            styles={{ content: { color: isPatrol ? '#52c41a' : '#8c8c8c', fontSize: '24px' } }}
                                        />
                                        <div style={{ background: isPatrol ? 'rgba(82, 196, 26, 0.2)' : 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}>
                                            <CarOutlined style={{ fontSize: '24px', color: isPatrol ? '#52c41a' : '#8c8c8c' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Toggle Patrol Mode</span>
                                        <Switch
                                            checked={isPatrol}
                                            onChange={togglePatrol}
                                            style={{ backgroundColor: isPatrol ? '#52c41a' : 'rgba(255,255,255,0.2)' }}
                                        />
                                    </div>
                                </Card>
                            </Col> */}
                        </Row>

                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <Title level={4} style={{ color: 'white', margin: 0 }}>Priority Incidents</Title>
                                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                                    <Button
                                        type={viewMode === 'list' ? 'primary' : 'text'}
                                        onClick={() => setViewMode('list')}
                                        icon={<FileTextOutlined />}
                                        style={{
                                            marginRight: '8px',
                                            borderRadius: '6px',
                                            backgroundColor: viewMode === 'list' ? '#1890ff' : 'transparent',
                                            color: 'white'
                                        }}
                                    >
                                        List
                                    </Button>
                                    <Button
                                        type={viewMode === 'map' ? 'primary' : 'text'}
                                        onClick={() => setViewMode('map')}
                                        icon={<EnvironmentOutlined />}
                                        style={{
                                            borderRadius: '6px',
                                            backgroundColor: viewMode === 'map' ? '#1890ff' : 'transparent',
                                            color: 'white'
                                        }}
                                    >
                                        Map
                                    </Button>
                                </div>
                            </div>

                            {viewMode === 'map' ? (
                                <AccidentMap reports={reports} />
                            ) : (
                                <Table
                                    dataSource={pendingReports.slice(0, 5)}
                                    columns={getColumns(true)}
                                    rowKey="_id"
                                    pagination={false}
                                    className="glass-table"
                                    onRow={(record) => ({
                                        onClick: () => handleRowClick(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                />
                            )}
                        </div>
                    </div>
                );
            case '2':
                return (
                    <div className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={3}>Assignments</Title>
                            <Button type="primary" icon={<ClockCircleOutlined />} onClick={fetchAllReports} loading={loading}>Refresh Feed</Button>
                        </div>
                        <Table
                            dataSource={assignments}
                            columns={getColumns(true)}
                            rowKey="_id"
                            className="glass-table"
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                style: { cursor: 'pointer' }
                            })}
                        />
                    </div>
                );
            case '3':
                return (
                    <div className="glass-panel">
                        <Title level={2}>Vehicle Lookup</Title>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Search accident history by Vehicle Registration Number.</p>

                        <Card className="glass-card" style={{ maxWidth: '600px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Input
                                    size="large"
                                    placeholder="Enter Vehicle No (e.g. KL01AZ1234)"
                                    prefix={<CarOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                    value={vehicleSearch}
                                    onChange={(e) => setVehicleSearch(e.target.value.toUpperCase())}
                                    onPressEnter={handleVehicleSearch}
                                />
                                <Button type="primary" size="large" icon={<SearchOutlined />} onClick={handleVehicleSearch} loading={searchingVehicle}>
                                    Search
                                </Button>
                            </div>
                        </Card>

                        {hasSearched && (
                            <div className="fade-in">
                                <Title level={4} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Search Results {vehicleHistory.length > 0 && <Tag color="geekblue" style={{ fontSize: '14px', paddingTop: '4px' }}>{vehicleHistory.length} Records Found</Tag>}
                                </Title>

                                {vehicleHistory.length > 0 ? (
                                    <Table
                                        dataSource={vehicleHistory}
                                        columns={getColumns(false)}
                                        rowKey="_id"
                                        className="glass-table"
                                        onRow={(record) => ({
                                            onClick: () => handleRowClick(record),
                                            style: { cursor: 'pointer' }
                                        })}
                                    />
                                ) : (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={<span style={{ color: 'rgba(255,255,255,0.5)' }}>No accident records found for this vehicle.</span>}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} style={{ background: 'rgba(0,10,20,0.6)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(24, 144, 255, 0.1)' }}>
                <div className="logo" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {collapsed ? 'Hub' : <span style={{ color: '#1890ff' }}>Police Hub</span>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    style={{ background: 'transparent' }}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
                        { key: '2', icon: <FileTextOutlined />, label: 'Assignments' },
                        { key: '3', icon: <HistoryOutlined />, label: 'Vehicle Lookup' },
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
                    {renderContent()}

                    <Modal
                        title={<span style={{ fontSize: '20px' }}>Incident Report Details</span>}
                        open={isModalVisible}
                        onCancel={handleModalClose}
                        footer={[
                            <Button
                                key="close"
                                onClick={handleModalClose}
                                style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                            >
                                Close
                            </Button>,
                            selectedReport?.status === 'Pending' && (
                                <Button key="verify" type="primary" onClick={() => { showConfirm(selectedReport._id, 'Verified', 'Verify'); setIsModalVisible(false); }}>
                                    Verify Now
                                </Button>
                            )
                        ]}
                        width={800}
                        centered
                    >
                        {selectedReport && (
                            <div style={{ padding: '20px 0' }}>
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} md={12}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Status</Text>
                                            <Tag
                                                color={selectedReport.status === 'Verified' ? 'green' : selectedReport.status === 'False' ? 'red' : 'gold'}
                                                className={selectedReport.status === 'Pending' ? 'tag-pending' : ''}
                                                style={{ fontSize: '14px', padding: '4px 10px', fontWeight: 'bold' }}
                                            >
                                                {selectedReport.status?.toUpperCase()}
                                            </Tag>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Date & Time</Text>
                                            <Text style={{ fontSize: '16px' }}>{new Date(selectedReport.timestamp).toLocaleString()}</Text>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Location</Text>
                                            <Text style={{ fontSize: '16px' }}>{selectedReport.location}</Text>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Vehicle Number</Text>
                                            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedReport.vehicleNo}</Text>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Severity</Text>
                                            <Text style={{ fontSize: '16px' }}>{selectedReport.severity}</Text>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Description</Text>
                                            <Text style={{ fontSize: '16px' }}>{selectedReport.description || 'No description provided.'}</Text>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Evidence / Scene Image</Text>
                                        <div style={{
                                            width: '100%',
                                            height: '300px',
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {selectedReport.photos && selectedReport.photos.length > 0 ? (
                                                <img
                                                    src={selectedReport.photos[0]}
                                                    alt="Accident Scene"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                                    <CarOutlined style={{ fontSize: '48px', marginBottom: '10px' }} />
                                                    <div>No Image Available</div>
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal>
                </Content>
            </Layout>
        </Layout >
    );
};

export default PoliceDashboard;
