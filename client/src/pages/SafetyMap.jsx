import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, Statistic, Tag } from 'antd';
import { SafetyOutlined, EnvironmentOutlined, CarOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import AccidentMap from '../components/AccidentMap';
import axiosInstance from '../api/axiosInstance';
import { io } from 'socket.io-client';

const { Title, Paragraph, Text } = Typography;

const SafetyMap = () => {
    const [reports, setReports] = useState([]);
    const [policePatrols, setPolicePatrols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Fetch all verified/recent reports
        const fetchReports = async () => {
            try {
                const res = await axiosInstance.get('/reports');
                if (res.data.success) {
                    setReports(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch reports", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();

        // Connect to Socket for live police updates
        const socket = io('http://localhost:5001');

        socket.on('connect', () => {
            console.log("[SafetyMap] Socket connected to 5001");
            setConnected(true);
        });

        socket.on('disconnect', () => {
            console.log("[SafetyMap] Socket disconnected");
            setConnected(false);
        });

        socket.on('connect_error', (err) => {
            console.error("[SafetyMap] Socket Error:", err.message);
            setConnected(false);
        });

        socket.on('patrol_update', (patrols) => {
            console.log("[SafetyMap] Received patrol update:", patrols);
            setPolicePatrols(patrols);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '50px' }}>
            <Navbar />

            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                    <Title level={1}>Live Hub <span style={{ color: '#1890ff' }}>Safety Map</span></Title>
                    <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>
                        Real-time visualization of accident hotspots and active police patrols in your area.
                    </Paragraph>
                </header>

                <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
                    <Col xs={24} md={16}>
                        <Card className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                            <AccidentMap reports={reports} policePatrols={policePatrols} />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="glass-panel" style={{ height: '100%' }}>
                            <Title level={4} style={{ marginBottom: '24px' }}>Map Legend</Title>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1890ff' }}></div>
                                    <Text strong>Active Police Patrol</Text>
                                </div>
                                <Text type="secondary">Moving markers representing live law enforcement presence.</Text>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f5222d' }}></div>
                                    <Text strong>Accident Hotspot</Text>
                                </div>
                                <Text type="secondary">Pins representing locations of recently reported accidents.</Text>
                            </div>

                            <div style={{ marginTop: '40px', background: 'rgba(24, 144, 255, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(24, 144, 255, 0.2)' }}>
                                <Statistic
                                    title={<Text style={{ color: 'rgba(255,255,255,0.7)' }}>Currently Patrolling</Text>}
                                    value={policePatrols.length}
                                    prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                                    styles={{ content: { color: '#1890ff' } }}
                                />
                                <Tag color="blue" style={{ marginTop: '10px' }}>Real-time updates active</Tag>
                                <Tag color={connected ? "success" : "error"} style={{ marginTop: '10px' }}>
                                    {connected ? "LIVE CONNECTION" : "CONNECTION LOST"}
                                </Tag>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <Text type="secondary">
                        <EnvironmentOutlined /> Note: Locations are approximate to protect privacy. Data refreshes automatically.
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default SafetyMap;
