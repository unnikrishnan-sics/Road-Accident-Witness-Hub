import React, { useState } from 'react';
import { Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const { Title } = Typography;

const Register = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/register', values);
            message.success('Registration successful! Please login to continue.');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Title level={2} style={{ margin: 0 }}>Register</Title>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.5)' }}>Join the WitnessHub Network</Typography.Text>
                    </div>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please input your Full Name!' }]}
                        >
                            <Input prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Full Name" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email format' }]}
                        >
                            <Input prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }, { min: 6, message: 'Password must be at least 6 characters' }]}
                        >
                            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ fontWeight: 'bold' }}>
                                Create Account
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                Already have an account? <Link to="/login" style={{ color: '#1890ff' }}>Login</Link>
                            </Typography.Text>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
