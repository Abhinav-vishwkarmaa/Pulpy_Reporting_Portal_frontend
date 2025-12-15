import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { assignmentsAPI, offersAPI, publishersAPI } from '../../services/api';
import './Assignment.css';

function NewAssignment() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState('');
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [publisherAssignments, setPublisherAssignments] = useState([]);

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
                console.error('Error fetching data:', err);
                toast.error('Failed to load data');
            }
        };
        fetchData();
    }, [toast]);

    const handleAddPublisher = (publisherId) => {
        if (!publisherId) return;
        const publisher = publishers.find(p => p.id === parseInt(publisherId));
        if (publisher && !publisherAssignments.find(a => a.publisher_id === publisher.id)) {
            setPublisherAssignments(prev => [...prev, {
                publisher_id: publisher.id,
                payout_override: '',
                conversion_approval_percentage: '',
                capping_budget: { duration: 'day', amount: '' },
                capping_conversions: { duration: 'day', amount: '' },
                callback_url: '',
                offer_url: '',
                notes: '',
                status: 'active'
            }]);
        }
    };

    const handleRemovePublisher = (index) => {
        setPublisherAssignments(prev => prev.filter((_, i) => i !== index));
    };

    const handlePublisherChange = (index, field, value) => {
        const updated = [...publisherAssignments];
        if (field === 'capping_budget' || field === 'capping_conversions') {
            updated[index][field] = {
                ...updated[index][field],
                ...value
            };
        } else {
            updated[index][field] = value;
        }
        setPublisherAssignments(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOffer) {
            toast.error('Please select an offer');
            return;
        }
        if (publisherAssignments.length === 0) {
            toast.error('Please add at least one publisher');
            return;
        }

        setLoading(true);
        try {
            const assignmentData = {
                offer_id: parseInt(selectedOffer),
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
            toast.success('Assignment created successfully!');
            navigate('/assignment/manage');
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error(error.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assignment-page">
            <div className="assignment-form-container">
                <div className="assignment-form-header">
                    <h2>New Assignment</h2>
                    <p>Assign an offer to one or more publishers</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="assignment-form-section">
                        <div className="assignment-form-row">
                            <div className="form-group">
                                <label className="form-label required">Select Offer</label>
                                <select
                                    className="form-control"
                                    value={selectedOffer}
                                    onChange={(e) => setSelectedOffer(e.target.value)}
                                    required
                                >
                                    <option value="">Select an offer</option>
                                    {offers.map(offer => (
                                        <option key={offer.id} value={offer.id}>
                                            {offer.name} ({offer.category})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="assignment-form-section" style={{ marginTop: '32px' }}>
                            <h3 className="assignment-form-section-title">Add Publishers</h3>
                            <div className="form-group">
                                <label className="form-label">Add Publisher</label>
                                <select
                                    className="form-control"
                                    value=""
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAddPublisher(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
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

                            {publisherAssignments.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    {publisherAssignments.map((assignment, index) => {
                                        const publisher = publishers.find(p => p.id === assignment.publisher_id);
                                        return (
                                            <div key={index} style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '15px',
                                                marginBottom: '15px',
                                                background: '#f9f9f9'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                    <h5 style={{ margin: 0 }}>
                                                        {publisher ? `${publisher.first_name} (${publisher.email})` : `Publisher ID: ${assignment.publisher_id}`}
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemovePublisher(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="assignment-form-row two-col">
                                                    <div className="form-group">
                                                        <label className="form-label">Payout Override</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control"
                                                            value={assignment.payout_override}
                                                            onChange={(e) => handlePublisherChange(index, 'payout_override', e.target.value)}
                                                            placeholder="Leave empty for default"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Conversion Approval %</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            className="form-control"
                                                            value={assignment.conversion_approval_percentage}
                                                            onChange={(e) => handlePublisherChange(index, 'conversion_approval_percentage', e.target.value)}
                                                            placeholder="0-100"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="assignment-form-row two-col">
                                                    <div className="form-group">
                                                        <label className="form-label">Capping Budget Duration</label>
                                                        <select
                                                            className="form-control"
                                                            value={assignment.capping_budget?.duration || 'day'}
                                                            onChange={(e) => handlePublisherChange(index, 'capping_budget', { duration: e.target.value })}
                                                        >
                                                            <option value="day">Day</option>
                                                            <option value="week">Week</option>
                                                            <option value="month">Month</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Capping Budget Amount</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control"
                                                            value={assignment.capping_budget?.amount || ''}
                                                            onChange={(e) => handlePublisherChange(index, 'capping_budget', { amount: e.target.value })}
                                                            placeholder="Leave empty for no cap"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="assignment-form-row two-col">
                                                    <div className="form-group">
                                                        <label className="form-label">Capping Conversions Duration</label>
                                                        <select
                                                            className="form-control"
                                                            value={assignment.capping_conversions?.duration || 'day'}
                                                            onChange={(e) => handlePublisherChange(index, 'capping_conversions', { duration: e.target.value })}
                                                        >
                                                            <option value="day">Day</option>
                                                            <option value="week">Week</option>
                                                            <option value="month">Month</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Capping Conversions Amount</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={assignment.capping_conversions?.amount || ''}
                                                            onChange={(e) => handlePublisherChange(index, 'capping_conversions', { amount: e.target.value })}
                                                            placeholder="Leave empty for no cap"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Callback URL</label>
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        value={assignment.callback_url}
                                                        onChange={(e) => handlePublisherChange(index, 'callback_url', e.target.value)}
                                                        placeholder="https://affiliate.com/postback?click_id={click_id}&payout={payout}"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Offer URL</label>
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        value={assignment.offer_url}
                                                        onChange={(e) => handlePublisherChange(index, 'offer_url', e.target.value)}
                                                        placeholder="https://pulpy.com/click?offer_id=10&publisher_id=7&tid={TID}"
                                                    />
                                                </div>

                                                <div className="assignment-form-row two-col">
                                                    <div className="form-group">
                                                        <label className="form-label">Status</label>
                                                        <select
                                                            className="form-control"
                                                            value={assignment.status}
                                                            onChange={(e) => handlePublisherChange(index, 'status', e.target.value)}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Notes</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={assignment.notes}
                                                            onChange={(e) => handlePublisherChange(index, 'notes', e.target.value)}
                                                            placeholder="Optional notes"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="assignment-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/assignment/manage')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewAssignment;

