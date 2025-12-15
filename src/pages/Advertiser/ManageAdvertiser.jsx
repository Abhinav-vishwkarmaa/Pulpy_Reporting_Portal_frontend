import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { advertisersAPI } from '../../services/api';
import './Advertiser.css';

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

function ManageAdvertiser() {
    const { deleteAdvertiser } = useData();
    const toast = useToast();
    const navigate = useNavigate();
    const [advertisers, setAdvertisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ open: false, advertiser: null });

    // Fetch advertisers data
    useEffect(() => {
        const fetchAdvertisers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Prepare API parameters
                const params = {
                    page: 1,
                    limit: 100
                };

                // Only add status filter if it's not 'all'
                if (statusFilter !== 'all') {
                    params.status = statusFilter;
                }

                const response = await advertisersAPI.getAdvertisers(params);
                if (response.success) {
                    setAdvertisers(response.data);
                } else {
                    setError('Failed to load advertisers');
                }
            } catch (err) {
                console.error('Advertisers fetch error:', err);
                setError(err.message || 'Failed to load advertisers');
            } finally {
                setLoading(false);
            }
        };

        fetchAdvertisers();
    }, [statusFilter]);

    const filteredAdvertisers = advertisers.filter(advertiser => {
        const matchesSearch =
            advertiser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            advertiser.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            advertiser.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || advertiser.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (advertiser) => {
        setDeleteModal({ open: true, advertiser });
    };

    const confirmDelete = async () => {
        if (deleteModal.advertiser) {
            try {
                await advertisersAPI.deleteAdvertiser(deleteModal.advertiser.id);
                toast.success('Advertiser deleted successfully');
                setDeleteModal({ open: false, advertiser: null });

                // Refresh advertisers data after deletion with current filter
                const params = {
                    page: 1,
                    limit: 100
                };

                // Only add status filter if it's not 'all'
                if (statusFilter !== 'all') {
                    params.status = statusFilter;
                }

                const response = await advertisersAPI.getAdvertisers(params);
                if (response.success) {
                    setAdvertisers(response.data);
                }
            } catch (err) {
                console.error('Delete error:', err);
                toast.error('Failed to delete advertiser');
            }
        }
    };

    if (loading) {
        return (
            <div className="advertiser-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading advertisers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="advertiser-page">
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
        <div className="advertiser-page">
            <div className="advertiser-header">
                <div className="advertiser-header-left">
                    <h1>Manage Advertisers</h1>
                    <p>View and manage all registered advertisers</p>
                </div>
                <Link to="/advertiser/new" className="btn btn-primary">
                    <PlusIcon />
                    New Advertiser
                </Link>
            </div>

            <div className="advertiser-filters">
                <div className="advertiser-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search advertisers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="form-control"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ minWidth: '150px' }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>

                </select>
            </div>

            <div className="advertiser-table-container">
                <table className="advertiser-table">
                    <thead>
                        <tr>
                            <th>Advertiser</th>
                            <th>Company</th>
                            <th>Country</th>
                            <th>Website</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdvertisers.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                    No advertisers found
                                </td>
                            </tr>
                        ) : (
                            filteredAdvertisers.map((advertiser) => (
                                <tr key={advertiser.id}>
                                    <td>
                                        <div className="advertiser-name">{advertiser.name}</div>
                                        <div className="advertiser-email">{advertiser.email}</div>
                                    </td>
                                    <td>{advertiser.company_name || '-'}</td>
                                    <td>{advertiser.country || '-'}</td>
                                    <td>
                                        {advertiser.website ? (
                                            <a href={advertiser.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                                                {advertiser.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <span className={`advertiser-status ${advertiser.status?.toLowerCase()}`}>
                                            {advertiser.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="advertiser-actions">
                                            <button
                                                className="advertiser-action-btn"
                                                title="Edit"
                                                onClick={() => navigate(`/advertiser/edit/${advertiser.id}`)}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="advertiser-action-btn delete"
                                                title="Delete"
                                                onClick={() => handleDelete(advertiser)}
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
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, advertiser: null })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-body">
                            <div className="delete-modal">
                                <div className="delete-modal-icon">
                                    <AlertIcon />
                                </div>
                                <h3>Delete Advertiser?</h3>
                                <p>Are you sure you want to delete "{deleteModal.advertiser?.fullName}"? This action cannot be undone.</p>
                                <div className="delete-modal-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteModal({ open: false, advertiser: null })}
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

export default ManageAdvertiser;
