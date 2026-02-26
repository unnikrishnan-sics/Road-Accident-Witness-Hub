import React from 'react';
import { Button, Row, Col, Typography, Card, Tag, Statistic } from 'antd';
import { CameraOutlined, SafetyCertificateOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container" style={{ overflow: 'hidden' }}>
            <Navbar />

            {/* Hero Section */}
            <section className="landing-hero" style={{
                minHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 20px',
                position: 'relative',
                background: 'radial-gradient(circle at center, rgba(245, 34, 45, 0.08) 0%, transparent 70%)'
            }}>
                {/* Background Decoration */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(24, 144, 255, 0.05)',
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                    zIndex: -1
                }} />

                <div style={{ maxWidth: '1000px', zIndex: 1 }}>
                    <Tag color="red" style={{
                        marginBottom: '20px',
                        padding: '4px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        letterSpacing: '1px',
                        background: 'rgba(245, 34, 45, 0.1)',
                        border: '1px solid rgba(245, 34, 45, 0.3)'
                    }}>
                        AI-POWERED SAFETY PLATFORM
                    </Tag>

                    <Title style={{
                        fontSize: 'clamp(48px, 8vw, 90px)',
                        marginBottom: '24px',
                        fontWeight: 900,
                        lineHeight: '1',
                        letterSpacing: '-2px',
                        background: 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.7) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Response. Accountability. <br />
                        <span style={{ color: '#f5222d', textShadow: '0 0 30px rgba(245, 34, 45, 0.4)' }}>Justice.</span>
                    </Title>

                    <Paragraph style={{
                        fontSize: '22px',
                        maxWidth: '750px',
                        margin: '0 auto 48px',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: '300'
                    }}>
                        Empowering citizens with AI-driven reporting and real-time police tracking
                        to make our roads safer, one report at a time.
                    </Paragraph>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                height: '60px',
                                padding: '0 40px',
                                fontSize: '18px',
                                fontWeight: '700',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onClick={() => navigate('/report')}
                        >
                            <CameraOutlined /> REPORT INCIDENT
                        </Button>
                        {/* <Button
                            size="large"
                            className="glass-btn"
                            style={{
                                height: '60px',
                                padding: '0 40px',
                                fontSize: '18px',
                                fontWeight: '600',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onClick={() => navigate('/safety-map')}
                        >
                            <SafetyCertificateOutlined style={{ color: '#1890ff' }} /> VIEW SAFETY MAP
                        </Button> */}
                    </div>
                </div>

                {/* Floating Metric */}
                <div className="glass-panel" style={{
                    marginTop: '80px',
                    padding: '20px 40px',
                    borderRadius: '24px',
                    display: 'flex',
                    gap: '60px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <Statistic title={<span style={{ color: 'rgba(255,255,255,0.5)' }}>AI Accuracy</span>} value={98} suffix="%" styles={{ content: { color: '#fff', fontWeight: '800' } }} />
                    <Statistic title={<span style={{ color: 'rgba(255,255,255,0.5)' }}>Response Time</span>} value={2.4} suffix="m" styles={{ content: { color: '#fff', fontWeight: '800' } }} />
                    <Statistic title={<span style={{ color: 'rgba(255,255,255,0.5)' }}>Reports Filed</span>} value={1420} styles={{ content: { color: '#fff', fontWeight: '800' } }} />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '120px 20px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <Title level={2} style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px' }}>Built for the <span style={{ color: '#1890ff' }}>Modern City</span></Title>
                        <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>
                            Leveraging cutting-edge tech to bridge the gap between citizens and authorities.
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]}>
                        {[
                            {
                                icon: <CameraOutlined />,
                                title: "AI Plate Recognition",
                                desc: "Proprietary models automatically extract vehicle details from photos in seconds.",
                                color: "#f5222d"
                            },
                            {
                                icon: <EyeInvisibleOutlined />,
                                title: "Verified Anonymity",
                                desc: "Report anonymously with end-to-end data obfuscation. Your safety is our priority.",
                                color: "#722ed1"
                            },
                            /* {
                                icon: <SafetyCertificateOutlined />,
                                title: "Real-time Tracking",
                                desc: "See where the police are patrolling live on our integrated safety map.",
                                color: "#1890ff"
                            } */
                        ].map((feature, i) => (
                            <Col xs={24} md={8} key={i}>
                                <Card className="glass-card" style={{ height: '100%', border: 'none', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: `${feature.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        color: feature.color,
                                        marginBottom: '24px'
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ marginBottom: '16px' }}>{feature.title}</Title>
                                    <Paragraph style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>
                                        {feature.desc}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '60px 40px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px' }}>
                    <Text strong style={{ opacity: 0.5 }}>PRIVACY POLICY</Text>
                    <Text strong style={{ opacity: 0.5 }}>TERMS OF SERVICE</Text>
                    <Text strong style={{ opacity: 0.5 }}>API DOCUMENTATION</Text>
                </div>
                <Text style={{ opacity: 0.3 }}>© 2026 ROAD ACCIDENT WITNESS HUB. ALL RIGHTS RESERVED.</Text>
            </footer>
        </div>
    );
};

export default Home;
