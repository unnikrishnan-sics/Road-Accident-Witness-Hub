import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select, Typography, Card, App } from 'antd';
import { UploadOutlined, EnvironmentOutlined, CarOutlined, AlertOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ReporterLayout from '../components/ReporterLayout';


const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReportAccident = () => {
    const { message, notification, modal } = App.useApp(); // Use context-aware hooks
    const [loading, setLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null); // Store {lat, lng}
    const [isAiDetected, setIsAiDetected] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Protect Route
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('Please login to report an accident');
            navigate('/login');
        }
    }, [navigate, message]);

    const handleImageAnalysis = async (file) => {
        setAnalysisLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            message.loading({ content: 'AI Analysis in progress...', key: 'ocr' });

            const res = await axiosInstance.post('/reports/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success && res.data.data) {
                const { vehicleNo, severity, description } = res.data.data;

                // Auto-fill fields
                form.setFieldsValue({
                    vehicleNo: vehicleNo || '',
                    severity: severity || undefined,
                    description: description || ''
                });

                setIsAiDetected(true);

                // Construct detailed success message
                const detectedItems = [];
                if (vehicleNo) detectedItems.push("Vehicle No");
                if (severity) detectedItems.push("Severity");
                if (description) detectedItems.push("Description");

                message.success({
                    content: `AI Analyzed: ${detectedItems.join(', ')} detected!`,
                    key: 'ocr',
                    icon: '🤖',
                    duration: 4
                });
            } else {
                message.warning({
                    content: `AI could not clearly analyze the image. Please enter details manually.`,
                    key: 'ocr',
                    duration: 5
                });
            }

        } catch (error) {
            console.error(error);
            message.error({ content: 'AI Analysis Failed. Please enter manually.', key: 'ocr' });
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            message.error('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude }); // Store numeric coords

                try {
                    // Reverse Geocoding using OpenStreetMap (Nominatim) - Free & No Key required
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    if (data && data.display_name) {
                        form.setFieldsValue({ location: data.display_name });
                        message.success('Location fetched successfully!');
                    } else {
                        form.setFieldsValue({ location: `${latitude}, ${longitude}` });
                        message.warning('Address not found, using coordinates.');
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    form.setFieldsValue({ location: `${latitude}, ${longitude}` });
                    message.warning('Could not fetch address, using coordinates.');
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                message.error('Unable to retrieve your location');
                setLocationLoading(false);
            }
        );
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('location', values.location);
            formData.append('vehicleNo', values.vehicleNo || '');
            formData.append('severity', values.severity);
            formData.append('description', values.description);

            // Append Coordinates if available
            if (coordinates) {
                formData.append('lat', coordinates.lat);
                formData.append('lng', coordinates.lng);
            }

            // Handle File Upload
            // NOTE: getValueFromEvent normalizes the value to the fileList array directly
            const photos = values.photos;
            if (photos && photos.length > 0) {
                // originFileObj is correct for Antd Upload files
                formData.append('image', photos[0].originFileObj);
            }

            const { data } = await axiosInstance.post('/reports', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const successMsg = isAiDetected
                ? 'Report Submitted! AI automatically detected the Number Plate.'
                : 'Report Submitted Successfully! Help is on the way.';

            message.success({
                content: successMsg,
                style: { marginTop: '20vh' },
            });

            form.resetFields();
            setIsAiDetected(false);
            setTimeout(() => navigate('/'), 2000);

        } catch (error) {
            console.error(error);
            message.error('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReporterLayout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh' // adjust to fit within content area
            }}>
                <Card className="glass-panel" style={{ width: '100%', maxWidth: '600px', borderTop: '4px solid #f5222d' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <AlertOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '10px' }} />
                        <Title level={2} style={{ margin: 0 }}>Report Accident</Title>
                        <Text type="secondary" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Your immediate action can save lives. Report anonymously.
                        </Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="photos"
                            label={<span style={{ color: 'white' }}>Evidence (Upload first for AI Auto-fill)</span>}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) return e;
                                return e && e.fileList;
                            }}
                        >
                            <Upload
                                maxCount={1}
                                beforeUpload={(file) => {
                                    handleImageAnalysis(file);
                                    return false; // Prevent auto upload, we handle in onFinish
                                }}
                                listType="picture"
                                onRemove={() => {
                                    form.setFieldsValue({ vehicleNo: '' });
                                    setIsAiDetected(false);
                                }}
                            >
                                <Button icon={<UploadOutlined />} block size="large" loading={analysisLoading} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                    {analysisLoading ? 'Analyzing...' : 'Click to Upload Photo'}
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label={<span style={{ color: 'white' }}>Accident Location</span>}
                            rules={[{ required: true, message: 'Please enter the location' }]}
                        >
                            <Input
                                prefix={<EnvironmentOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
                                placeholder="e.g. Mg Road, Indiranagar Junction"
                                size="large"
                                suffix={
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={handleGetLocation}
                                        loading={locationLoading}
                                        style={{ color: '#1890ff', fontWeight: 'bold' }}
                                    >
                                        📍 Get Location
                                    </Button>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="vehicleNo"
                            label={<span style={{ color: 'white' }}>Vehicle Number</span>}
                            help={<span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>AI will try to detect this from your photo</span>}
                            rules={[{ required: false }]}
                        >
                            <Input
                                prefix={<CarOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
                                placeholder="e.g. KA-01-AB-1234"
                                size="large"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="severity"
                            label={<span style={{ color: 'white' }}>Severity</span>}
                            rules={[{ required: true, message: 'Please select severity' }]}
                        >
                            <Select placeholder="Select Severity" size="large">
                                <Option value="Minor">🟢 Minor (Scratches/No Injuries)</Option>
                                <Option value="Major">🟡 Major (Vehicle Damage/Injuries)</Option>
                                <Option value="Critical">🔴 Critical (Life Threatening)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span style={{ color: 'white' }}>Description</span>}
                            rules={[{ required: true, message: 'Please describe the incident' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Describe what happened..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                style={{
                                    height: '50px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    background: '#f5222d',
                                    borderColor: '#f5222d',
                                    marginTop: '10px'
                                }}
                            >
                                SUBMIT REPORT
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </ReporterLayout>
    );
};

export default ReportAccident;
