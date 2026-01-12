import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dashboardAPI, offersAPI, publishersAPI } from '../../services/api';
import './LiveLogs.css';

const LiveLogs = () => {
    const [activeTab, setActiveTab] = useState('clicks');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(100);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter State
    const [offers, setOffers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState('');
    const [selectedPublisher, setSelectedPublisher] = useState('');

    // Auto-refresh timer reference
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Fetch Filter Options
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const results = await Promise.allSettled([
                    offersAPI.getOffers({ limit: 1000 }),
                    publishersAPI.getPublishers({ limit: 1000 })
                ]);

                const offersResult = results[0];
                const publishersResult = results[1];

                if (offersResult.status === 'fulfilled' && offersResult.value.success) {
                    setOffers(offersResult.value.data);
                } else {
                    console.error("Failed to fetch offers", offersResult.reason || "API Error");
                }

                if (publishersResult.status === 'fulfilled' && publishersResult.value.success) {
                    setPublishers(publishersResult.value.data);
                } else {
                    console.error("Failed to fetch publishers", publishersResult.reason || "API Error");
                }
            } catch (err) {
                console.error("Error fetching filters", err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [activeTab, limit, selectedOffer, selectedPublisher]);

    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(fetchLogs, 5000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, activeTab, limit, selectedOffer, selectedPublisher]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = { limit, page: 1 };
            if (activeTab === 'clicks') {
                // For clicks (Detailed Reports API)
                if (selectedOffer) params.offer_id = selectedOffer;
                if (selectedPublisher) params.publisher_id = selectedPublisher;

                const response = await dashboardAPI.getDetailed(params);
                if (response.success && response.data) {
                    setData(response.data);
                }
            } else {
                // For conversions
                if (selectedOffer) params.offer_id = selectedOffer;
                if (selectedPublisher) params.publisher_id = selectedPublisher;

                const response = await dashboardAPI.getConversions(params);
                if (response.success && response.data) {
                    setData(response.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="logs-page">
            <div className="logs-header">
                <h1>Live Logs</h1>
                <div className="logs-controls">
                    <div className="control-group">
                        <select value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)}>
                            <option value="">All Offers</option>
                            {offers.map(o => (
                                <option key={o.id} value={o.id}>{o.name} ({o.id})</option>
                            ))}
                        </select>
                    </div>

                    <div className="control-group">
                        <select value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}>
                            <option value="">All Affiliates</option>
                            {publishers.map(p => (
                                <option key={p.id} value={p.id}>{p.company_name || p.email} ({p.id})</option>
                            ))}
                        </select>
                    </div>

                    <div className="tab-group">
                        <button
                            className={`tab-btn ${activeTab === 'clicks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('clicks')}
                        >
                            Recent Clicks
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'conversions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('conversions')}
                        >
                            Recent Conversions
                        </button>
                    </div>

                    <div className="control-group">
                        <label>Limit:</label>
                        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                            />
                            Auto Refresh (5s)
                        </label>
                    </div>

                    <button className="btn btn-primary" onClick={fetchLogs} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                </div>
            </div>

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        {activeTab === 'clicks' ? (
                            <tr>
                                <th>Time</th>
                                <th>Click UUID</th>
                                <th>Offer</th>
                                <th>Affiliate</th>
                                <th>IP</th>
                                <th>Location</th>
                                <th>Device</th>
                                <th>ISP</th>
                                <th>Status</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Time</th>
                                <th>Conversion UUID</th>
                                <th>Click UUID</th>
                                <th>Offer</th>
                                <th>Affiliate</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>IP</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === 'clicks' ? 9 : 8} style={{ textAlign: 'center', padding: '20px' }}>
                                    No logs found
                                </td>
                            </tr>
                        ) : data.map((row, idx) => (
                            <tr key={idx}>
                                {activeTab === 'clicks' ? (
                                    <>
                                        <td>{formatDate(row.click_created_at || row.created_at)}</td>
                                        <td className="monospace">{row.click_uuid}</td>
                                        <td>{row.offer_name} ({row.offer_id})</td>
                                        <td>{row.publisher_company || row.publisher_email} - ({row.publisher_id})</td>
                                        <td>{row.ip}</td>
                                        <td>{[row.city, row.region, row.country].filter(Boolean).join(', ') || '-'}</td>
                                        <td>{row.device_type} / {row.os}</td>
                                        <td>{row.isp || '-'}</td>
                                        <td>{row.conversion_id ? <span className="badge success">Converted</span> : <span className="badge neutral">Click</span>}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{formatDate(row.created_at)}</td>
                                        <td className="monospace">{row.conversion_uuid}</td>
                                        <td className="monospace">{row.click_uuid}</td>
                                        <td>{row.offer_name} ({row.offer_id})</td>
                                        <td>{row.publisher_name} - ({row.publisher_id})</td>
                                        <td>${parseFloat(row.amount || 0).toFixed(2)}</td>
                                        <td><span className={`badge ${row.status}`}>{row.status}</span></td>
                                        <td>{row.ip}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveLogs;
