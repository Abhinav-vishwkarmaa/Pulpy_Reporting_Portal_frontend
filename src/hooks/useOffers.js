import { useState, useEffect, useCallback } from 'react';
import { offersAPI } from '../services/api';

/**
 * Hook to fetch offer details for editing
 * @param {string|number} id - The ID of the offer to fetch
 * @param {boolean} shouldFetch - Whether to fetch immediately (default: true)
 * @returns {Object} Data, loading state, error, and refetch function
 */
export const useOfferForEdit = (id, shouldFetch = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(shouldFetch);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await offersAPI.getOfferForEdit(id);
            if (response.success) {
                setData(response.data);
            } else {
                setError(response.message || 'Failed to fetch offer details');
            }
        } catch (err) {
            console.error(`Error fetching offer ${id} for edit:`, err);
            setError(err.message || 'An error occurred while fetching offer details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (shouldFetch && id) {
            fetchData();
        }
    }, [shouldFetch, fetchData, id]);

    return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch all offers with pagination and filtering
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} Offers data, loading state, error, pagination controls
 */
export const useOffers = (initialParams = {}) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await offersAPI.getOffers(params);
            if (response.success) {
                setData(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                setError(response.message || 'Failed to fetch offers');
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError(err.message || 'An error occurred while fetching offers');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateParams = (newParams) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    return { data, pagination, loading, error, refetch: fetchData, updateParams };
};

export default {
    useOfferForEdit,
    useOffers
};
