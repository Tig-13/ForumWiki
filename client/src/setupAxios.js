import axios from 'axios';

const setupAxios = (setErrorMessage) => {
    axios.interceptors.request.use(
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

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Unauthorized access. Please login again.");
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxios;
