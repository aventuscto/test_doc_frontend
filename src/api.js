import axios from 'axios';

// Create separate API clients for each microservice
const userAPI = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://user-api.aventusinformatics.in'
        : 'http://localhost:8001',
});

const documentAPI = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://doc-api.aventusinformatics.in'
        : 'http://localhost:8002',
});

// Add token interceptor to both APIs
[userAPI, documentAPI].forEach(api => {
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
});

// Export both APIs and a helper object
export { userAPI, documentAPI };

// Default export for backward compatibility (uses documentAPI for documents)
export default documentAPI;
