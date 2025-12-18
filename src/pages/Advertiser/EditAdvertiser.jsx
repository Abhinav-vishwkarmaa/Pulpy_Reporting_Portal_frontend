import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { advertisersAPI } from '../../services/api';
import './Advertiser.css';

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AE', name: 'United Arab Emirates' }
];

function EditAdvertiser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateAdvertiser } = useData();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: '',
        country: 'US',
        website: '',
        notes: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                setFetchLoading(true);
                const response = await advertisersAPI.getAdvertiser(id);
                if (response.success && response.data) {
                    setFormData({
                        name: response.data.name || '',
                        email: response.data.email || '',
                        company_name: response.data.company_name || '',
                        country: response.data.country || 'US',
                        website: response.data.website || '',
                        notes: response.data.notes || '',
                        status: response.data.status || 'active'
                    });
                } else {
                    toast.error('Advertiser not found');
                    navigate('/advertiser/manage');
                }
            } catch (error) {
                console.error('Fetch advertiser error:', error);
                toast.error('Failed to load advertiser data');
                navigate('/advertiser/manage');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchAdvertiser();
    }, [id, navigate, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.email || !formData.name || !formData.company_name) {
                toast.error('Email, Name, and Company Name are required');
                setLoading(false);
                return;
            }

            await advertisersAPI.updateAdvertiser(id, formData);
            toast.success('Advertiser updated successfully!');
            navigate('/advertiser/manage');
        } catch (error) {
            console.error('Update advertiser error:', error);
            toast.error('Failed to update advertiser');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="advertiser-page">
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading advertiser...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="advertiser-page">
            <div className="advertiser-header">
                <div className="advertiser-header-left">
                    <h1>Edit Advertiser</h1>
                    <p>Update advertiser information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="advertiser-form-container">
                    <div className="advertiser-form-header">
                        <h2>Advertiser Details</h2>
                        <p>Update the advertiser information below</p>
                    </div>

                    {/* Account Information */}
                    <div className="advertiser-form-section">
                        <h3 className="advertiser-form-section-title">Account Information</h3>
                        <div className="advertiser-form-row two-col">
                            <div className="form-group">
                                <label className="form-label required">Email Id</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter advertiser name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="advertiser-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <select
                                    className="form-control"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    {countries.map(country => (
                                        <option key={country.code} value={country.code}>{country.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="advertiser-form-section">
                        <h3 className="advertiser-form-section-title">Contact Information</h3>
                        <div className="advertiser-form-row">
                            <div className="form-group">
                                <label className="form-label">Website</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-control"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Enter any additional notes"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="advertiser-form-section">
                        <h3 className="advertiser-form-section-title">Status</h3>
                        <div className="advertiser-form-row">
                            <div className="form-group">
                                <label className="form-label">Account Status</label>
                                <select
                                    className="form-control"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="advertiser-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Advertiser'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/advertiser/manage')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditAdvertiser;
