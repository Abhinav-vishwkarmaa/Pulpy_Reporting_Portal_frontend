import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { assignmentsAPI, offersAPI, publishersAPI } from '../../services/api';
import './Assignment.css';

function EditAssignment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingAssignment, setLoadingAssignment] = useState(true);
    const [assignment, setAssignment] = useState(null);
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [formData, setFormData] = useState({
        offer_id: '',
        publisher_id: '',
        payout_override: '',
        conversion_approval_percentage: '',
        capping_budget: { duration: 'day', amount: '' },
        capping_conversions: { duration: 'day', amount: '' },
        callback_url: '',
        offer_url: '',
        notes: '',
        status: 'active',
        tracking_url: ''
    });

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
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                setLoadingAssignment(true);
                const response = await assignmentsAPI.getAssignment(id);
                if (response.success && response.data) {
                    const data = response.data;
                    setAssignment(data);
                    setFormData({
                        offer_id: data.offer_id?.toString() || '',
                        publisher_id: data.publisher_id?.toString() || '',
                        payout_override: data.payout_override || '',
                        conversion_approval_percentage: data.conversion_approval_percentage || '',
                        capping_budget: data.capping_budget || { duration: 'day', amount: '' },
                        capping_conversions: data.capping_conversions || { duration: 'day', amount: '' },
                        callback_url: data.callback_url || '',
                        offer_url: data.offer_url || '',
                        notes: data.notes || '',
                        status: data.status || 'active',
                        tracking_url: ''
                    });

                    // Fetch tracking URL
                    try {
                        const trackingResponse = await assignmentsAPI.getTrackingUrl(id);
                        if (trackingResponse.success) {
                            setFormData(prev => ({ ...prev, tracking_url: trackingResponse.data.tracking_url }));
                        }
                    } catch (err) {
                        console.error('Error fetching tracking URL:', err);
                    }
                }
            } catch (err) {
                console.error('Error fetching assignment:', err);
                toast.error('Failed to load assignment');
                navigate('/assignment/manage');
            } finally {
                setLoadingAssignment(false);
            }
        };

        if (id) {
            fetchAssignment();
        }
    }, [id, navigate, toast]);

    const handleChange = (field, value) => {
        if (field === 'capping_budget' || field === 'capping_conversions') {
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    ...value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const assignmentData = {
                offer_id: parseInt(formData.offer_id),
                publishers: [{
                    publisher_id: parseInt(formData.publisher_id),
                    payout_override: formData.payout_override ? parseFloat(formData.payout_override) : null,
                    conversion_approval_percentage: formData.conversion_approval_percentage ? parseFloat(formData.conversion_approval_percentage) : null,
                    capping_budget: formData.capping_budget?.amount ? {
                        duration: formData.capping_budget.duration,
                        amount: parseFloat(formData.capping_budget.amount)
                    } : null,
                    capping_conversions: formData.capping_conversions?.amount ? {
                        duration: formData.capping_conversions.duration,
                        amount: parseInt(formData.capping_conversions.amount)
                    } : null,
                    callback_url: formData.callback_url || null,
                    offer_url: formData.offer_url || null,
                    notes: formData.notes || null,
                    status: formData.status
                }]
            };

            await assignmentsAPI.createOrUpdateAssignments(assignmentData);
            toast.success('Assignment updated successfully!');
            navigate('/assignment/manage');
        } catch (error) {
            console.error('Error updating assignment:', error);
            toast.error(error.message || 'Failed to update assignment');
        } finally {
            setLoading(false);
        }
    };

    if (loadingAssignment) {
        return (
            <div className="assignment-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading assignment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="assignment-page">
            <div className="assignment-form-container">
                <div className="assignment-form-header">
                    <h2>Edit Assignment</h2>
                    <p>Update assignment details</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="assignment-form-section">
                        <div className="assignment-form-row two-col">
                            <div className="form-group">
                                <label className="form-label required">Offer</label>
                                <select
                                    className="form-control"
                                    value={formData.offer_id}
                                    onChange={(e) => handleChange('offer_id', e.target.value)}
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
                            <div className="form-group">
                                <label className="form-label required">Publisher</label>
                                <select
                                    className="form-control"
                                    value={formData.publisher_id}
                                    onChange={(e) => handleChange('publisher_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a publisher</option>
                                    {publishers.map(publisher => (
                                        <option key={publisher.id} value={publisher.id}>
                                            {publisher.first_name} ({publisher.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="assignment-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Payout Override</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={formData.payout_override}
                                    onChange={(e) => handleChange('payout_override', e.target.value)}
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
                                    value={formData.conversion_approval_percentage}
                                    onChange={(e) => handleChange('conversion_approval_percentage', e.target.value)}
                                    placeholder="0-100"
                                />
                            </div>
                        </div>

                        <div className="assignment-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Capping Budget Duration</label>
                                <select
                                    className="form-control"
                                    value={formData.capping_budget?.duration || 'day'}
                                    onChange={(e) => handleChange('capping_budget', { duration: e.target.value })}
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
                                    value={formData.capping_budget?.amount || ''}
                                    onChange={(e) => handleChange('capping_budget', { amount: e.target.value })}
                                    placeholder="Leave empty for no cap"
                                />
                            </div>
                        </div>

                        <div className="assignment-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Capping Conversions Duration</label>
                                <select
                                    className="form-control"
                                    value={formData.capping_conversions?.duration || 'day'}
                                    onChange={(e) => handleChange('capping_conversions', { duration: e.target.value })}
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
                                    value={formData.capping_conversions?.amount || ''}
                                    onChange={(e) => handleChange('capping_conversions', { amount: e.target.value })}
                                    placeholder="Leave empty for no cap"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Callback URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={formData.callback_url}
                                onChange={(e) => handleChange('callback_url', e.target.value)}
                                placeholder="https://affiliate.com/postback?click_id={click_id}&payout={payout}"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Offer URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={formData.offer_url}
                                onChange={(e) => handleChange('offer_url', e.target.value)}
                                placeholder="https://pulpy.com/click?offer_id=10&publisher_id=7&tid={TID}"
                            />
                        </div>

                        {formData.tracking_url && (
                            <div className="form-group">
                                <label className="form-label">Tracking URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.tracking_url}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="assignment-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-control"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
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
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    placeholder="Optional notes"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="assignment-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Assignment'}
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

export default EditAssignment;

