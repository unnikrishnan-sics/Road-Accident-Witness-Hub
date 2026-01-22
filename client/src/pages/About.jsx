import React from 'react';
import { Typography } from 'antd';
import Navbar from '../components/Navbar';

const { Title, Paragraph } = Typography;

const About = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
                <Title level={1} style={{ textAlign: 'center', marginBottom: '50px' }}>About Us</Title>
                <div className="glass-panel">
                    <Paragraph style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
                        The <span style={{ color: '#f5222d', fontWeight: 'bold' }}>Road Accident Witness Hub</span> is a community-driven initiative designed to bridge the gap between road accidents and proper legal documentation.
                        Often, witnesses are afraid to come forward due to legal hassles. Our platform eliminates this fear by offering a 100% anonymous reporting system.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '18px', lineHeight: '1.8' }}>
                        By leveraging Artificial Intelligence, we make it easier to extract vehicle details from images, ensuring that authorities get accurate data to act upon.
                    </Paragraph>

                    <div style={{ marginTop: '50px', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <Title level={3} style={{ marginTop: 0 }}>Our Mission</Title>
                        <Paragraph style={{ fontSize: '18px', marginBottom: 0 }}>
                            To create a safer road environment by empowering citizens to report incidents without fear, bringing accountability to reckless driving.
                        </Paragraph>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
