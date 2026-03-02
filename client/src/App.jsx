import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportAccident from './pages/ReportAccident';
import AdminDashboard from './pages/AdminDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import ReporterDashboard from './pages/ReporterDashboard';
import SafetyMap from './pages/SafetyMap';
import { ConfigProvider, App as AntdApp } from 'antd';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f5222d',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: 8,
                },
                components: {
                    Select: {
                        selectorBg: 'rgba(0, 0, 0, 0.25)',
                        colorText: 'white',
                        colorBorder: 'rgba(255, 255, 255, 0.1)',
                        optionSelectedBg: 'rgba(245, 34, 45, 0.2)',
                        optionActiveBg: 'rgba(255, 255, 255, 0.1)',
                        colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                        colorIcon: 'rgba(255, 255, 255, 0.5)',
                        colorIconHover: 'white',
                    },
                    Input: {
                        colorBgContainer: 'rgba(0, 0, 0, 0.25)',
                        colorText: 'white',
                        colorBorder: 'rgba(255, 255, 255, 0.1)',
                        colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                    },
                    Message: {
                        colorBgElevated: 'rgba(30, 30, 30, 0.9)',
                        colorText: 'white',
                    },
                    Modal: {
                        contentBg: '#1f1f1f',
                        headerBg: '#1f1f1f',
                        titleColor: 'white',
                        contentColor: 'white',
                        colorText: 'white',
                        colorIconHover: '#f5222d',
                    },
                    Table: {
                        colorBgContainer: 'transparent',
                        colorHeaderBg: 'rgba(0, 0, 0, 0.4)',
                        colorText: 'white',
                        colorTextHeading: 'white',
                        colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
                    },
                    Card: {
                        colorBgContainer: 'rgba(255, 255, 255, 0.03)',
                        colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
                        colorTextHeading: 'white',
                    }
                }
            }}
        >
            <AntdApp>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/report" element={<ReportAccident />} />
                        <Route path="/safety-map" element={<SafetyMap />} />

                        {/* Protected Routes */}
                        <Route
                            path="/admin/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/police/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <PoliceDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reporter/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <ReporterDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;
