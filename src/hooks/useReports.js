import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

/**
 * Custom hook for fetching dashboard cards
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useDashboardCards() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getDashboardCards();

            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch dashboard cards');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching complete dashboard statistics
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getDashboard();

            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch dashboard');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching top offers
 * @param {Object} params - Query parameters
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useTopOffers(params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getTopOffers(params);

            if (response.success) {
                setData(response.data || []);
            } else {
                setError('Failed to fetch top offers');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching performance chart data
 * @param {Object} params - Query parameters
 * @returns {Object} - { data, loading, error, refetch }
 */
export function usePerformance(params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getPerformance(params);

            if (response.success) {
                setData(response.data || []);
            } else {
                setError('Failed to fetch performance data');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching top affiliates
 * @param {Object} params - Query parameters
 * @returns {Object} - { data, totalConversions, loading, error, refetch }
 */
export function useTopAffiliates(params = {}) {
    const [data, setData] = useState([]);
    const [totalConversions, setTotalConversions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getTopAffiliates(params);

            if (response.success) {
                setData(response.data || []);
                setTotalConversions(response.total_conversions || 0);
            } else {
                setError('Failed to fetch top affiliates');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { data, totalConversions, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching info cards
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useInfoCards() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getInfoCards();

            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch info cards');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching top countries
 * @param {Object} params - Query parameters
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useTopCountries(params = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getTopCountries(params);

            if (response.success) {
                setData(response.data || []);
            } else {
                setError('Failed to fetch top countries');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching summary reports
 * @param {Object} filters - Filter parameters
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useSummaryReport(filters = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getSummary(filters);

            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to fetch summary');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(filters)]);

    return { data, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching detailed reports with pagination
 * @param {Object} filters - Filter parameters
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} - { data, pagination, loading, error, refetch }
 */
export function useDetailedReport(filters = {}, page = 1, limit = 50) {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getDetailed({
                ...filters,
                page,
                limit
            });

            if (response.success) {
                setData(response.data);
                setPagination(response.pagination);
            } else {
                setError('Failed to fetch detailed report');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(filters), page, limit]);

    return { data, pagination, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching publisher conversion statistics
 * @param {Object} params - Query parameters
 * @returns {Object} - { stats, summary, loading, error, refetch }
 */
export function usePublisherConversions(params = {}) {
    const [stats, setStats] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardAPI.getPublisherConversions(params);

            if (response.success) {
                setStats(response.data?.stats || []);
                setSummary(response.data?.summary || null);
            } else {
                setError('Failed to fetch publisher conversions');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(params)]);

    return { stats, summary, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching all dashboard data in parallel
 * @returns {Object} - { cards, dashboard, topOffers, performance, topAffiliates, infoCards, topCountries, loading, error, refetch }
 */
export function useAllDashboardData() {
    const [cards, setCards] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [topOffers, setTopOffers] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [topAffiliates, setTopAffiliates] = useState([]);
    const [infoCards, setInfoCards] = useState(null);
    const [topCountries, setTopCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                cardsRes,
                dashboardRes,
                topOffersRes,
                performanceRes,
                topAffiliatesRes,
                infoCardsRes,
                topCountriesRes
            ] = await Promise.all([
                dashboardAPI.getDashboardCards(),
                dashboardAPI.getDashboard(),
                dashboardAPI.getTopOffers(),
                dashboardAPI.getPerformance(),
                dashboardAPI.getTopAffiliates(),
                dashboardAPI.getInfoCards(),
                dashboardAPI.getTopCountries()
            ]);

            if (cardsRes.success) setCards(cardsRes.data);
            if (dashboardRes.success) setDashboard(dashboardRes.data);
            if (topOffersRes.success) setTopOffers(topOffersRes.data || []);
            if (performanceRes.success) setPerformance(performanceRes.data || []);
            if (topAffiliatesRes.success) setTopAffiliates(topAffiliatesRes.data || []);
            if (infoCardsRes.success) setInfoCards(infoCardsRes.data);
            if (topCountriesRes.success) setTopCountries(topCountriesRes.data || []);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        cards,
        dashboard,
        topOffers,
        performance,
        topAffiliates,
        infoCards,
        topCountries,
        loading,
        error,
        refetch: fetchData
    };
}
