import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Spin, Empty, App, Tag, Flex } from 'antd';
import { EnvironmentOutlined, CompassOutlined, PlusSquareOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NearbyHospitals = () => {
    const { message } = App.useApp();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);

    const deg2rad = (deg) => deg * (Math.PI / 180);

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
                        // Overpass API query for hospitals (nodes, ways, and relations) within 10km
                        const query = `
                            [out:json];
                            (
                              node["amenity"="hospital"](around:10000,${latitude},${longitude});
                              way["amenity"="hospital"](around:10000,${latitude},${longitude});
                              relation["amenity"="hospital"](around:10000,${latitude},${longitude});
                            );
                            out center;
                        `;
                        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

                        if (!response.ok) {
                            if (response.status === 429) {
                                message.warning('Hospital search is temporarily rate-limited. Please try again in active a few moments.');
                                throw new Error('Rate limit exceeded');
                            }
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();

                        // Calculate distances
                        const processedHospitals = data.elements.map(h => {
                            const lat = h.lat || (h.center && h.center.lat);
                            const lon = h.lon || (h.center && h.center.lon);

                            if (!lat || !lon) return null;

                            const dist = calculateDistance(latitude, longitude, lat, lon);
                            const isEmergency = h.tags.emergency === 'yes';

                            return {
                                id: h.id,
                                name: h.tags.name || 'Unnamed Hospital',
                                phone: h.tags.phone || h.tags['contact:phone'] || h.tags.emergency_phone || null,
                                address: h.tags['addr:street'] ? `${h.tags['addr:street']} ${h.tags['addr:housenumber'] || ''}` : h.tags['addr:full'] || 'Address not available',
                                lat,
                                lon,
                                distance: dist.toFixed(1),
                                isEmergency
                            };
                        })
                            .filter(h => h !== null && h.name !== 'Unnamed Hospital') // Filter out nameless points
                            .sort((a, b) => {
                                // Sort by emergency status first, then by distance
                                if (a.isEmergency && !b.isEmergency) return -1;
                                if (!a.isEmergency && b.isEmergency) return 1;
                                return a.distance - b.distance;
                            });

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

    const handleNavigate = (lat, lon) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card
            className="glass-card"
            title={<span style={{ color: 'white' }}><PlusSquareOutlined style={{ color: '#f5222d', marginRight: '10px' }} /> Nearby Emergency Care</span>}
            styles={{ body: { padding: '0 24px 24px 24px' } }}
        >
            <Spin spinning={loading} tip="Searching for hospitals...">
                {hospitals.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                        {hospitals.map((item, index) => (
                            <div key={index} style={{
                                padding: '16px 0',
                                borderBottom: index !== hospitals.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'white', fontSize: '16px' }}>{item.name}</span>
                                        {item.isEmergency && (
                                            <Tag color="error" style={{ fontSize: '10px', padding: '0 4px', lineHeight: '18px' }}>EMERGENCY</Tag>
                                        )}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>
                                        <EnvironmentOutlined style={{ marginRight: '5px' }} /> {item.address}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>
                                        {item.distance} km away
                                    </div>
                                    {item.phone && (
                                        <div style={{ color: '#1890ff', fontSize: '14px' }}>
                                            <PhoneOutlined style={{ marginRight: '5px' }} /> {item.phone}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginLeft: '16px' }}>
                                    <Button
                                        type="primary"
                                        icon={<EnvironmentOutlined />}
                                        onClick={() => handleNavigate(item.lat, item.lon)}
                                        shape="round"
                                        style={{
                                            backgroundColor: '#1890ff',
                                            borderColor: '#1890ff',
                                            boxShadow: '0 4px 10px rgba(24,144,255,0.3)',
                                            marginBottom: '8px',
                                            display: 'block',
                                            width: '100%'
                                        }}
                                    >
                                        Navigate
                                    </Button>
                                    {item.phone && (
                                        <Button
                                            icon={<PhoneOutlined />}
                                            href={`tel:${item.phone}`}
                                            shape="round"
                                            style={{
                                                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                                                borderColor: '#52c41a',
                                                color: '#52c41a',
                                                width: '100%'
                                            }}
                                        >
                                            Call
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span style={{ color: 'rgba(255,255,255,0.5)' }}>No hospitals found nearby</span>}
                        style={{ padding: '20px 0' }}
                    />
                )}
            </Spin>
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
