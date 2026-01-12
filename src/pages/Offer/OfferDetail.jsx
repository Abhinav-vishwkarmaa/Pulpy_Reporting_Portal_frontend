import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { offersAPI, publishersAPI, assignmentsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { copyToClipboard as safeCopyToClipboard } from '../../utils/clipboard';
import './Offer.css';

const ArrowLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
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

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offer, setOffer] = useState(null);
    const [publishers, setPublishers] = useState([]);
    const [loadingPublishers, setLoadingPublishers] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [publisherAssignments, setPublisherAssignments] = useState([]);
    const [editingAssignmentIndex, setEditingAssignmentIndex] = useState(null);
    const [savingAssignments, setSavingAssignments] = useState(false);
    const [loadingTrackingUrls, setLoadingTrackingUrls] = useState({});

    // New states for granular data
    const [stats, setStats] = useState(null);
    const [dailyStats, setDailyStats] = useState([]);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await offersAPI.getOffer(id);
                if (response.success && response.data) {
                    setOffer(response.data);
                } else {
                    setError('Offer not found');
                }
            } catch (err) {
                console.error('Fetch offer error:', err);
                setError(err.message || 'Failed to load offer details');
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            if (!id) return;
            try {
                setLoadingStats(true);
                const [statsRes, dailyRes] = await Promise.all([
                    offersAPI.getOfferStats(id),
                    offersAPI.getOfferDailyStats(id)
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (dailyRes.success) setDailyStats(dailyRes.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (id) {
            fetchOfferDetails();
            fetchStats();
        }
    }, [id]);

    // Fetch publishers
    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                setLoadingPublishers(true);
                const response = await publishersAPI.getPublishers({ status: 'active', limit: 100 });
                if (response.success && response.data) {
                    setPublishers(response.data);
                }
            } catch (error) {
                console.error('Error fetching publishers:', error);
                toast.error('Failed to load publishers');
            } finally {
                setLoadingPublishers(false);
            }
        };

        fetchPublishers();
    }, [toast]);

    // Fetch assignments
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!id) return;
            try {
                setLoadingAssignments(true);
                const response = await assignmentsAPI.getAssignments({ offer_id: id });
                if (response.success && response.data) {
                    setAssignments(response.data);
                    // Initialize publisher assignments from existing assignments
                    const initialAssignments = await Promise.all(
                        response.data.map(async (assignment) => {
                            let trackingUrl = '';
                            if (assignment.id) {
                                try {
                                    const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.id);
                                    if (trackingResponse.success) {
                                        trackingUrl = trackingResponse.data.tracking_url;
                                    }
                                } catch (error) {
                                    console.error(`Error fetching tracking URL for assignment ${assignment.id}:`, error);
                                }
                            }
                            return {
                                publisher_id: assignment.publisher_id,
                                publisher_email: assignment.publisher_email,
                                payout_override: assignment.payout_override || '',
                                conversion_approval_percentage: assignment.conversion_approval_percentage || '',
                                capping_budget: assignment.capping_budget || { duration: 'day', amount: '' },
                                capping_conversions: assignment.capping_conversions || { duration: 'day', amount: '' },
                                callback_url: assignment.callback_url || '',
                                offer_url: assignment.offer_url || '',
                                notes: assignment.notes || '',
                                status: assignment.status || 'active',
                                assignment_id: assignment.id,
                                tracking_url: trackingUrl,
                                selectedTokens: []
                            };
                        })
                    );
                    setPublisherAssignments(initialAssignments);
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
                toast.error('Failed to load assignments');
            } finally {
                setLoadingAssignments(false);
            }
        };

        fetchAssignments();
    }, [id, toast]);

    if (loading) {
        return (
            <div className="offer-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading offer details...</p>
                </div>
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div className="offer-page">
                <div className="error-state" style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: '#F44336', marginBottom: '20px' }}>Error: {error || 'Offer not found'}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/offer/list')}
                    >
                        Back to Offers
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="offer-page">
            <div className="offer-header">
                <div className="offer-header-left">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/offer/list')}
                        style={{ marginRight: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ArrowLeftIcon />
                        Back
                    </button>
                    <div>
                        <h1>{offer.name}</h1>
                        <p>Offer ID: {offer.id} | Status: <span className={`offer-status ${offer.status?.toLowerCase()}`}>{offer.status}</span></p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to={`/offer/edit/${offer.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <EditIcon />
                        Edit Offer
                    </Link>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            // Scroll to publisher section
                            const element = document.getElementById('publisherSection');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <EyeIcon />
                        View Publishers
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {/* Statistics Cards */}
            {loadingStats ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading statistics...</div>
            ) : stats && (
                <div className="offer-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Clicks</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{stats.total_clicks || 0}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Conversions</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.total_conversions || 0}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Conversion Rate</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>{stats.conversion_rate?.toFixed(2) || '0.00'}%</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Revenue</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{offer.offer_currency} {stats.total_revenue || '0.00'}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Payout</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{offer.offer_currency} {stats.total_payout || '0.00'}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Profit</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>{offer.offer_currency} {stats.total_profit || '0.00'}</div>
                    </div>
                </div>
            )}

            {/* Daily Activity */}
            {dailyStats && dailyStats.length > 0 && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Daily Activity</h2>
                    <div className="table-responsive">
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'right', color: '#666' }}>Clicks</th>
                                    <th style={{ padding: '12px', textAlign: 'right', color: '#666' }}>Conversions</th>
                                    <th style={{ padding: '12px', textAlign: 'right', color: '#666' }}>Conversion Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyStats.map((day, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px' }}>{formatDate(day.date)}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>{day.clicks}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>{day.conversions}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            {day.clicks > 0 ? ((day.conversions / day.clicks) * 100).toFixed(2) : '0.00'}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                {/* Basic Information */}
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Basic Information</h2>
                    <div className="detail-grid" style={{ display: 'grid', gap: '15px' }}>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Name:</span>
                            <span className="detail-value" style={{ fontWeight: '500' }}>{offer.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Description:</span>
                            <span className="detail-value">{offer.description || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Category:</span>
                            <span className="detail-value">{offer.category}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Status:</span>
                            <span className={`offer-status ${offer.status?.toLowerCase()}`}>{offer.status}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Country:</span>
                            <span className="detail-value">{offer.country}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Currency:</span>
                            <span className="detail-value">{offer.offer_currency}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Start Date:</span>
                            <span className="detail-value">{formatDate(offer.start_date)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>End Date:</span>
                            <span className="detail-value">{formatDate(offer.end_date)}</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Pricing Information</h2>
                    <div className="detail-grid" style={{ display: 'grid', gap: '15px' }}>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Advertiser Model:</span>
                            <span className="detail-value">{offer.advertiser_model}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Advertiser Amount:</span>
                            <span className="detail-value" style={{ fontWeight: '600', color: '#2196F3' }}>{offer.offer_currency} {offer.advertiser_amount}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Affiliate Model:</span>
                            <span className="detail-value">{offer.affiliate_model}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Affiliate Amount:</span>
                            <span className="detail-value" style={{ fontWeight: '600', color: '#4CAF50' }}>{offer.offer_currency} {offer.affiliate_amount}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Offer URL:</span>
                            <span className="detail-value">
                                <a href={offer.offer_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>
                                    {offer.offer_url}
                                </a>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Preview URL:</span>
                            <span className="detail-value">
                                {offer.preview_url ? (
                                    <a href={offer.preview_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>
                                        {offer.preview_url}
                                    </a>
                                ) : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advertiser Information */}
            {offer.advertiser && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Advertiser Information</h2>
                    <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Name:</span>
                            <span className="detail-value">{offer.advertiser.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Email:</span>
                            <span className="detail-value">{offer.advertiser.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Company:</span>
                            <span className="detail-value">{offer.advertiser.company_name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label" style={{ color: '#666', fontSize: '14px' }}>Status:</span>
                            <span className={`offer-status ${offer.advertiser.status?.toLowerCase()}`}>{offer.advertiser.status}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Publisher Assignments Management */}
            <div id="publisherSection" className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Publisher Assignments</h2>
                    <span style={{ fontSize: '14px', color: '#666' }}>{publisherAssignments.length} Publisher(s)</span>
                </div>

                {/* Add Publisher */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Add Publisher</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <select
                            className="form-control"
                            value={''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    const publisherId = parseInt(e.target.value);
                                    const publisher = publishers.find(p => p.id === publisherId);
                                    if (publisher && !publisherAssignments.find(a => a.publisher_id === publisherId)) {
                                        setPublisherAssignments(prev => [...prev, {
                                            publisher_id: publisherId,
                                            publisher_email: publisher.email,
                                            payout_override: '',
                                            conversion_approval_percentage: '',
                                            capping_budget: { duration: 'day', amount: '' },
                                            capping_conversions: { duration: 'day', amount: '' },
                                            callback_url: '',
                                            offer_url: '',
                                            notes: '',
                                            status: 'active',
                                            assignment_id: null,
                                            tracking_url: '',
                                            selectedTokens: []
                                        }]);
                                    }
                                    e.target.value = '';
                                }
                            }}
                            disabled={loadingPublishers}
                            style={{ flex: 1 }}
                        >
                            <option value="">Select Publisher to Add</option>
                            {publishers
                                .filter(p => !publisherAssignments.find(a => a.publisher_id === p.id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.first_name} ({p.email}) - {p.company_name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Publisher Assignments List */}
                {loadingAssignments ? (
                    <p>Loading assignments...</p>
                ) : publisherAssignments.length > 0 ? (
                    <div style={{ marginTop: '20px' }}>
                        {publisherAssignments.map((assignment, index) => {
                            const publisher = publishers.find(p => p.id === assignment.publisher_id);
                            const isEditing = editingAssignmentIndex === index;

                            return (
                                <div key={index} style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    background: isEditing ? '#f9f9f9' : '#fff'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div>
                                            <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                                {publisher ? `${publisher.first_name} (${publisher.email})` : `Publisher: ${assignment.publisher_email}`}
                                            </h5>
                                            {publisher && (
                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                                                    {publisher.company_name}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {!isEditing ? (
                                                <>
                                                    {/* Get Tracking URL button - shown if assignment exists but URL not loaded */}
                                                    {assignment.assignment_id && !assignment.tracking_url && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-sm"
                                                            onClick={async () => {
                                                                try {
                                                                    setLoadingTrackingUrls(prev => ({ ...prev, [assignment.assignment_id]: true }));
                                                                    const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.assignment_id);
                                                                    if (trackingResponse.success && trackingResponse.data) {
                                                                        const updated = [...publisherAssignments];
                                                                        updated[index].tracking_url = trackingResponse.data.tracking_url;
                                                                        setPublisherAssignments(updated);
                                                                        toast.success('Tracking URL loaded!');
                                                                    } else {
                                                                        toast.error('Failed to load tracking URL');
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Error fetching tracking URL:', error);
                                                                    toast.error(error.message || 'Failed to load tracking URL');
                                                                } finally {
                                                                    setLoadingTrackingUrls(prev => ({ ...prev, [assignment.assignment_id]: false }));
                                                                }
                                                            }}
                                                            disabled={loadingTrackingUrls[assignment.assignment_id]}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            {loadingTrackingUrls[assignment.assignment_id] ? (
                                                                <>
                                                                    <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                                    Loading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LinkIcon />
                                                                    Get Tracking URL
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => setEditingAssignmentIndex(index)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        <EditIcon />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            setPublisherAssignments(prev => prev.filter((_, i) => i !== index));
                                                            setEditingAssignmentIndex(null);
                                                        }}
                                                    >
                                                        <XIcon />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingAssignmentIndex(null)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                            <div className="form-group">
                                                <label className="form-label">Payout Override</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    value={assignment.payout_override}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].payout_override = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Leave empty for default"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Conversion Approval %</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    value={assignment.conversion_approval_percentage}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].conversion_approval_percentage = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Leave empty for default"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Budget Cap Duration</label>
                                                <select
                                                    className="form-control"
                                                    value={assignment.capping_budget?.duration || 'day'}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].capping_budget = {
                                                            ...updated[index].capping_budget,
                                                            duration: e.target.value
                                                        };
                                                        setPublisherAssignments(updated);
                                                    }}
                                                >
                                                    <option value="day">Day</option>
                                                    <option value="week">Week</option>
                                                    <option value="month">Month</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Budget Cap Amount</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    value={assignment.capping_budget?.amount || ''}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].capping_budget = {
                                                            ...updated[index].capping_budget,
                                                            amount: e.target.value
                                                        };
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Leave empty for unlimited"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Conversion Cap Duration</label>
                                                <select
                                                    className="form-control"
                                                    value={assignment.capping_conversions?.duration || 'day'}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].capping_conversions = {
                                                            ...updated[index].capping_conversions,
                                                            duration: e.target.value
                                                        };
                                                        setPublisherAssignments(updated);
                                                    }}
                                                >
                                                    <option value="day">Day</option>
                                                    <option value="week">Week</option>
                                                    <option value="month">Month</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Conversion Cap Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={assignment.capping_conversions?.amount || ''}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].capping_conversions = {
                                                            ...updated[index].capping_conversions,
                                                            amount: e.target.value
                                                        };
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Leave empty for unlimited"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Callback URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={assignment.callback_url}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].callback_url = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Offer URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={assignment.offer_url}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].offer_url = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                <label className="form-label">Notes</label>
                                                <textarea
                                                    className="form-control"
                                                    value={assignment.notes}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].notes = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                    rows="2"
                                                    placeholder="Optional notes"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-control"
                                                    value={assignment.status}
                                                    onChange={(e) => {
                                                        const updated = [...publisherAssignments];
                                                        updated[index].status = e.target.value;
                                                        setPublisherAssignments(updated);
                                                    }}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Payout Override:</span>
                                                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>
                                                    {assignment.payout_override ? `${offer.offer_currency} ${assignment.payout_override}` : 'Default'}
                                                </p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Conversion Approval:</span>
                                                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>
                                                    {assignment.conversion_approval_percentage ? `${assignment.conversion_approval_percentage}%` : 'Default'}
                                                </p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Budget Cap:</span>
                                                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>
                                                    {assignment.capping_budget?.amount
                                                        ? `${offer.offer_currency} ${assignment.capping_budget.amount} / ${assignment.capping_budget.duration}`
                                                        : 'Unlimited'}
                                                </p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Conversion Cap:</span>
                                                <p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>
                                                    {assignment.capping_conversions?.amount
                                                        ? `${assignment.capping_conversions.amount} / ${assignment.capping_conversions.duration}`
                                                        : 'Unlimited'}
                                                </p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#666' }}>Status:</span>
                                                <p style={{ margin: '4px 0 0 0' }}>
                                                    <span className={`offer-status ${assignment.status?.toLowerCase()}`}>
                                                        {assignment.status}
                                                    </span>
                                                </p>
                                            </div>
                                            {/* Tracking URL Section - Always visible for existing assignments */}
                                            {assignment.assignment_id && (
                                                <div style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '15px', background: '#f0f7ff', borderRadius: '6px', border: '1px solid #2196F3' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#2196F3' }}>Tracking URL:</span>
                                                        {!assignment.tracking_url && !loadingTrackingUrls[assignment.assignment_id] && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={async () => {
                                                                    try {
                                                                        setLoadingTrackingUrls(prev => ({ ...prev, [assignment.assignment_id]: true }));
                                                                        const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.assignment_id);
                                                                        if (trackingResponse.success && trackingResponse.data) {
                                                                            const updated = [...publisherAssignments];
                                                                            updated[index].tracking_url = trackingResponse.data.tracking_url;
                                                                            setPublisherAssignments(updated);
                                                                            toast.success('Tracking URL loaded!');
                                                                        } else {
                                                                            toast.error('Failed to load tracking URL');
                                                                        }
                                                                    } catch (error) {
                                                                        console.error('Error fetching tracking URL:', error);
                                                                        toast.error(error.message || 'Failed to load tracking URL');
                                                                    } finally {
                                                                        setLoadingTrackingUrls(prev => ({ ...prev, [assignment.assignment_id]: false }));
                                                                    }
                                                                }}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                            >
                                                                <LinkIcon />
                                                                Get Tracking URL
                                                            </button>
                                                        )}
                                                    </div>
                                                    {loadingTrackingUrls[assignment.assignment_id] ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                                                            <div style={{ width: '16px', height: '16px', border: '2px solid #2196F3', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                            <span style={{ fontSize: '12px' }}>Loading tracking URL...</span>
                                                        </div>
                                                    ) : assignment.tracking_url ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={assignment.tracking_url}
                                                                readOnly
                                                                style={{ fontSize: '12px', padding: '8px 12px', fontFamily: 'monospace' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm"
                                                                onClick={async () => {
                                                                    const result = await safeCopyToClipboard(assignment.tracking_url);
                                                                    if (result.success) {
                                                                        toast.success('Copied to clipboard!');
                                                                    } else {
                                                                        toast.error(result.error || 'Failed to copy to clipboard');
                                                                    }
                                                                }}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                                            >
                                                                <CopyIcon />
                                                                Copy
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0, fontStyle: 'italic' }}>
                                                            Click "Get Tracking URL" to fetch the tracking URL for this publisher
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No publishers assigned yet. Add a publisher above.</p>
                )}

                {/* Save Assignments Button */}
                {publisherAssignments.length > 0 && (
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={async () => {
                                try {
                                    setSavingAssignments(true);
                                    const assignmentData = {
                                        offer_id: parseInt(id),
                                        publishers: publisherAssignments.map(assignment => ({
                                            publisher_id: assignment.publisher_id,
                                            payout_override: assignment.payout_override ? parseFloat(assignment.payout_override) : null,
                                            conversion_approval_percentage: assignment.conversion_approval_percentage ? parseFloat(assignment.conversion_approval_percentage) : null,
                                            capping_budget: assignment.capping_budget?.amount ? {
                                                duration: assignment.capping_budget.duration,
                                                amount: parseFloat(assignment.capping_budget.amount)
                                            } : null,
                                            capping_conversions: assignment.capping_conversions?.amount ? {
                                                duration: assignment.capping_conversions.duration,
                                                amount: parseInt(assignment.capping_conversions.amount)
                                            } : null,
                                            callback_url: assignment.callback_url || null,
                                            offer_url: assignment.offer_url || null,
                                            notes: assignment.notes || null,
                                            status: assignment.status
                                        }))
                                    };

                                    await assignmentsAPI.createOrUpdateAssignments(assignmentData);
                                    toast.success('Assignments saved successfully!');
                                    setEditingAssignmentIndex(null);

                                    // Reload assignments and fetch tracking URLs
                                    const response = await assignmentsAPI.getAssignments({ offer_id: id });
                                    if (response.success && response.data) {
                                        setAssignments(response.data);
                                        const updatedAssignments = await Promise.all(
                                            response.data.map(async (assignment) => {
                                                let trackingUrl = '';
                                                if (assignment.id) {
                                                    try {
                                                        const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.id);
                                                        if (trackingResponse.success) {
                                                            trackingUrl = trackingResponse.data.tracking_url;
                                                        }
                                                    } catch (error) {
                                                        console.error(`Error fetching tracking URL for assignment ${assignment.id}:`, error);
                                                    }
                                                }
                                                return {
                                                    publisher_id: assignment.publisher_id,
                                                    publisher_email: assignment.publisher_email,
                                                    payout_override: assignment.payout_override || '',
                                                    conversion_approval_percentage: assignment.conversion_approval_percentage || '',
                                                    capping_budget: assignment.capping_budget || { duration: 'day', amount: '' },
                                                    capping_conversions: assignment.capping_conversions || { duration: 'day', amount: '' },
                                                    callback_url: assignment.callback_url || '',
                                                    offer_url: assignment.offer_url || '',
                                                    notes: assignment.notes || '',
                                                    status: assignment.status || 'active',
                                                    assignment_id: assignment.id,
                                                    tracking_url: trackingUrl,
                                                    selectedTokens: []
                                                };
                                            })
                                        );
                                        setPublisherAssignments(updatedAssignments);
                                    }
                                } catch (error) {
                                    console.error('Error saving assignments:', error);
                                    toast.error(error.message || 'Failed to save assignments');
                                } finally {
                                    setSavingAssignments(false);
                                }
                            }}
                            disabled={savingAssignments}
                        >
                            {savingAssignments ? 'Saving...' : 'Save All Assignments'}
                        </button>
                    </div>
                )}
            </div>

            {/* Recent Clicks */}
            {offer.recent_clicks && offer.recent_clicks.length > 0 && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Recent Clicks</h2>
                    <div className="offer-table-container">
                        <table className="offer-table">
                            <thead>
                                <tr>
                                    <th>Click ID</th>
                                    <th>Publisher</th>
                                    <th>IP Address</th>
                                    <th>Device</th>
                                    <th>Browser</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.recent_clicks.slice(0, 10).map((click) => (
                                    <tr key={click.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{click.click_uuid}</td>
                                        <td>{click.publisher_email}</td>
                                        <td>{click.ip}</td>
                                        <td>{click.device_type || '-'}</td>
                                        <td>{click.browser || '-'}</td>
                                        <td>{formatDateTime(click.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Conversions */}
            {offer.recent_conversions && offer.recent_conversions.length > 0 && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Recent Conversions</h2>
                    <div className="offer-table-container">
                        <table className="offer-table">
                            <thead>
                                <tr>
                                    <th>Conversion ID</th>
                                    <th>Publisher</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Payout</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.recent_conversions.map((conversion) => (
                                    <tr key={conversion.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{conversion.conversion_uuid}</td>
                                        <td>{conversion.publisher_email}</td>
                                        <td>
                                            <span className={`offer-status ${conversion.status?.toLowerCase()}`}>
                                                {conversion.status}
                                            </span>
                                        </td>
                                        <td>{offer.offer_currency} {conversion.amount}</td>
                                        <td>{offer.offer_currency} {conversion.payout}</td>
                                        <td>{formatDateTime(conversion.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Clicks by Publisher */}
            {offer.clicks_by_publisher && offer.clicks_by_publisher.length > 0 && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Performance by Publisher</h2>
                    <div className="offer-table-container">
                        <table className="offer-table">
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Clicks</th>
                                    <th>Conversions</th>
                                    <th>Revenue</th>
                                    <th>Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.clicks_by_publisher.map((pub, index) => (
                                    <tr key={index}>
                                        <td>{pub.publisher_email}</td>
                                        <td>{pub.publisher_email}</td>
                                        <td>{pub.publisher_company}</td>
                                        <td>{pub.click_count}</td>
                                        <td>{pub.conversion_count}</td>
                                        <td>{offer.offer_currency} {pub.revenue}</td>
                                        <td>{offer.offer_currency} {pub.payout}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfferDetail;

