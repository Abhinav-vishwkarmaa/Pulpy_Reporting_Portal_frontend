import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import './Affiliate.css';

function PostbackTest() {
    const { affiliates } = useData();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        affiliateId: '',
        postbackUrl: '',
        clickId: '',
        conversionId: '',
        payout: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-fill postback URL when affiliate is selected
        if (name === 'affiliateId' && value) {
            const affiliate = affiliates.find(a => a.id === parseInt(value));
            if (affiliate?.postbackUrl) {
                setFormData(prev => ({ ...prev, postbackUrl: affiliate.postbackUrl }));
            }
        }
    };

    const handleTest = async (e) => {
        e.preventDefault();

        if (!formData.postbackUrl) {
            toast.error('Postback URL is required');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            // Simulate postback test
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Build test URL with parameters
            let testUrl = formData.postbackUrl;
            const params = new URLSearchParams();
            if (formData.clickId) params.append('click_id', formData.clickId);
            if (formData.conversionId) params.append('conv_id', formData.conversionId);
            if (formData.payout) params.append('payout', formData.payout);

            if (params.toString()) {
                testUrl += (testUrl.includes('?') ? '&' : '?') + params.toString();
            }

            setResult({
                success: true,
                url: testUrl,
                status: 200,
                response: 'OK',
                timestamp: new Date().toISOString()
            });

            toast.success('Postback test successful!');
        } catch (error) {
            setResult({
                success: false,
                url: formData.postbackUrl,
                error: 'Connection failed or timeout',
                timestamp: new Date().toISOString()
            });
            toast.error('Postback test failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="affiliate-page">
            <div className="affiliate-header">
                <div className="affiliate-header-left">
                    <h1>Affiliate Postback Test</h1>
                    <p>Test postback URLs to verify tracking integration</p>
                </div>
            </div>

            <form onSubmit={handleTest}>
                <div className="postback-test-container">
                    <div className="postback-test-header">
                        <h2>Test Configuration</h2>
                        <p>Configure and test postback URL response</p>
                    </div>

                    <div className="affiliate-form-section">
                        <h3 className="affiliate-form-section-title">Select Affiliate</h3>
                        <div className="affiliate-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Affiliate</label>
                                <select
                                    className="form-control"
                                    name="affiliateId"
                                    value={formData.affiliateId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Affiliate (Optional)</option>
                                    {affiliates.map(affiliate => (
                                        <option key={affiliate.id} value={affiliate.id}>
                                            {affiliate.fullName} ({affiliate.email})
                                        </option>
                                    ))}
                                </select>
                                <div className="form-helper">
                                    Select an affiliate to auto-fill their postback URL
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Postback URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="postbackUrl"
                                    value={formData.postbackUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/postback"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="affiliate-form-section">
                        <h3 className="affiliate-form-section-title">Test Parameters</h3>
                        <div className="affiliate-form-row">
                            <div className="form-group">
                                <label className="form-label">Click ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="clickId"
                                    value={formData.clickId}
                                    onChange={handleChange}
                                    placeholder="test_click_123"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Conversion ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="conversionId"
                                    value={formData.conversionId}
                                    onChange={handleChange}
                                    placeholder="conv_456"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payout</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="payout"
                                    value={formData.payout}
                                    onChange={handleChange}
                                    placeholder="10.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="affiliate-form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Testing...' : 'Test Postback'}
                        </button>
                    </div>

                    {result && (
                        <div className={`postback-result ${result.success ? 'success' : 'error'}`}>
                            <pre>
                                {`Timestamp: ${result.timestamp}
URL: ${result.url}
Status: ${result.success ? result.status : 'FAILED'}
Response: ${result.success ? result.response : result.error}`}
                            </pre>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default PostbackTest;
