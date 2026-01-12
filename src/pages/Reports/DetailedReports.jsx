import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { dashboardAPI, offersAPI, publishersAPI, assignmentsAPI } from '../../services/api';
import './Reports.css';

// Icons
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const FilterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const AVAILABLE_DIMENSIONS = [
    { id: 'offer_id', label: 'Offer' },
    { id: 'publisher_id', label: 'Affiliate' },
    { id: 'advertiser_id', label: 'Advertiser' },
    { id: 'date', label: 'Date' },
    { id: 'hour', label: 'Hour' },
    { id: 'ip', label: 'IP Address' },
    { id: 'country', label: 'Country' },
    { id: 'isp', label: 'ISP' },
    { id: 'city', label: 'City' },
    { id: 'region', label: 'Region' },
    { id: 'tid', label: 'TID' },
    { id: 'user_agent', label: 'User Agent' },
    { id: 'domain', label: 'Domain' },
    { id: 'device_type', label: 'Device Type' },
    { id: 'os', label: 'OS' },
    { id: 'browser', label: 'Browser' },
    { id: 'click_uuid', label: 'Click UUID' },
    { id: 'rcid', label: 'RCID' },
    { id: 'referer', label: 'Referer' }
];

const AVAILABLE_METRICS = [
    { id: 'clicks', label: 'Clicks' },
    { id: 'unique_clicks', label: 'Unique Clicks' },
    { id: 'impressions', label: 'Impressions' },
    { id: 'conversions', label: 'Conversions' },
    { id: 'revenue', label: 'Offer Price' },
    { id: 'payout', label: 'Payout' },
    { id: 'profit', label: 'Profit' }
];

function DetailedReports() {
    const toast = useToast();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAggregated, setIsAggregated] = useState(false);

    // Initial state from URL params
    const [pagination, setPagination] = useState({
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50'),
        total: 0,
        totalPages: 1
    });

    const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '');
    const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '');
    const [offerFilter, setOfferFilter] = useState(searchParams.get('offer_id') || 'all');
    const [publisherFilter, setPublisherFilter] = useState(searchParams.get('publisher_id') || 'all');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // Checkbox selections
    const initialDims = searchParams.get('groupBy') ? searchParams.get('groupBy').split(',') : [];
    const initialMetrics = searchParams.get('metrics') ? searchParams.get('metrics').split(',') : ['clicks', 'conversions', 'revenue'];

    // If URL has no group params, default to Detailed View (empty group)
    const [selectedDims, setSelectedDims] = useState(initialDims);
    const [selectedMetrics, setSelectedMetrics] = useState(initialMetrics);

    const [showFilters, setShowFilters] = useState(true);

    // Fetch filter options
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [offersRes, publishersRes] = await Promise.all([
                    offersAPI.getOffers({ limit: 100 }),
                    publishersAPI.getPublishers({ limit: 100 })
                ]);
                if (offersRes.success) setOffers(offersRes.data);
                if (publishersRes.success) setPublishers(publishersRes.data);
            } catch (err) {
                console.error('Error fetching filter data:', err);
            }
        };
        fetchData();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;
            if (offerFilter !== 'all') params.offer_id = offerFilter;
            if (publisherFilter !== 'all') params.publisher_id = publisherFilter;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (searchTerm) params.search = searchTerm;

            // Grouping Logic
            if (selectedDims.length > 0) {
                params.groupBy = selectedDims.join(',');
                // If specific metrics selected, backend needs to support limiting metrics or we filter on frontend?
                // For now, backend returns ALL metrics if aggregated. We can filter display on frontend.
            }
            // If No GroupBy, DetailedReports returns specific columns.

            // Sync URL
            const urlParams = new URLSearchParams();
            urlParams.set('page', params.page);
            urlParams.set('limit', params.limit);
            if (dateFrom) urlParams.set('date_from', dateFrom);
            if (dateTo) urlParams.set('date_to', dateTo);
            if (offerFilter !== 'all') urlParams.set('offer_id', offerFilter);
            if (publisherFilter !== 'all') urlParams.set('publisher_id', publisherFilter);
            if (statusFilter !== 'all') urlParams.set('status', statusFilter);
            if (searchTerm) urlParams.set('search', searchTerm);
            if (selectedDims.length > 0) urlParams.set('groupBy', selectedDims.join(','));
            if (selectedMetrics.length > 0) urlParams.set('metrics', selectedMetrics.join(','));
            setSearchParams(urlParams);

            const response = await dashboardAPI.getDetailed(params);
            if (response.success) {
                setReports(response.data || []);
                setIsAggregated(response.isAggregated || false);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                setError('Failed to load reports');
            }
        } catch (err) {
            console.error('Reports fetch error:', err);
            setError(err.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchReports();
    }, [pagination.page, pagination.limit]);

    const handleApply = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchReports();
    };

    const handleDimChange = (id) => {
        setSelectedDims(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id);
            return [...prev, id];
        });
    };

    const handleMetricChange = (id) => {
        setSelectedMetrics(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id);
            return [...prev, id];
        });
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '-';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const formatDate = (dateString, dim) => {
        if (!dateString) return '-';
        if (dim === 'hour') return `${dateString}:00`;
        if (dim === 'date') return new Date(dateString).toLocaleDateString();
        try {
            return new Date(dateString).toLocaleString();
        } catch (e) { return dateString; }
    };

    const getStatusBadge = (status) => {
        if (!status) return null;
        const statusClass = status.toLowerCase();
        return <span className={`report-status ${statusClass}`}>{status}</span>;
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleExport = async () => {
        try {
            toast.info('Preparing export...');

            const params = new URLSearchParams();
            if (dateFrom) params.set('date_from', dateFrom);
            if (dateTo) params.set('date_to', dateTo);
            if (offerFilter !== 'all') params.set('offer_id', offerFilter);
            if (publisherFilter !== 'all') params.set('publisher_id', publisherFilter);
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (searchTerm) params.set('search', searchTerm);
            if (selectedDims.length > 0) params.set('groupBy', selectedDims.join(','));
            if (selectedMetrics.length > 0) params.set('columns', selectedMetrics.join(','));

            params.set('export', 'csv');

            // Direct download link logic
            // We use fetch with blob to handle auth headers if needed, or just window.open if cookies usage
            // Since we use Bearer token, we must use fetch

            const token = localStorage.getItem('bng_user') ? JSON.parse(localStorage.getItem('bng_user')).token : null;

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/reports/detailed?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast.success('Export downloaded!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    // Dynamic Columns Helper
    const tableColumns = useMemo(() => {
        if (isAggregated) {
            const cols = [];
            // Dimensions first - order matters based on selection
            // We want to sort dimensions based on AVAILABLE_DIMENSIONS order for consistency
            AVAILABLE_DIMENSIONS.forEach(dim => {
                if (selectedDims.includes(dim.id)) {
                    cols.push({ id: dim.id === 'date' ? 'date_group' : (dim.id === 'hour' ? 'hour_group' : dim.id), label: dim.label });
                }
            });

            // Metrics
            AVAILABLE_METRICS.forEach(metric => {
                if (selectedMetrics.includes(metric.id)) {
                    cols.push({ id: metric.id, label: metric.label });
                }
            });
            return cols;
        } else {
            // Detailed View Columns
            return [
                { id: 'click_uuid', label: 'Click UUID' },
                { id: 'offer_name', label: 'Offer' },
                { id: 'publisher_company', label: 'Affiliate' },
                { id: 'ip', label: 'IP' },
                { id: 'country', label: 'Country' },
                { id: 'device_type', label: 'Device' },
                { id: 'click_created_at', label: 'Time' },
                { id: 'conversion_status', label: 'Status' },
                { id: 'conversion_amount', label: 'Revenue' },
                { id: 'conversion_payout', label: 'Payout' }
            ];
        }
    }, [isAggregated, selectedDims, selectedMetrics]);

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div className="reports-header-left">
                    <h1>Detailed Reports</h1>
                    <p>Customizable performance reports</p>
                </div>
                <div className="reports-header-actions">
                    <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
                        <FilterIcon /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button className="btn btn-primary" onClick={handleExport}>
                        <DownloadIcon /> Export CSV
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="reports-options-panel">
                    <div className="filters-row">
                        <div className="filter-group">
                            <label>Date Range</label>
                            <div className="date-inputs">
                                <input type="date" className="form-control" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                                <span className="separator">to</span>
                                <input type="date" className="form-control" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Offer</label>
                            <select className="form-control" value={offerFilter} onChange={e => setOfferFilter(e.target.value)}>
                                <option value="all">All Offers</option>
                                {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Affiliate</label>
                            <select className="form-control" value={publisherFilter} onChange={e => setPublisherFilter(e.target.value)}>
                                <option value="all">All Affiliates</option>
                                {publishers.map(p => <option key={p.id} value={p.id}>{p.company_name} ({p.email})</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Search</label>
                            <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div className="columns-grid-container">
                        <div className="columns-section">
                            <h4>Dimensions (Group By)</h4>
                            <div className="checkbox-grid">
                                {AVAILABLE_DIMENSIONS.map(dim => (
                                    <label key={dim.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedDims.includes(dim.id)}
                                            onChange={() => handleDimChange(dim.id)}
                                        />
                                        {dim.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="columns-section">
                            <h4>Metrics</h4>
                            <div className="checkbox-grid">
                                {AVAILABLE_METRICS.map(metric => (
                                    <label key={metric.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedMetrics.includes(metric.id)}
                                            onChange={() => handleMetricChange(metric.id)}
                                        />
                                        {metric.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="btn btn-secondary" onClick={() => { setSelectedDims([]); setSelectedMetrics(['clicks', 'conversions', 'revenue']); }}>Reset</button>
                        <button className="btn btn-primary" onClick={handleApply} style={{ minWidth: '150px' }}>Apply Report</button>
                    </div>
                </div>
            )}

            <div className="reports-table-container">
                {loading ? (
                    <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <table className="reports-table">
                        <thead>
                            <tr>
                                {tableColumns.map(col => (
                                    <th key={col.id}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={tableColumns.length} style={{ textAlign: 'center', padding: '40px' }}>No data found</td>
                                </tr>
                            ) : (
                                reports.map((row, idx) => (
                                    <tr key={idx}>
                                        {tableColumns.map(col => {
                                            const val = row[col.id];
                                            if (['revenue', 'payout', 'profit', 'conversion_amount', 'conversion_payout'].includes(col.id)) return <td key={col.id}>{formatCurrency(val)}</td>;
                                            if (col.id === 'conversion_status') return <td key={col.id}>{getStatusBadge(val)}</td>;
                                            if (col.id === 'click_created_at') return <td key={col.id}>{formatDate(val)}</td>;
                                            if (col.id === 'date_group' || col.id === 'hour_group') {
                                                return <td key={col.id}>{val}</td>;
                                            }
                                            return <td key={col.id}>{val !== undefined && val !== null ? val : '-'}</td>;
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Pagination */}
            {
                pagination.totalPages > 1 && (
                    <div className="reports-pagination">
                        <button
                            className="btn btn-outline"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                        </span>
                        <button
                            className="btn btn-outline"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default DetailedReports;
