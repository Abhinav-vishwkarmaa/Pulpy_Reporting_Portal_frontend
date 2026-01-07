import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useToast } from '../../context/ToastContext';
import { offersAPI } from '../../services/api';
import './Offer.css';

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

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

function OfferList() {

    const toast = useToast();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ open: false, offer: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [updatingStatus, setUpdatingStatus] = useState({});

    // Fetch offers data
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await offersAPI.getOffers({
                    page: 1,
                    limit: 100 // Get more offers for client-side filtering
                });
                if (response.success) {
                    setOffers(response.data);
                } else {
                    setError('Failed to load offers');
                }
            } catch (err) {
                console.error('Offers fetch error:', err);
                setError(err.message || 'Failed to load offers');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const filteredOffers = offers.filter(offer => {
        const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (offer.advertiser_id && offer.advertiser_id.toString().includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || offer.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = (offer) => {
        setDeleteModal({ open: true, offer });
    };

    const confirmDelete = async () => {
        if (deleteModal.offer) {
            try {
                // Call the API to delete the offer
                await offersAPI.deleteOffer(deleteModal.offer.id);
                toast.success('Offer deleted successfully');
                setDeleteModal({ open: false, offer: null });

                // Refresh offers data after deletion
                const response = await offersAPI.getOffers({
                    page: 1,
                    limit: 100
                });
                if (response.success) {
                    setOffers(response.data);
                }
            } catch (err) {
                console.error('Delete error:', err);
                toast.error('Failed to delete offer');
            }
        }
    };

    const handleStatusChange = async (offerId, newStatus) => {
        try {
            setUpdatingStatus(prev => ({ ...prev, [offerId]: true }));
            const response = await offersAPI.updateOfferStatus(offerId, newStatus);

            if (response.success) {
                toast.success('Offer status updated successfully');

                // Refresh offers data after status update
                const offersResponse = await offersAPI.getOffers({
                    page: 1,
                    limit: 100
                });
                if (offersResponse.success) {
                    setOffers(offersResponse.data);
                }
            } else {
                toast.error(response.message || 'Failed to update offer status');
            }
        } catch (err) {
            console.error('Status update error:', err);
            toast.error(err.message || 'Failed to update offer status');
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [offerId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="offer-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px', textAlign: 'center' }}></div>
                    <p>Loading offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="offer-page">
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
        <div className="offer-page">
            <div className="offer-header">
                <div className="offer-header-left">
                    <h1>Offer List</h1>
                    <p>Manage all your offers in one place</p>
                </div>
                <Link to="/offer/new" className="btn btn-primary">
                    <PlusIcon />
                    New Offer
                </Link>
            </div>

            <div className="offer-filters">
                <div className="offer-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search offers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="form-control offer-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="live">Live</option>
                    <option value="paused">Paused</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            <div className="offer-table-container">
                <table className="offer-table">
                    <thead>
                        <tr>
                            <th>Offer Name</th>
                            <th>Advertiser</th>
                            <th>Category</th>
                            <th>Country</th>
                            <th>Revenue</th>
                            <th>Payout</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOffers.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                                    No offers found
                                </td>
                            </tr>
                        ) : (
                            paginatedOffers.map((offer) => (
                                <tr key={offer.id}>
                                    <td>
                                        <div className="offer-name">{offer.name}</div>
                                        <div className="offer-id">ID: {offer.id}</div>
                                    </td>
                                    <td>Advertiser {offer.advertiser_id || '-'}</td>
                                    <td>{offer.category || '-'}</td>
                                    <td>{offer.country || '-'}</td>
                                    <td>{offer.offer_currency} {offer.advertiser_amount || '0.00'}</td>
                                    <td>{offer.offer_currency} {offer.affiliate_amount || '0.00'}</td>
                                    <td>{offer.start_date ? new Date(offer.start_date).toLocaleDateString() : '-'}</td>
                                    <td>{offer.end_date ? new Date(offer.end_date).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <select
                                                className={`offer-status-select ${offer.status.toLowerCase()}`}
                                                value={['live', 'paused', 'suspend'].includes(offer.status.toLowerCase())
                                                    ? offer.status.toLowerCase()
                                                    : 'live'}
                                                onChange={(e) => handleStatusChange(offer.id, e.target.value)}
                                                disabled={updatingStatus[offer.id]}
                                            >
                                                <option value="live">Live</option>
                                                <option value="paused">Paused</option>
                                                <option value="suspend">Suspend</option>
                                            </select>
                                            {updatingStatus[offer.id] && (
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                    Updating...
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="offer-actions">
                                            <button
                                                className="offer-action-btn"
                                                title="View Details"
                                                onClick={() => navigate(`/offer/detail/${offer.id}`)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                            <button
                                                className="offer-action-btn"
                                                title="Edit"
                                                onClick={() => navigate(`/offer/edit/${offer.id}`)}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="offer-action-btn delete"
                                                title="Delete"
                                                onClick={() => handleDelete(offer)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {filteredOffers.length > itemsPerPage && (
                    <div className="offer-pagination">
                        <div className="offer-pagination-info">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOffers.length)} of {filteredOffers.length} entries
                        </div>
                        <div className="offer-pagination-buttons">
                            <button
                                className="offer-pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`offer-pagination-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="offer-pagination-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, offer: null })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-body">
                            <div className="delete-modal">
                                <div className="delete-modal-icon">
                                    <AlertIcon />
                                </div>
                                <h3>Delete Offer?</h3>
                                <p>Are you sure you want to delete "{deleteModal.offer?.name}"? This action cannot be undone.</p>
                                <div className="delete-modal-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteModal({ open: false, offer: null })}
                                    >
                                        Cancel
                                    </button>
                                    <button className="btn btn-danger" onClick={confirmDelete}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfferList;
