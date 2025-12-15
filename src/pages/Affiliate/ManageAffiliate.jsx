import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { publishersAPI } from '../../services/api';
import './Affiliate.css';

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

function ManageAffiliate() {
    const { deleteAffiliate } = useData();
    const toast = useToast();
    const navigate = useNavigate();
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ open: false, affiliate: null });

    // Fetch publishers data
    useEffect(() => {
        const fetchPublishers = async () => {
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

                const response = await publishersAPI.getPublishers(params);
                if (response.success) {
                    setPublishers(response.data);
                } else {
                    setError('Failed to load publishers');
                }
            } catch (err) {
                console.error('Publishers fetch error:', err);
                setError(err.message || 'Failed to load publishers');
            } finally {
                setLoading(false);
            }
        };

        fetchPublishers();
    }, [statusFilter]);

    const filteredAffiliates = publishers.filter(affiliate => {
        const matchesSearch =
            affiliate.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || affiliate.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (affiliate) => {
        setDeleteModal({ open: true, affiliate });
    };

    const confirmDelete = async () => {
        if (deleteModal.affiliate) {
            try {
                await publishersAPI.deletePublisher(deleteModal.affiliate.id);
                toast.success('Publisher deleted successfully');
                setDeleteModal({ open: false, affiliate: null });

                // Refresh publishers data after deletion with current filter
                const params = {
                    page: 1,
                    limit: 100
                };

                // Only add status filter if it's not 'all'
                if (statusFilter !== 'all') {
                    params.status = statusFilter;
                }

                const response = await publishersAPI.getPublishers(params);
                if (response.success) {
                    setPublishers(response.data);
                }
            } catch (err) {
                console.error('Delete error:', err);
                toast.error('Failed to delete publisher');
            }
        }
    };

    if (loading) {
        return (
            <div className="affiliate-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading publishers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="affiliate-page">
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
        <div className="affiliate-page">
            <div className="affiliate-header">
                <div className="affiliate-header-left">
                    <h1>Manage Publishers</h1>
                    <p>View and manage all registered publishers</p>
                </div>
                <Link to="/affiliate/new" className="btn btn-primary">
                    <PlusIcon />
                    New Publisher
                </Link>
            </div>

            <div className="affiliate-filters">
                <div className="affiliate-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search publishers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="form-control affiliate-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ minWidth: '150px' }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            <div className="affiliate-table-container">
                <table className="affiliate-table">
                    <thead>
                        <tr>
                            <th>Affiliate</th>
                            <th>Company</th>
                            <th>Country</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAffiliates.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                    No affiliates found
                                </td>
                            </tr>
                        ) : (
                            filteredAffiliates.map((affiliate) => (
                                <tr key={affiliate.id}>
                                    <td>
                                        <div className="affiliate-name">{affiliate.first_name}</div>
                                        <div className="affiliate-email">{affiliate.email}</div>
                                    </td>
                                    <td>{affiliate.company_name || '-'}</td>
                                    <td>{affiliate.country || '-'}</td>
                                    <td>
                                        <span className={`affiliate-status ${affiliate.status?.toLowerCase()}`}>
                                            {affiliate.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="affiliate-actions">
                                            <button
                                                className="affiliate-action-btn"
                                                title="Edit"
                                                onClick={() => navigate(`/affiliate/edit/${affiliate.id}`)}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="affiliate-action-btn delete"
                                                title="Delete"
                                                onClick={() => handleDelete(affiliate)}
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
                <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, affiliate: null })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-body">
                            <div className="delete-modal">
                                <div className="delete-modal-icon">
                                    <AlertIcon />
                                </div>
                                <h3>Delete Publisher?</h3>
                                <p>Are you sure you want to delete "{deleteModal.affiliate?.first_name}"? This action cannot be undone.</p>
                                <div className="delete-modal-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteModal({ open: false, affiliate: null })}
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

export default ManageAffiliate;
