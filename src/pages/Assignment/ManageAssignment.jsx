import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { assignmentsAPI, offersAPI, publishersAPI } from '../../services/api';
import './Assignment.css';

// Icons
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
);

function ManageAssignment() {
    const toast = useToast();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [offerFilter, setOfferFilter] = useState('all');
    const [publisherFilter, setPublisherFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [trackingUrls, setTrackingUrls] = useState({});
    const [loadingTrackingUrls, setLoadingTrackingUrls] = useState({});

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

    // Fetch assignments data
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    page: 1,
                    limit: 100
                };

                if (offerFilter !== 'all') {
                    params.offer_id = offerFilter;
                }
                if (publisherFilter !== 'all') {
                    params.publisher_id = publisherFilter;
                }
                if (statusFilter !== 'all') {
                    params.status = statusFilter;
                }

                const response = await assignmentsAPI.getAssignments(params);
                if (response.success) {
                    setAssignments(response.data);
                } else {
                    setError('Failed to load assignments');
                }
            } catch (err) {
                console.error('Assignments fetch error:', err);
                setError(err.message || 'Failed to load assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [offerFilter, publisherFilter, statusFilter]);

    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch =
            assignment.offer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.publisher_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.publisher_company?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleGetTrackingUrl = async (assignmentId) => {
        try {
            setLoadingTrackingUrls(prev => ({ ...prev, [assignmentId]: true }));
            const response = await assignmentsAPI.getTrackingUrl(assignmentId);
            if (response.success && response.data) {
                const trackingUrl = response.data.tracking_url || '';
                setTrackingUrls(prev => ({ ...prev, [assignmentId]: trackingUrl }));
                
                // Copy to clipboard
                if (trackingUrl) {
                    await navigator.clipboard.writeText(trackingUrl);
                    toast.success('Tracking URL copied to clipboard!');
                } else {
                    toast.error('No tracking URL available');
                }
            } else {
                toast.error('Failed to fetch tracking URL');
            }
        } catch (err) {
            console.error('Error fetching tracking URL:', err);
            toast.error('Failed to fetch tracking URL');
        } finally {
            setLoadingTrackingUrls(prev => ({ ...prev, [assignmentId]: false }));
        }
    };

    const handleCopyTrackingUrl = async (trackingUrl) => {
        try {
            await navigator.clipboard.writeText(trackingUrl);
            toast.success('Tracking URL copied to clipboard!');
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            toast.error('Failed to copy to clipboard');
        }
    };

    if (loading) {
        return (
            <div className="assignment-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading assignments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assignment-page">
                <div className="error-state" style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: '#F44336', marginBottom: '20px' }}>Error: {error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="assignment-page">
            <div className="assignment-header">
                <div className="assignment-header-left">
                    <h1>Manage Assignments</h1>
                    <p>View and manage offer-to-publisher assignments</p>
                </div>
                <Link to="/assignment/new" className="btn btn-primary">
                    <PlusIcon />
                    New Assignment
                </Link>
            </div>

            <div className="assignment-filters">
                <div className="assignment-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="form-control assignment-filter-select"
                    value={offerFilter}
                    onChange={(e) => setOfferFilter(e.target.value)}
                    style={{ minWidth: '150px' }}
                >
                    <option value="all">All Offers</option>
                    {offers.map(offer => (
                        <option key={offer.id} value={offer.id}>{offer.name}</option>
                    ))}
                </select>
                <select
                    className="form-control assignment-filter-select"
                    value={publisherFilter}
                    onChange={(e) => setPublisherFilter(e.target.value)}
                    style={{ minWidth: '150px' }}
                >
                    <option value="all">All Publishers</option>
                    {publishers.map(publisher => (
                        <option key={publisher.id} value={publisher.id}>
                            {publisher.first_name} ({publisher.email})
                        </option>
                    ))}
                </select>
                <select
                    className="form-control assignment-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ minWidth: '150px' }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="assignment-table-container">
                <table className="assignment-table">
                    <thead>
                        <tr>
                            <th>Offer</th>
                            <th>Publisher</th>
                            <th>Payout Override</th>
                            <th>Status</th>
                            <th>Assigned At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssignments.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                    No assignments found
                                </td>
                            </tr>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td>
                                        <div className="assignment-name">{assignment.offer_name || `Offer #${assignment.offer_id}`}</div>
                                        <div className="assignment-category">{assignment.offer_category || '-'}</div>
                                    </td>
                                    <td>
                                        <div className="assignment-name">{assignment.publisher_email || `Publisher #${assignment.publisher_id}`}</div>
                                        <div className="assignment-email">{assignment.publisher_company || '-'}</div>
                                    </td>
                                    <td>{assignment.payout_override ? `$${assignment.payout_override}` : '-'}</td>
                                    <td>
                                        <span className={`assignment-status ${assignment.status?.toLowerCase()}`}>
                                            {assignment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {assignment.assigned_at 
                                            ? new Date(assignment.assigned_at).toLocaleDateString()
                                            : '-'
                                        }
                                    </td>
                                    <td>
                                        <div className="assignment-actions">
                                            <button
                                                className="assignment-action-btn"
                                                title="View Details"
                                                onClick={() => navigate(`/assignment/edit/${assignment.id}`)}
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button
                                                className="assignment-action-btn"
                                                title="Edit"
                                                onClick={() => navigate(`/assignment/edit/${assignment.id}`)}
                                            >
                                                <EditIcon />
                                            </button>
                                            {trackingUrls[assignment.id] ? (
                                                <button
                                                    className="assignment-action-btn"
                                                    title="Copy Tracking URL"
                                                    onClick={() => handleCopyTrackingUrl(trackingUrls[assignment.id])}
                                                    style={{ color: '#4CAF50' }}
                                                >
                                                    <CopyIcon />
                                                </button>
                                            ) : (
                                                <button
                                                    className="assignment-action-btn"
                                                    title="Get Tracking URL"
                                                    onClick={() => handleGetTrackingUrl(assignment.id)}
                                                    disabled={loadingTrackingUrls[assignment.id]}
                                                    style={{ 
                                                        opacity: loadingTrackingUrls[assignment.id] ? 0.6 : 1,
                                                        cursor: loadingTrackingUrls[assignment.id] ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {loadingTrackingUrls[assignment.id] ? (
                                                        <span style={{ fontSize: '12px' }}>...</span>
                                                    ) : (
                                                        <LinkIcon />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageAssignment;

