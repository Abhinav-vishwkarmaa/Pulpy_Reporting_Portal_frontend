// const BASE_URL = 'http://77.237.247.50:5001';
const BASE_URL = 'http://localhost:5001';

// Get token from localStorage
const getToken = () => {
    const user = localStorage.getItem('bng_user');
    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            return parsedUser.token;
        } catch (e) {
            return null;
        }
    }
    return null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const url = `${BASE_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
};

// Dashboard API
export const dashboardAPI = {
    // Main dashboard data (KPI cards)
    getDashboard: async () => {
        return apiRequest('/api/admin/reports/dashboard');
    },
    // Top offers with conversions
    getTopOffers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/dashboard/top-offers?${queryString}`);
    },
    // Performance chart data
    getPerformance: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/dashboard/performance?${queryString}`);
    },
    // Top affiliates chart
    getTopAffiliates: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/dashboard/top-affiliates?${queryString}`);
    },
    // Info cards data
    getInfoCards: async () => {
        return apiRequest('/api/admin/reports/dashboard/info-cards');
    },
    // Top countries
    getTopCountries: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/dashboard/top-countries?${queryString}`);
    },
    // Legacy endpoints (keeping for backward compatibility)
    getSummary: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/summary?${queryString}`);
    },
    getDetailed: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/detailed?${queryString}`);
    },
    getPublisherConversions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/reports/publisher-conversions?${queryString}`);
    },
};

// Offers API
export const offersAPI = {
    getOffers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/offers?${queryString}`);
    },
    getOffer: async (id) => {
        return apiRequest(`/api/admin/offers/${id}`);
    },
    createOffer: async (data) => {
        return apiRequest('/api/admin/offers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    updateOffer: async (id, data) => {
        return apiRequest(`/api/admin/offers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    updateOfferStatus: async (id, status) => {
        return apiRequest(`/api/admin/offers/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};

// Publishers API
export const publishersAPI = {
    getPublishers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/publishers?${queryString}`);
    },
    getPublisher: async (id) => {
        return apiRequest(`/api/admin/publishers/${id}`);
    },
    createPublisher: async (data) => {
        return apiRequest('/api/admin/publishers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    updatePublisher: async (id, data) => {
        return apiRequest(`/api/admin/publishers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    deletePublisher: async (id) => {
        return apiRequest(`/api/admin/publishers/${id}`, {
            method: 'DELETE',
        });
    },
};

// Advertisers API
export const advertisersAPI = {
    getAdvertisers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/advertisers?${queryString}`);
    },
    getAdvertiser: async (id) => {
        return apiRequest(`/api/admin/advertisers/${id}`);
    },
    createAdvertiser: async (data) => {
        return apiRequest('/api/admin/advertisers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    updateAdvertiser: async (id, data) => {
        return apiRequest(`/api/admin/advertisers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    deleteAdvertiser: async (id) => {
        return apiRequest(`/api/admin/advertisers/${id}`, {
            method: 'DELETE',
        });
    },
};

// Assignments API
export const assignmentsAPI = {
    getAssignments: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/api/admin/assignments?${queryString}`);
    },
    getAssignment: async (id) => {
        return apiRequest(`/api/admin/assignments/${id}`);
    },
    createOrUpdateAssignments: async (data) => {
        return apiRequest('/api/admin/assignments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    getTrackingUrl: async (id) => {
        return apiRequest(`/api/admin/assignments/${id}/tracking-url`);
    },
};

export default {
    authAPI,
    dashboardAPI,
    offersAPI,
    publishersAPI,
    advertisersAPI,
    assignmentsAPI,
};

