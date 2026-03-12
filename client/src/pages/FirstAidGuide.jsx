import React, { useState } from 'react';
import { Layout, Input, Typography, Card, Space, Button, Tag, Spin, Empty, App, Row, Col, Flex } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const FirstAidGuide = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [guide, setGuide] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const res = await axiosInstance.get(`/firstaid/search?q=${encodeURIComponent(searchQuery)}`);
            if (res.data.success) {
                setGuide(res.data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
            message.error('Failed to fetch first aid guide. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #001529 0%, #003a8c 100%)' }}>
            <Navbar />
            <Content style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                >
                    Back
                </Button>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={1} style={{ color: 'white', marginBottom: '10px' }}>
                        <SafetyCertificateOutlined style={{ color: '#52c41a', marginRight: '15px' }} />
                        Emergency First Aid Guide
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
                        Type symptoms or injury name to get instant medical guidance.
                    </Paragraph>

                    <div style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '12px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        gap: '12px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Input
                            placeholder="e.g. Head Injury, Bleeding, Burn, Fainting..."
                            size="large"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onPressEnter={handleSearch}
                            prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px', marginRight: '8px' }} />}
                            style={{
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: 'white',
                                height: '56px',
                                fontSize: '16px',
                                flex: 1
                            }}
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSearch}
                            loading={loading}
                            style={{
                                height: '56px',
                                padding: '0 32px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #f5222d 0%, #cf1322 100%)',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '14px',
                                letterSpacing: '1px',
                                boxShadow: '0 10px 20px rgba(245, 34, 45, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            SEARCH GUIDE
                        </Button>
                    </div>
                </div>

                <Spin spinning={loading} tip="Generating AI First Aid Guide..." size="large">
                    {!loading && guide ? (
                        <div className="fade-in">
                            <Card className="glass-panel" style={{ border: 'none', marginBottom: '30px' }}>
                                <Title level={2} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                    {guide.title}
                                </Title>

                                <div style={{ marginTop: '30px' }}>
                                    <Title level={4} style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <WarningOutlined /> Immediate Life-Saving Steps
                                    </Title>
                                    <Flex vertical gap="middle" style={{ marginTop: '20px' }}>
                                        {guide.immediateSteps.map((step, index) => (
                                            <Flex key={index} gap="middle" align="flex-start">
                                                <Tag color="red" style={{
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    minWidth: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                    background: '#ff4d4f',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    marginTop: '2px'
                                                }}>!</Tag>
                                                <Text style={{ color: 'white', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>{step}</Text>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </div>

                                <Row gutter={[24, 24]} style={{ marginTop: '30px' }}>
                                    <Col xs={24} md={12}>
                                        <div className="glass-card" style={{ height: '100%', borderColor: 'rgba(82, 196, 26, 0.2)' }}>
                                            <Title level={4} style={{ color: '#52c41a' }}>
                                                <CheckCircleOutlined /> Do's
                                            </Title>
                                            <Flex vertical gap="small" style={{ marginTop: '10px' }}>
                                                {guide.dos.map((item, index) => (
                                                    <Flex key={index} gap="small" align="flex-start" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>•</span>
                                                        <span>{item}</span>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="glass-card" style={{ height: '100%', borderColor: 'rgba(255, 77, 79, 0.2)' }}>
                                            <Title level={4} style={{ color: '#ff4d4f' }}>
                                                <CloseCircleOutlined /> Don'ts
                                            </Title>
                                            <Flex vertical gap="small" style={{ marginTop: '10px' }}>
                                                {guide.donts.map((item, index) => (
                                                    <Flex key={index} gap="small" align="flex-start" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>•</span>
                                                        <span>{item}</span>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        </div>
                                    </Col>
                                </Row>

                                <Card className="glass-card" style={{ marginTop: '30px', background: 'rgba(24, 144, 255, 0.1)', borderColor: 'rgba(24, 144, 255, 0.3)' }}>
                                    <Title level={4} style={{ color: '#1890ff' }}>When to Seek Emergency Help?</Title>
                                    <Paragraph style={{ color: 'white', fontSize: '15px' }}>
                                        {guide.whenToSeekHelp}
                                    </Paragraph>
                                </Card>

                                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                                    <Paragraph type="secondary" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                                        Disclaimer: This is an AI-generated first aid guide. Always contact emergency services (Ambulance/Police) immediately in case of severe accidents.
                                    </Paragraph>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="glass-panel" style={{ border: 'none', textAlign: 'center', padding: '60px' }}>
                            <Empty
                                image={<SafetyCertificateOutlined style={{ fontSize: '64px', color: 'rgba(255,255,255,0.1)' }} />}
                                description={
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
                                        Search for an injury or symptom to see the first aid steps.
                                    </span>
                                }
                            />
                        </Card>
                    )}
                </Spin>
            </Content>
        </Layout>
    );
};

export default FirstAidGuide;
