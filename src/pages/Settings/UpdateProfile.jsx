import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Settings.css';

function UpdateProfile() {
    const { user, updateProfile } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        companyName: user?.companyName || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePassword = () => {
        const newErrors = {};

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required';
            }
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setLoading(true);

        try {
            const updates = {
                fullName: formData.fullName,
                companyName: formData.companyName,
                phone: formData.phone
            };

            updateProfile(updates);

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Update Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="settings-form-container">
                    {/* Avatar Section */}
                    <div className="settings-avatar-section">
                        <div className="settings-avatar">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="settings-avatar-info">
                            <h3>{user?.fullName || 'User'}</h3>
                            <p>{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="settings-form-section">
                        <h3 className="settings-form-section-title">Personal Information</h3>
                        <div className="settings-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                />
                                <div className="form-helper">Email cannot be changed</div>
                            </div>
                        </div>

                        <div className="settings-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="settings-form-section">
                        <h3 className="settings-form-section-title">Change Password</h3>
                        <div className="form-group" style={{ maxWidth: '400px' }}>
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                            />
                            {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
                        </div>

                        <div className="settings-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                                {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="settings-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpdateProfile;
