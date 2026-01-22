import React from 'react';
import { Button, Row, Col, Typography, Card } from 'antd';
import { CameraOutlined, SafetyCertificateOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';

const { Title, Paragraph } = Typography;

const Home = () => {
    return (
        <div className="home-container">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <header className="landing-hero" style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 20px',
                background: 'radial-gradient(circle at center, rgba(245, 34, 45, 0.1) 0%, transparent 70%)' /* Subtle spotlight effect */
            }}>
                <div style={{ maxWidth: '900px' }}>
                    <Title style={{
                        fontSize: 'clamp(40px, 5vw, 72px)',
                        marginBottom: '24px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        lineHeight: '1.1',
                        textShadow: '0 0 40px rgba(245, 34, 45, 0.3)'
                    }}>
                        Report. Prevent. <span style={{ color: '#f5222d' }}>Save.</span>
                    </Title>
                    <Paragraph style={{
                        fontSize: '20px',
                        maxWidth: '700px',
                        margin: '0 auto 50px',
                        lineHeight: '1.6',
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        The Road Accident Witness Hub empowers citizens to anonymously report incidents.
                        Your quick action effectively aids law enforcement and identifies repeat offenders.
                    </Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        shape="round"
                        style={{
                            height: '65px',
                            padding: '0 60px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                        onClick={() => console.log('Navigate to Report Form')}
                    >
                        REPORT ACCIDENT NOW
                    </Button>
                </div>
            </header>

            {/* Features Section */}
            <section className="landing-section" style={{ padding: '50px 20px 100px' }}>
                <Title level={2} style={{ marginBottom: '80px', textAlign: 'center', fontWeight: '300' }}>How It <span style={{ fontWeight: 'bold' }}>Works</span></Title>
                <Row gutter={[48, 48]} justify="center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Col xs={24} md={8}>
                        <div className="glass-card" style={{ height: '100%', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(245, 34, 45, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CameraOutlined style={{ fontSize: '48px', color: '#f5222d' }} />
                            </div>
                            <Title level={4}>1. Upload Evidence</Title>
                            <Paragraph>
                                Take a photo of the vehicle or accident scene. Our AI instantly detects the number plate.
                            </Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="glass-card" style={{ height: '100%', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(245, 34, 45, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <EyeInvisibleOutlined style={{ fontSize: '48px', color: '#f5222d' }} />
                            </div>
                            <Title level={4}>2. Stay Anonymous</Title>
                            <Paragraph>
                                We do not collect your personal data. Report freely without fear of legal hassles.
                            </Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="glass-card" style={{ height: '100%', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(245, 34, 45, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#f5222d' }} />
                            </div>
                            <Title level={4}>3. Justice Served</Title>
                            <Paragraph>
                                Verified reports are sent to the police dashboard to track offenders and improve safety.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}>
                Road Accident Witness Hub ©2026. All Rights Reserved.
            </footer>
        </div>
    );
};

export default Home;
