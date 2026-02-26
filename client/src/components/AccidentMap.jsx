import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon not showing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom icon for Police
const PoliceIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const AccidentMap = ({ reports, policePatrols = [] }) => {
    // Default center (Bangalore/Generic approx)
    const defaultCenter = [12.9716, 77.5946];

    // Filter reports that have coordinates
    const validReports = reports.filter(r => r.coordinates && r.coordinates.lat);

    return (
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%', borderRadius: '12px', zIndex: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Accident Markers (Red default) */}
            {validReports.map(report => (
                <Marker
                    key={report._id}
                    position={[report.coordinates.lat, report.coordinates.lng]}
                >
                    <Popup>
                        <div style={{ color: '#000' }}>
                            <strong>Vehicle: {report.vehicleNo || 'Unknown'}</strong><br />
                            Severity: <span style={{ color: report.severity === 'Critical' ? 'red' : 'inherit' }}>{report.severity}</span><br />
                            Time: {new Date(report.timestamp).toLocaleString()}
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Police Patrol Markers (Blue) */}
            {/* {policePatrols.map((patrol, idx) => (
                <Marker
                    key={`patrol-${patrol.userId}-${idx}`}
                    position={[patrol.lat, patrol.lng]}
                    icon={PoliceIcon}
                >
                    <Popup>
                        <div style={{ color: '#000' }}>
                            <strong>👮 Active Patrol</strong><br />
                            ID: {patrol.userId}<br />
                            Status: On Duty
                        </div>
                    </Popup>
                </Marker>
            ))} */}
        </MapContainer>
    );
};

export default AccidentMap;
