import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { publishersAPI } from '../../services/api';
import './Affiliate.css';

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

function NewAffiliate() {
    const navigate = useNavigate();
    const { addAffiliate } = useData();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        company_name: '',
        country: 'US',
        password: '',
        confirmPassword: '',
        global_postback_url: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field changes
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.first_name) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const { confirmPassword, ...publisherData } = formData;
            await publishersAPI.createPublisher(publisherData);
            toast.success('Publisher created successfully!');
            navigate('/affiliate/manage');
        } catch (error) {
            console.error('Create publisher error:', error);
            toast.error('Failed to create publisher');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="affiliate-page">
            <div className="affiliate-header">
                <div className="affiliate-header-left">
                    <h1>New Publisher</h1>
                    <p>Register a new publisher partner</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="affiliate-form-container">
                    <div className="affiliate-form-header">
                        <h2>Publisher Details</h2>
                        <p>Fill in the details below to create a new publisher</p>
                    </div>

                    {/* Account Information */}
                    <div className="affiliate-form-section">
                        <h3 className="affiliate-form-section-title">Account Information</h3>
                        <div className="affiliate-form-row two-col">
                            <div className="form-group">
                                <label className="form-label required">Email Id</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label required">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />
                                {errors.first_name && <div className="form-error">{errors.first_name}</div>}
                            </div>
                        </div>

                        <div className="affiliate-form-row two-col">
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

                    {/* Password */}
                    <div className="affiliate-form-section">
                        <h3 className="affiliate-form-section-title">Set Password</h3>
                        <div className="affiliate-form-row two-col">
                            <div className="form-group">
                                <label className="form-label required">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                                {errors.password && <div className="form-error">{errors.password}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                />
                                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Postback */}
                    <div className="affiliate-form-section">
                        <h3 className="affiliate-form-section-title">Tracking</h3>
                        <div className="form-group">
                            <label className="form-label">Global Postback URL</label>
                            <input
                                type="url"
                                className="form-control"
                                name="global_postback_url"
                                value={formData.global_postback_url}
                                onChange={handleChange}
                                placeholder="https://example.com/postback?click_id={click_id}&payout={payout}"
                            />
                            <div className="form-helper">
                                Optional: URL to receive conversion notifications
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="affiliate-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Publisher'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/affiliate/manage')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewAffiliate;
