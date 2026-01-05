import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            console.log("Attaching token:", user.token.substring(0, 10) + "...");
            config.headers['Authorization'] = 'Bearer ' + user.token;
        } else {
            console.warn("No token found in localStorage");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

api.updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
api.getBudgets = (month) => api.get(`/budgets`, { params: { month } });
api.setBudget = (data) => api.post(`/budgets`, data);

export default api;
