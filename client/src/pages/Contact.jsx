import React from 'react';
import { Typography, Card, Form, Input, Button, App } from 'antd';
import Navbar from '../components/Navbar';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const { message } = App.useApp();
    const onFinish = (values) => {
        message.success('Thank you for contacting us! We will get back to you shortly.');
        console.log('Success:', values);
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <Title level={1} style={{ textAlign: 'center', marginBottom: '10px' }}>Contact Us</Title>
                <Paragraph style={{ textAlign: 'center', marginBottom: '50px', fontSize: '18px' }}>
                    Have questions or suggestions? Reach out to us.
                </Paragraph>

                <div className="glass-panel">
                    <Form
                        name="contact"
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label={<span style={{ color: 'white' }}>Name</span>}
                            rules={[
                                { required: true, message: 'Please enter your name' },
                                { pattern: /^[A-Za-z\s]+$/, message: 'Name can only contain letters and spaces' }
                            ]}
                        >
                            <Input placeholder="Your Name" />
                        </Form.Item>
                        <Form.Item name="email" label={<span style={{ color: 'white' }}>Email</span>} rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="Your Email" />
                        </Form.Item>
                        <Form.Item name="message" label={<span style={{ color: 'white' }}>Message</span>} rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="How can we help?" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: '10px' }}>
                                Send Message
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
