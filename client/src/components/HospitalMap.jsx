import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Spin, Typography } from 'antd';
import { PlusSquareOutlined, CarOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';

const { Text } = Typography;

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom icon for Police (Blue)
const PoliceIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for Hospitals (Red)
const HospitalIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map center updates
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const HospitalMap = ({ showPatrols = false }) => {
    const [hospitals, setHospitals] = useState([]);
    const [policePatrols, setPolicePatrols] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // Default center

    useEffect(() => {
        const fetchHospitals = async (lat, lon) => {
            setLoading(true);
            try {
                const query = `
                    [out:json];
                    (
                      node["amenity"="hospital"](around:10000,${lat},${lon});
                      way["amenity"="hospital"](around:10000,${lat},${lon});
                      relation["amenity"="hospital"](around:10000,${lat},${lon});
                    );
                    out center;
                `;
                const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                const data = await response.json();

                const processed = data.elements.map(h => {
                    const hLat = h.lat || (h.center && h.center.lat);
                    const hLon = h.lon || (h.center && h.center.lon);
                    if (!hLat || !hLon) return null;

                    return {
                        id: h.id,
                        name: h.tags.name || 'Unnamed Hospital',
                        lat: hLat,
                        lon: hLon,
                        isEmergency: h.tags.emergency === 'yes',
                        phone: h.tags.phone || h.tags['contact:phone'] || null
                    };
                }).filter(h => h !== null && h.name !== 'Unnamed Hospital');

                setHospitals(processed);
            } catch (error) {
                console.error('Error fetching hospitals for map:', error);
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const loc = [latitude, longitude];
                    setUserLocation(loc);
                    fetchHospitals(latitude, longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    fetchHospitals(userLocation[0], userLocation[1]);
                }
            );
        } else {
            fetchHospitals(userLocation[0], userLocation[1]);
        }

        // Socket for live patrols if enabled
        if (showPatrols) {
            const socket = io('http://localhost:5001');
            socket.on('patrol_update', (patrols) => {
                setPolicePatrols(patrols);
            });
            return () => socket.disconnect();
        }
    }, [showPatrols]);

    return (
        <div style={{ position: 'relative', height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Spin spinning={loading} tip="Mapping nearby hospitals..." style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
            }}>
                <div style={{ height: '500px', width: '100%' }}>
                    <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                        <ChangeView center={userLocation} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* User Location Marker (Gray/Standard) */}
                        <Marker position={userLocation}>
                            <Popup>
                                <div style={{ color: '#000' }}>
                                    <strong>You are here</strong>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Police Patrol Markers (Blue) */}
                        {showPatrols && policePatrols.map((patrol, idx) => (
                            <Marker
                                key={`patrol-${patrol.userId}-${idx}`}
                                position={[patrol.lat, patrol.lng]}
                                icon={PoliceIcon}
                            >
                                <Popup>
                                    <div style={{ color: '#000' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                            <CarOutlined style={{ color: '#1890ff' }} />
                                            <strong>Active Police Patrol</strong>
                                        </div>
                                        <div style={{ color: '#1890ff', fontSize: '11px' }}>REAL-TIME TRACKING ACTIVE</div>
                                        <div style={{ marginTop: '5px' }}>Status: On Duty</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Hospital Markers (Red) */}
                        {hospitals.map(h => (
                            <Marker
                                key={h.id}
                                position={[h.lat, h.lon]}
                                icon={HospitalIcon}
                            >
                                <Popup>
                                    <div style={{ color: '#000' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                            <PlusSquareOutlined style={{ color: '#f5222d' }} />
                                            <strong>{h.name}</strong>
                                        </div>
                                        {h.isEmergency && (
                                            <div style={{ color: 'red', fontWeight: 'bold', fontSize: '11px', marginBottom: '5px' }}>
                                                🚨 EMERGENCY SERVICE AVAILABLE
                                            </div>
                                        )}
                                        {h.phone && <div>📞 {h.phone}</div>}
                                        <div style={{ marginTop: '10px' }}>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#1890ff', fontWeight: 'bold' }}
                                            >
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </Spin>
        </div>
    );
};

export default HospitalMap;
