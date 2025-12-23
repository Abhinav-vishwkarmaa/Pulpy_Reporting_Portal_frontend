import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { dashboardAPI, offersAPI, publishersAPI } from '../../services/api';
import './Dashboard.css';

// Icons
const OfferIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const AffiliateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const AdvertiserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
);

const ClickIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const ConversionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const RevenueIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ListIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

function Dashboard() {
    const { user } = useAuth();
    const { getStats, offers, affiliates } = useData();
    const [dashboardData, setDashboardData] = useState(null);
    const [topOffers, setTopOffers] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [topAffiliates, setTopAffiliates] = useState([]);
    const [infoCards, setInfoCards] = useState(null);
    const [topCountries, setTopCountries] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [publisherData, setPublisherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topOffersLoading, setTopOffersLoading] = useState(false);
    const [performanceLoading, setPerformanceLoading] = useState(false);
    const [topAffiliatesLoading, setTopAffiliatesLoading] = useState(false);
    const [infoCardsLoading, setInfoCardsLoading] = useState(false);
    const [topCountriesLoading, setTopCountriesLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [detailedLoading, setDetailedLoading] = useState(false);
    const [detailedError, setDetailedError] = useState(null);
    const [publisherLoading, setPublisherLoading] = useState(false);
    const [publisherError, setPublisherError] = useState(null);
    const [offersData, setOffersData] = useState(null);
    const [offersLoading, setOffersLoading] = useState(false);
    const [offersError, setOffersError] = useState(null);
    const [affiliatesData, setAffiliatesData] = useState(null);
    const [affiliatesLoading, setAffiliatesLoading] = useState(false);
    const [affiliatesError, setAffiliatesError] = useState(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await dashboardAPI.getDashboard();
                if (response.success) {
                    setDashboardData(response.data);
                } else {
                    setError('Failed to load dashboard data');
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        const fetchTopOffers = async () => {
            try {
                setTopOffersLoading(true);
                const response = await dashboardAPI.getTopOffers();
                if (response.success) {
                    setTopOffers(response.data || []);
                }
            } catch (err) {
                console.error('Top offers fetch error:', err);
            } finally {
                setTopOffersLoading(false);
            }
        };

        const fetchPerformance = async () => {
            try {
                setPerformanceLoading(true);
                const response = await dashboardAPI.getPerformance();
                if (response.success) {
                    setPerformanceData(response.data || []);
                }
            } catch (err) {
                console.error('Performance fetch error:', err);
            } finally {
                setPerformanceLoading(false);
            }
        };

        const fetchTopAffiliates = async () => {
            try {
                setTopAffiliatesLoading(true);
                const response = await dashboardAPI.getTopAffiliates();
                if (response.success) {
                    setTopAffiliates(response.data || []);
                }
            } catch (err) {
                console.error('Top affiliates fetch error:', err);
            } finally {
                setTopAffiliatesLoading(false);
            }
        };

        const fetchInfoCards = async () => {
            try {
                setInfoCardsLoading(true);
                const response = await dashboardAPI.getInfoCards();
                if (response.success) {
                    setInfoCards(response.data);
                }
            } catch (err) {
                console.error('Info cards fetch error:', err);
            } finally {
                setInfoCardsLoading(false);
            }
        };

        const fetchTopCountries = async () => {
            try {
                setTopCountriesLoading(true);
                const response = await dashboardAPI.getTopCountries();
                if (response.success) {
                    setTopCountries(response.data || []);
                }
            } catch (err) {
                console.error('Top countries fetch error:', err);
            } finally {
                setTopCountriesLoading(false);
            }
        };

        const fetchSummaryData = async () => {
            try {
                setSummaryLoading(true);
                setSummaryError(null);
                const response = await dashboardAPI.getSummary({
                    date_from: '2024-01-01',
                    date_to: new Date().toISOString().split('T')[0],
                    limit: 10
                });
                if (response.success) {
                    setSummaryData(response.data);
                } else {
                    setSummaryError('Failed to load summary data');
                }
            } catch (err) {
                console.error('Summary fetch error:', err);
                setSummaryError(err.message || 'Failed to load summary data');
            } finally {
                setSummaryLoading(false);
            }
        };

        const fetchDetailedData = async () => {
            try {
                setDetailedLoading(true);
                setDetailedError(null);
                const response = await dashboardAPI.getDetailed({
                    page: 1,
                    limit: 10,
                    date_from: '2024-01-01',
                    date_to: new Date().toISOString().split('T')[0]
                });
                if (response.success) {
                    setDetailedData(response.data);
                } else {
                    setDetailedError('Failed to load activity data');
                }
            } catch (err) {
                console.error('Detailed fetch error:', err);
                setDetailedError(err.message || 'Failed to load activity data');
            } finally {
                setDetailedLoading(false);
            }
        };

        const fetchPublisherData = async () => {
            try {
                setPublisherLoading(true);
                setPublisherError(null);
                const response = await dashboardAPI.getPublisherConversions();
                if (response.success) {
                    setPublisherData(response.data);
                } else {
                    setPublisherError('Failed to load publisher data');
                }
            } catch (err) {
                console.error('Publisher fetch error:', err);
                setPublisherError(err.message || 'Failed to load publisher data');
            } finally {
                setPublisherLoading(false);
            }
        };

        const fetchOffersData = async () => {
            try {
                setOffersLoading(true);
                setOffersError(null);
                const response = await offersAPI.getOffers({
                    type: 'live',
                    category: 'Shopping',
                    advertiser_id: 1,
                    page: 1,
                    limit: 20
                });
                if (response.success) {
                    setOffersData(response.data);
                } else {
                    setOffersError('Failed to load offers data');
                }
            } catch (err) {
                console.error('Offers fetch error:', err);
                setOffersError(err.message || 'Failed to load offers data');
            } finally {
                setOffersLoading(false);
            }
        };

        const fetchAffiliatesData = async () => {
            try {
                setAffiliatesLoading(true);
                setAffiliatesError(null);
                const response = await publishersAPI.getPublishers({
                    status: 'active',
                    page: 1,
                    limit: 10
                });
                if (response.success && response.data) {
                    // Sort by some criteria (e.g., by ID or name) and take top 4
                    const sortedAffiliates = response.data
                        .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
                        .slice(0, 4);
                    setAffiliatesData(sortedAffiliates);
                } else {
                    setAffiliatesError('Failed to load affiliates data');
                }
            } catch (err) {
                console.error('Affiliates fetch error:', err);
                setAffiliatesError(err.message || 'Failed to load affiliates data');
            } finally {
                setAffiliatesLoading(false);
            }
        };

        fetchDashboardData();
        fetchTopOffers();
        fetchTopAffiliates();
        fetchInfoCards();
        fetchTopCountries();
        fetchSummaryData();
        fetchDetailedData();
        fetchPublisherData();
        fetchOffersData();
        fetchAffiliatesData();
    }, []);


    // Fallback to local stats if API data not available
    const stats = getStats();
    const apiStats = dashboardData || {};

    // Format number with commas
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    // Calculate trend percentage
    const calculateTrend = (current, previous) => {
        if (!previous || previous === 0) return null;
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive: change >= 0
        };
    };

    // Format trend display component
    const TrendIndicator = ({ current, previous }) => {
        const trend = calculateTrend(current, previous);
        if (trend === null) return null;
        return (
            <div className={`stat-trend ${trend.isPositive ? 'up' : 'down'}`}>
                <ArrowUpIcon style={{ transform: trend.isPositive ? 'none' : 'rotate(180deg)' }} />
                <span>{trend.value}%</span>
            </div>
        );
    };

    // Today's date formatted
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Recent offers for quick access
    const recentOffers = offers.slice(0, 5);

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard-error">
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Dashboard</h1>
                    <p className="dashboard-date">
                        <CalendarIcon />
                        {today}
                    </p>
                </div>
                <div className="dashboard-header-right">
                    <span className="welcome-text">Welcome, <strong>{user?.name || user?.fullName || 'User'}</strong></span>
                </div>
            </div>

            {/* Stats Grid - 6 Cards */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">
                        <OfferIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{apiStats.offers?.total || stats.totalOffers || 0}</span>
                        <span className="stat-label">Total Offers</span>
                    </div>
                    <TrendIndicator current={apiStats.offers?.total || 0} previous={0} />
                    <div className="stat-badge">{apiStats.offers?.active || stats.activeOffers || 0} Active</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">
                        <AffiliateIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{apiStats.publishers?.total || stats.totalAffiliates || 0}</span>
                        <span className="stat-label">Publishers</span>
                    </div>
                    <TrendIndicator current={apiStats.publishers?.total || 0} previous={0} />
                    <div className="stat-badge">{apiStats.publishers?.active || stats.activeAffiliates || 0} Active</div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">
                        <ClickIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatNumber(apiStats.clicks?.total || 0)}</span>
                        <span className="stat-label">Total Clicks</span>
                    </div>
                    <TrendIndicator current={apiStats.clicks?.total || 0} previous={apiStats.clicks?.yesterday || 0} />
                    <div className="stat-badge">{formatNumber(apiStats.clicks?.unique || 0)} Unique</div>
                </div>

                <div className="stat-card teal">
                    <div className="stat-icon">
                        <ConversionIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatNumber(apiStats.conversions?.total || 0)}</span>
                        <span className="stat-label">Conversions</span>
                    </div>
                    <TrendIndicator current={apiStats.conversions?.total || 0} previous={apiStats.conversions?.yesterday || 0} />
                    <div className="stat-badge">
                        {apiStats.conversions?.approved || 0} Approved
                        {apiStats.conversions?.conversion_rate !== undefined && (
                            <span> • {apiStats.conversions.conversion_rate.toFixed(2)}%</span>
                        )}
                    </div>
                </div>

                <div className="stat-card red">
                    <div className="stat-icon">
                        <RevenueIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatCurrency(apiStats.revenue?.total || 0)}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                    <TrendIndicator current={apiStats.revenue?.total || 0} previous={apiStats.revenue?.yesterday || 0} />
                    <div className="stat-badge">
                        Profit: {formatCurrency(apiStats.revenue?.profit || 0)}
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">
                        <AdvertiserIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{apiStats.advertisers?.total || 0}</span>
                        <span className="stat-label">Advertisers</span>
                    </div>
                    <TrendIndicator current={apiStats.advertisers?.total || 0} previous={0} />
                    <div className="stat-badge">{apiStats.advertisers?.active || 0} Active</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content">
                {/* Quick Actions */}
                <div className="dashboard-card quick-actions-card">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                        <Link to="/offer/new" className="action-btn">
                            <div className="action-icon blue">
                                <PlusIcon />
                            </div>
                            <span>New Offer</span>
                        </Link>
                        <Link to="/affiliate/new" className="action-btn">
                            <div className="action-icon green">
                                <AffiliateIcon />
                            </div>
                            <span>Add Affiliate</span>
                        </Link>
                        <Link to="/advertiser/new" className="action-btn">
                            <div className="action-icon orange">
                                <AdvertiserIcon />
                            </div>
                            <span>Add Advertiser</span>
                        </Link>
                        <Link to="/offer/list" className="action-btn">
                            <div className="action-icon purple">
                                <ListIcon />
                            </div>
                            <span>View All Offers</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Offers */}
                <div className="dashboard-card recent-offers-card">
                    <div className="card-header">
                        <h3>Live Offers</h3>
                        <Link to="/offer/list" className="view-all">View All</Link>
                    </div>
                    {offersLoading ? (
                        <div className="loading-spinner">Loading offers...</div>
                    ) : offersError ? (
                        <div className="error-state">
                            <p>Error: {offersError}</p>
                            <button onClick={() => {
                                setOffersError(null);
                                // Re-fetch offers data
                                const fetchOffersData = async () => {
                                    try {
                                        setOffersLoading(true);
                                        setOffersError(null);
                                        const response = await offersAPI.getOffers({
                                            type: 'live',
                                            page: 1,
                                            limit: 20
                                        });
                                        if (response.success) {
                                            setOffersData(response.data);
                                        } else {
                                            setOffersError('Failed to load offers data');
                                        }
                                    } catch (err) {
                                        console.error('Offers fetch error:', err);
                                        setOffersError(err.message || 'Failed to load offers data');
                                    } finally {
                                        setOffersLoading(false);
                                    }
                                };
                                fetchOffersData();
                            }}>Retry</button>
                        </div>
                    ) : offersData && offersData.length > 0 ? (
                        <div className="offers-list">
                            {offersData.slice(0, 5).map(offer => (
                                <div key={offer.id} className="offer-row">
                                    <div className="offer-info">
                                        <span className="offer-name">{offer.name}</span>
                                        <span className="offer-id">ID: {offer.id}</span>
                                        <span className="offer-description">{offer.description}</span>
                                    </div>
                                    <div className="offer-meta">
                                        <span className="offer-country">{offer.country}</span>
                                        <span className={`offer-status ${offer.status.toLowerCase()}`}>{offer.status}</span>
                                        <span className="offer-payout">${offer.affiliate_amount} {offer.affiliate_model}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No offers available</div>
                    )}
                </div>

                {/* Top Affiliates */}
                <div className="dashboard-card affiliates-card">
                    <div className="card-header">
                        <h3>Top Affiliates</h3>
                        <Link to="/affiliate/manage" className="view-all">View All</Link>
                    </div>
                    {topAffiliatesLoading ? (
                        <div className="loading-spinner">Loading affiliates...</div>
                    ) : topAffiliates && topAffiliates.length > 0 ? (
                        <div className="affiliates-list">
                            {topAffiliates.map((aff, idx) => (
                                <div key={aff.publisher_id} className="affiliate-row">
                                    <div className="affiliate-rank">#{idx + 1}</div>
                                    <div className="affiliate-avatar">
                                        {(aff.publisher_name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="affiliate-info">
                                        <span className="affiliate-name">{aff.publisher_name || 'N/A'}</span>
                                        <span className="affiliate-email">{formatNumber(aff.conversions || 0)} conversions</span>
                                    </div>
                                    <div className="affiliate-status active">
                                        {formatNumber(aff.conversions || 0)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No affiliates available</div>
                    )}
                </div>

                {/* Summary Reports */}
                <div className="dashboard-card summary-reports-card">
                    <div className="card-header">
                        <h3>Performance Summary</h3>
                        <span className="period-indicator">Last 30 Days</span>
                    </div>
                    {summaryLoading ? (
                        <div className="loading-spinner">Loading summary...</div>
                    ) : summaryError ? (
                        <div className="error-state">
                            <p>Error: {summaryError}</p>
                            <button onClick={() => {
                                setSummaryError(null);
                                // Re-fetch summary data
                                const fetchSummaryData = async () => {
                                    try {
                                        setSummaryLoading(true);
                                        setSummaryError(null);
                                        const response = await dashboardAPI.getSummary({
                                            date_from: '2024-01-01',
                                            date_to: new Date().toISOString().split('T')[0],
                                            limit: 10
                                        });
                                        if (response.success) {
                                            setSummaryData(response.data);
                                        } else {
                                            setSummaryError('Failed to load summary data');
                                        }
                                    } catch (err) {
                                        console.error('Summary fetch error:', err);
                                        setSummaryError(err.message || 'Failed to load summary data');
                                    } finally {
                                        setSummaryLoading(false);
                                    }
                                };
                                fetchSummaryData();
                            }}>Retry</button>
                        </div>
                    ) : summaryData ? (
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Affiliates</span>
                                <span className="summary-value">{summaryData.affiliates || 0}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Unique Clicks</span>
                                <span className="summary-value">{formatNumber(summaryData.unique_clicks || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Impressions</span>
                                <span className="summary-value">{formatNumber(summaryData.impressions || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Conversions</span>
                                <span className="summary-value">{formatNumber(summaryData.conversions || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Revenue</span>
                                <span className="summary-value">{formatCurrency(summaryData.revenue || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Payout</span>
                                <span className="summary-value">{formatCurrency(summaryData.payout || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Profit</span>
                                <span className="summary-value profit">{formatCurrency(summaryData.profit || 0)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Conv. Rate</span>
                                <span className="summary-value">{summaryData.conversion_rate || 0}%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="no-data">No summary data available</div>
                    )}
                </div>

                {/* Recent Clicks/Conversions */}
                <div className="dashboard-card recent-activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <Link to="/reports" className="view-all">View Detailed Reports</Link>
                    </div>
                    {detailedLoading ? (
                        <div className="loading-spinner">Loading activity...</div>
                    ) : detailedError ? (
                        <div className="error-state">
                            <p>Error: {detailedError}</p>
                            <button onClick={() => {
                                setDetailedError(null);
                                // Re-fetch detailed data
                                const fetchDetailedData = async () => {
                                    try {
                                        setDetailedLoading(true);
                                        setDetailedError(null);
                                        const response = await dashboardAPI.getDetailed({
                                            page: 1,
                                            limit: 10,
                                            date_from: '2024-01-01',
                                            date_to: new Date().toISOString().split('T')[0]
                                        });
                                        if (response.success) {
                                            setDetailedData(response.data);
                                        } else {
                                            setDetailedError('Failed to load activity data');
                                        }
                                    } catch (err) {
                                        console.error('Detailed fetch error:', err);
                                        setDetailedError(err.message || 'Failed to load activity data');
                                    } finally {
                                        setDetailedLoading(false);
                                    }
                                };
                                fetchDetailedData();
                            }}>Retry</button>
                        </div>
                    ) : detailedData && detailedData.length > 0 ? (
                        <div className="activity-table">
                            <div className="table-header">
                                <span>Offer</span>
                                <span>Publisher</span>
                                <span>Clicks</span>
                                <span>Conversions</span>
                                <span>Revenue</span>
                            </div>
                            {detailedData.slice(0, 5).map((item, index) => (
                                <div key={item.click_id || index} className="table-row">
                                    <div className="activity-offer">
                                        <span className="offer-name">{item.offer_name || 'N/A'}</span>
                                        <span className="offer-id">ID: {item.offer_id}</span>
                                    </div>
                                    <div className="activity-publisher">
                                        <span className="publisher-name">{item.publisher_company || item.publisher_email || 'N/A'}</span>
                                    </div>
                                    <div className="activity-clicks">
                                        <span className="click-count">1</span>
                                    </div>
                                    <div className="activity-conversions">
                                        <span className={`conversion-status ${item.conversion_status || 'none'}`}>
                                            {item.conversion_status || 'No'}
                                        </span>
                                    </div>
                                    <div className="activity-revenue">
                                        <span className="revenue-amount">
                                            {formatCurrency(item.conversion_amount || 0)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No recent activity</div>
                    )}
                </div>

                {/* Publisher Performance */}
                <div className="dashboard-card publisher-performance-card">
                    <div className="card-header">
                        <h3>Publisher Performance</h3>
                        <span className="period-indicator">This Month</span>
                    </div>
                    {publisherLoading ? (
                        <div className="loading-spinner">Loading publisher data...</div>
                    ) : publisherError ? (
                        <div className="error-state">
                            <p>Error: {publisherError}</p>
                            <button onClick={() => {
                                setPublisherError(null);
                                // Re-fetch publisher data
                                const fetchPublisherData = async () => {
                                    try {
                                        setPublisherLoading(true);
                                        setPublisherError(null);
                                        const response = await dashboardAPI.getPublisherConversions();
                                        if (response.success) {
                                            setPublisherData(response.data);
                                        } else {
                                            setPublisherError('Failed to load publisher data');
                                        }
                                    } catch (err) {
                                        console.error('Publisher fetch error:', err);
                                        setPublisherError(err.message || 'Failed to load publisher data');
                                    } finally {
                                        setPublisherLoading(false);
                                    }
                                };
                                fetchPublisherData();
                            }}>Retry</button>
                        </div>
                    ) : publisherData && publisherData.stats && publisherData.stats.length > 0 ? (
                        <div className="publisher-list">
                            {publisherData.stats.slice(0, 5).map((stat, index) => (
                                <div key={`${stat.publisher?.id}-${stat.offer?.id}-${index}`} className="publisher-row">
                                    <div className="publisher-info">
                                        <span className="publisher-name">{stat.publisher?.company_name || stat.publisher?.email || 'N/A'}</span>
                                        <span className="publisher-email">{stat.offer?.name || 'N/A'}</span>
                                        <span className="publisher-country">{stat.publisher?.country || 'N/A'}</span>
                                    </div>
                                    <div className="publisher-stats">
                                        <div className="stat">
                                            <span className="stat-label">Clicks</span>
                                            <span className="stat-value">{formatNumber(stat.clicks?.total || 0)}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Conversions</span>
                                            <span className="stat-value">{formatNumber(stat.conversions?.total || 0)}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Revenue</span>
                                            <span className="stat-value">{formatCurrency(stat.revenue?.total || 0)}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Rate</span>
                                            <span className="stat-value">{stat.conversions?.conversion_rate?.toFixed(1) || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {publisherData.summary && (
                                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--text-muted)' }}>
                                    <strong>Summary:</strong> {publisherData.summary.total_publishers || 0} Publishers • {publisherData.summary.total_offers || 0} Offers • {publisherData.summary.total_combinations || 0} Combinations
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-data">No publisher data available</div>
                    )}
                </div>

                {/* Top Offers */}
                <div className="dashboard-card top-offers-card">
                    <div className="card-header">
                        <h3>Top Offers by Conversions</h3>
                    </div>
                    {topOffersLoading ? (
                        <div className="loading-spinner">Loading top offers...</div>
                    ) : topOffers && topOffers.length > 0 ? (
                        <div className="offers-list">
                            {topOffers.map((offer, idx) => (
                                <div key={offer.offer_id} className="offer-row">
                                    <div className="offer-info">
                                        <span className="offer-name">{offer.offer_name || 'N/A'}</span>
                                        <span className="offer-id">ID: {offer.offer_id}</span>
                                    </div>
                                    <div className="offer-meta">
                                        <span className="offer-payout">{formatNumber(offer.conversions || 0)} conversions</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No top offers available</div>
                    )}
                </div>

                {/* Performance Chart */}
                <div className="dashboard-card performance-chart-card">
                    <div className="card-header">
                        <h3>Performance Chart</h3>
                    </div>
                    {performanceLoading ? (
                        <div className="loading-spinner">Loading performance data...</div>
                    ) : performanceData && performanceData.length > 0 ? (
                        <div style={{ padding: '16px' }}>
                            <div className="activity-table">
                                <div className="table-header">
                                    <span>Date</span>
                                    <span>Clicks</span>
                                    <span>Conversions</span>
                                </div>
                                {performanceData.slice(0, 10).map((item, index) => (
                                    <div key={index} className="table-row">
                                        <div>{item.date}</div>
                                        <div>{formatNumber(item.clicks || 0)}</div>
                                        <div>{formatNumber(item.conversions || 0)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-data">No performance data available</div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="dashboard-card info-cards-card">
                    <div className="card-header">
                        <h3>Information</h3>
                    </div>
                    {infoCardsLoading ? (
                        <div className="loading-spinner">Loading info...</div>
                    ) : infoCards ? (
                        <div style={{ padding: '16px' }}>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="summary-label">Active Offers</span>
                                    <span className="summary-value">{infoCards.active_offers || 0}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Offer Requests</span>
                                    <span className="summary-value">{infoCards.offer_requests || 0}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Pending Affiliates</span>
                                    <span className="summary-value">{infoCards.pending_affiliates || 0}</span>
                                </div>
                            </div>
                            {infoCards.account_manager && (
                                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Account Manager</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div><strong>Name:</strong> {infoCards.account_manager.name || 'N/A'}</div>
                                        {infoCards.account_manager.email && <div><strong>Email:</strong> {infoCards.account_manager.email}</div>}
                                        {infoCards.account_manager.phone && <div><strong>Phone:</strong> {infoCards.account_manager.phone}</div>}
                                        {infoCards.account_manager.telegram && <div><strong>Telegram:</strong> {infoCards.account_manager.telegram}</div>}
                                        {infoCards.account_manager.skype && <div><strong>Skype:</strong> {infoCards.account_manager.skype}</div>}
                                    </div>
                                </div>
                            )}
                            {infoCards.signup_link && (
                                <div style={{ marginTop: '12px' }}>
                                    <a href={infoCards.signup_link} target="_blank" rel="noopener noreferrer" className="view-all" style={{ fontSize: '12px' }}>
                                        Signup Link →
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-data">No info available</div>
                    )}
                </div>

                {/* Top Countries */}
                <div className="dashboard-card top-countries-card">
                    <div className="card-header">
                        <h3>Top Countries</h3>
                    </div>
                    {topCountriesLoading ? (
                        <div className="loading-spinner">Loading countries...</div>
                    ) : topCountries && topCountries.length > 0 ? (
                        <div className="activity-table">
                            <div className="table-header">
                                <span>Country</span>
                                <span>Clicks</span>
                                <span>Conversions</span>
                                <span>Revenue</span>
                            </div>
                            {topCountries.map((country, index) => (
                                <div key={country.country_code || index} className="table-row">
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{country.country_name || country.country_code}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{country.country_code}</div>
                                    </div>
                                    <div>{formatNumber(country.clicks || 0)}</div>
                                    <div>{formatNumber(country.conversions || 0)}</div>
                                    <div>{formatCurrency(country.revenue || 0)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No country data available</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
