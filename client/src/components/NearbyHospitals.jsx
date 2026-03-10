import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Spin, Empty, App } from 'antd';
import { EnvironmentOutlined, CompassOutlined, PlusSquareOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NearbyHospitals = () => {
    const { message } = App.useApp();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getNearbyHospitals = async () => {
            if (!navigator.geolocation) {
                message.error('Geolocation is not supported by your browser');
                return;
            }

            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Overpass API query for hospitals within 5km, including phone/emergency fields
                        const query = `[out:json];node["amenity"="hospital"](around:10000,${latitude},${longitude});out;`;
                        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                        const data = await response.json();

                        // Calculate distances (simple approximation)
                        const processedHospitals = data.elements.map(h => {
                            const dist = calculateDistance(latitude, longitude, h.lat, h.lon);
                            return {
                                id: h.id,
                                name: h.tags.name || 'Unnamed Hospital',
                                phone: h.tags.phone || h.tags['contact:phone'] || h.tags.emergency_phone || null,
                                address: h.tags['addr:street'] ? `${h.tags['addr:street']} ${h.tags['addr:housenumber'] || ''}` : null,
                                lat: h.lat,
                                lon: h.lon,
                                distance: dist.toFixed(1)
                            };
                        }).sort((a, b) => a.distance - b.distance);

                        setHospitals(processedHospitals);
                    } catch (error) {
                        console.error('Error fetching hospitals:', error);
                        message.error('Failed to fetch nearby hospitals');
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    message.error('Unable to retrieve your location');
                    setLoading(false);
                }
            );
        };

        getNearbyHospitals();
    }, [message, calculateDistance]);

    const calculateDistance = React.useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    const deg2rad = (deg) => deg * (Math.PI / 180);

    const handleNavigate = (lat, lon) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card
            className="glass-card"
            title={<span style={{ color: 'white' }}><PlusSquareOutlined style={{ color: '#f5222d', marginRight: '10px' }} /> Nearby Emergency Care</span>}
            bodyStyle={{ padding: '0 24px 24px 24px' }}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                    <Spin tip="Searching for hospitals..." />
                </div>
            ) : hospitals.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={hospitals.slice(0, 5)}
                    renderItem={(hosp) => (
                        <List.Item
                            actions={[
                                hosp.phone && (
                                    <Button
                                        type="primary"
                                        icon={<PhoneOutlined />}
                                        href={`tel:${hosp.phone}`}
                                        size="small"
                                        shape="round"
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                    >
                                        Call
                                    </Button>
                                ),
                                <Button
                                    type="primary"
                                    icon={<CompassOutlined />}
                                    onClick={() => handleNavigate(hosp.lat, hosp.lon)}
                                    size="small"
                                    shape="round"
                                >
                                    Navigate
                                </Button>
                            ]}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}
                        >
                            <List.Item.Meta
                                avatar={<EnvironmentOutlined style={{ color: '#1890ff', fontSize: '20px', marginTop: '4px' }} />}
                                title={<Text strong style={{ color: 'white' }}>{hosp.name}</Text>}
                                description={
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <Text type="secondary" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                            {hosp.distance} km away {hosp.address ? `• ${hosp.address}` : ''}
                                        </Text>
                                        {hosp.phone && (
                                            <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                                                <PhoneOutlined style={{ fontSize: '10px' }} /> {hosp.phone}
                                            </Text>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span style={{ color: 'rgba(255,255,255,0.5)' }}>No hospitals found nearby</span>}
                    style={{ padding: '20px 0' }}
                />
            )}
            {hospitals.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <Text type="secondary" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                        Powered by OpenStreetMap Data
                    </Text>
                </div>
            )}
        </Card>
    );
};

export default NearbyHospitals;
