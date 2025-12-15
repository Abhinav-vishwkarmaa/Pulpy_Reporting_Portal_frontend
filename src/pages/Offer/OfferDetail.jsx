import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { offersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
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

function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offer, setOffer] = useState(null);

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

        fetchOfferDetails();
    }, [id]);

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
                <Link to={`/offer/edit/${offer.id}`} className="btn btn-primary">
                    <EditIcon />
                    Edit Offer
                </Link>
            </div>

            {/* Statistics Cards */}
            {offer.statistics && (
                <div className="offer-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Clicks</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{offer.statistics.total_clicks || 0}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Conversions</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{offer.statistics.total_conversions || 0}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Conversion Rate</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>{offer.statistics.conversion_rate?.toFixed(2) || '0.00'}%</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Revenue</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>{offer.offer_currency} {offer.statistics.total_revenue || '0.00'}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Payout</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{offer.offer_currency} {offer.statistics.total_payout || '0.00'}</div>
                    </div>
                    <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div className="stat-label" style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Profit</div>
                        <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>{offer.offer_currency} {offer.statistics.total_profit || '0.00'}</div>
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

            {/* Publisher Assignments */}
            {offer.assignments && offer.assignments.length > 0 && (
                <div className="offer-detail-section" style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Publisher Assignments</h2>
                    <div className="offer-table-container">
                        <table className="offer-table">
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Payout Override</th>
                                    <th>Cap Override</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.assignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td>{assignment.publisher_first_name}</td>
                                        <td>{assignment.publisher_email}</td>
                                        <td>{assignment.publisher_company}</td>
                                        <td>{assignment.payout_override ? `${offer.offer_currency} ${assignment.payout_override}` : '-'}</td>
                                        <td>{assignment.cap_override || '-'}</td>
                                        <td>
                                            <span className={`offer-status ${assignment.status?.toLowerCase()}`}>
                                                {assignment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{click.click_uuid?.substring(0, 8)}...</td>
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
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{conversion.conversion_uuid?.substring(0, 8)}...</td>
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

