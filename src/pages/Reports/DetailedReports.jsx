import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

function DetailedReports() {
    const toast = useToast();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
    
    // Filters
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [offerFilter, setOfferFilter] = useState('all');
    const [publisherFilter, setPublisherFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch offers and publishers for filters
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

    // Fetch reports data
    useEffect(() => {
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

                const response = await dashboardAPI.getDetailed(params);
                if (response.success) {
                    setReports(response.data || []);
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

        fetchReports();
    }, [pagination.page, pagination.limit, dateFrom, dateTo, offerFilter, publisherFilter, statusFilter]);

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.offer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.publisher_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.publisher_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.click_uuid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.conversion_uuid && report.conversion_uuid.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const formatCurrency = (amount) => {
        if (!amount) return '-';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const getStatusBadge = (status) => {
        if (!status) return <span className="report-status no-conversion">No Conversion</span>;
        const statusClass = status.toLowerCase();
        return <span className={`report-status ${statusClass}`}>{status}</span>;
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            
            // Fetch tracking URLs for all reports that have offer_id and publisher_id
            const reportsWithTracking = await Promise.all(
                filteredReports.map(async (report) => {
                    let trackingUrl = '';
                    if (report.offer_id && report.publisher_id) {
                        try {
                            // Try to get assignment ID first, then tracking URL
                            // Since we don't have assignment_id in the report, we'll construct a basic tracking URL
                            // or try to fetch from assignments API
                            const assignmentsResponse = await assignmentsAPI.getAssignments({
                                offer_id: report.offer_id,
                                publisher_id: report.publisher_id
                            });
                            
                            if (assignmentsResponse.success && assignmentsResponse.data && assignmentsResponse.data.length > 0) {
                                const assignment = assignmentsResponse.data[0];
                                if (assignment.id) {
                                    const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.id);
                                    if (trackingResponse.success) {
                                        trackingUrl = trackingResponse.data.tracking_url || '';
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching tracking URL for offer ${report.offer_id}, publisher ${report.publisher_id}:`, err);
                        }
                    }
                    return { ...report, tracking_url: trackingUrl };
                })
            );

            // Prepare CSV headers
            const headers = [
                'Click ID',
                'Click UUID',
                'Offer ID',
                'Offer Name',
                'Publisher ID',
                'Publisher Email',
                'Publisher Company',
                'IP Address',
                'User Agent',
                'Device Type',
                'Browser',
                'OS',
                'Click Timestamp',
                'Conversion ID',
                'Conversion UUID',
                'Conversion Status',
                'Conversion Amount',
                'Conversion Payout',
                'Conversion Timestamp',
                'Tracking URL'
            ];

            // Prepare CSV rows
            const rows = reportsWithTracking.map(report => [
                report.click_id || '',
                report.click_uuid || '',
                report.offer_id || '',
                report.offer_name || '',
                report.publisher_id || '',
                report.publisher_email || '',
                report.publisher_company || '',
                report.ip || '',
                report.user_agent || '',
                report.device_type || '',
                report.browser || '',
                report.os || '',
                report.click_timestamp || '',
                report.conversion_id || '',
                report.conversion_uuid || '',
                report.conversion_status || 'No Conversion',
                report.conversion_amount || '',
                report.conversion_payout || '',
                report.conversion_timestamp || '',
                report.tracking_url || ''
            ]);

            // Convert to CSV format
            const csvContent = [
                headers.join(','),
                ...rows.map(row => 
                    row.map(cell => {
                        // Escape commas and quotes in cell values
                        const cellValue = String(cell || '').replace(/"/g, '""');
                        return `"${cellValue}"`;
                    }).join(',')
                )
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            // Generate filename with current date
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `detailed-reports-${dateStr}.csv`;
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success(`Exported ${reportsWithTracking.length} records to ${filename}`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export reports');
        } finally {
            setLoading(false);
        }
    };

    if (loading && reports.length === 0) {
        return (
            <div className="reports-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div className="reports-header-left">
                    <h1>Detailed Reports</h1>
                    <p>View detailed click and conversion reports</p>
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    <DownloadIcon />
                    Export
                </button>
            </div>

            <div className="reports-filters">
                <div className="reports-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search by offer, publisher, click ID, conversion ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <input
                    type="date"
                    className="form-control"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="Date From"
                />
                <input
                    type="date"
                    className="form-control"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="Date To"
                />
                <select
                    className="form-control reports-filter-select"
                    value={offerFilter}
                    onChange={(e) => setOfferFilter(e.target.value)}
                >
                    <option value="all">All Offers</option>
                    {offers.map(offer => (
                        <option key={offer.id} value={offer.id}>{offer.name}</option>
                    ))}
                </select>
                <select
                    className="form-control reports-filter-select"
                    value={publisherFilter}
                    onChange={(e) => setPublisherFilter(e.target.value)}
                >
                    <option value="all">All Publishers</option>
                    {publishers.map(publisher => (
                        <option key={publisher.id} value={publisher.id}>
                            {publisher.first_name} ({publisher.email})
                        </option>
                    ))}
                </select>
                <select
                    className="form-control reports-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="no-conversion">No Conversion</option>
                </select>
            </div>

            {error && (
                <div className="error-state" style={{ textAlign: 'center', padding: '20px', marginBottom: '20px', background: '#ffebee', borderRadius: '8px', color: '#F44336' }}>
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="reports-table-container">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Click ID</th>
                            <th>Offer</th>
                            <th>Publisher</th>
                            <th>IP Address</th>
                            <th>Device</th>
                            <th>Click Time</th>
                            <th>Conversion</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Payout</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="11" style={{ textAlign: 'center', padding: '40px' }}>
                                    No reports found
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => (
                                <tr key={report.click_id}>
                                    <td>
                                        <div className="report-id">{report.click_id}</div>
                                        <div className="report-uuid">{report.click_uuid?.substring(0, 8)}...</div>
                                    </td>
                                    <td>
                                        <div className="report-name">{report.offer_name || `Offer #${report.offer_id}`}</div>
                                    </td>
                                    <td>
                                        <div className="report-name">{report.publisher_email || `Publisher #${report.publisher_id}`}</div>
                                        <div className="report-email">{report.publisher_company || '-'}</div>
                                    </td>
                                    <td>{report.ip || '-'}</td>
                                    <td>
                                        <div>{report.device_type || '-'}</div>
                                        {report.browser && <div className="report-meta">{report.browser}</div>}
                                        {report.os && <div className="report-meta">{report.os}</div>}
                                    </td>
                                    <td>
                                        <div>{formatDate(report.click_timestamp)}</div>
                                    </td>
                                    <td>
                                        {report.conversion_id ? (
                                            <div>
                                                <div className="report-id">{report.conversion_id}</div>
                                                <div className="report-uuid">{report.conversion_uuid?.substring(0, 8)}...</div>
                                                {report.conversion_timestamp && (
                                                    <div className="report-meta">{formatDate(report.conversion_timestamp)}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="report-meta">-</span>
                                        )}
                                    </td>
                                    <td>{getStatusBadge(report.conversion_status)}</td>
                                    <td>{formatCurrency(report.conversion_amount)}</td>
                                    <td>{formatCurrency(report.conversion_payout)}</td>
                                    <td>
                                        <div className="reports-actions">
                                            <button
                                                className="reports-action-btn"
                                                title="View Details"
                                                onClick={() => navigate(`/offer/detail/${report.offer_id}`)}
                                            >
                                                <EyeIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
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
            )}
        </div>
    );
}

export default DetailedReports;

