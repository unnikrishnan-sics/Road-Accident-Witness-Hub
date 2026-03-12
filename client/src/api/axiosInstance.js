import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api', // Use env var with fallback
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor to add Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor to handle Globals (like 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// Example of how to use the specific AI timeout (this part is illustrative and not added to the axiosInstance config directly)
// async function analyzeReport(formData) {
//     const res = await axiosInstance.post('/reports/analyze', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         timeout: 120000 // Increased to 2 minutes for AI analysis
//     });
//     return res.data;
// }
