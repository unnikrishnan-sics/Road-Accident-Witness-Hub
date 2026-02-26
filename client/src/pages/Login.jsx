import React, { useState } from 'react';
import { Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const { Title } = Typography;

const Login = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/login', values);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            message.success('Welcome back!');
            if (data.role === 'police') {
                navigate('/police/dashboard');
            } else if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/reporter/dashboard'); // Citizens go to dashboard
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed');
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
                        <Title level={2} style={{ margin: 0 }}>Login</Title>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.5)' }}>Restricted Area</Typography.Text>
                    </div>

                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email format' }]}
                        >
                            <Input prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} size="large" style={{ fontWeight: 'bold' }}>
                                Access Dashboard
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <small style={{ color: 'rgba(255,255,255,0.3)' }}>Secured by WitnessHub System</small>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                New here? <Link to="/register" style={{ color: '#1890ff' }}>Create an Account</Link>
                            </Typography.Text>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
