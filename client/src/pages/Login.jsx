import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/login', values);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            message.success('Welcome back!');
            if (data.role === 'police') {
                navigate('/police/dashboard');
            } else {
                navigate('/admin/dashboard');
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
                            <Input prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />} placeholder="Email" />
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
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
