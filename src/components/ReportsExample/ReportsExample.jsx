import { useState } from 'react';
import {
    useDashboardCards,
    useTopOffers,
    usePerformance,
    useTopAffiliates,
    useInfoCards,
    useTopCountries,
    useSummaryReport,
    useDetailedReport,
    usePublisherConversions
} from '../../hooks/useReports';
import './ReportsExample.css';

/**
 * Example component demonstrating how to use the Reports API hooks
 * This is a reference implementation showing all available hooks
 */
function ReportsExample() {
    // State for filters
    const [dateRange, setDateRange] = useState({
        date_from: '2026-01-01',
        date_to: '2026-01-07'
    });
    const [page, setPage] = useState(1);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedPublisher, setSelectedPublisher] = useState(null);

    // Dashboard Cards Hook
    const {
        data: cards,
        loading: cardsLoading,
        error: cardsError,
        refetch: refetchCards
    } = useDashboardCards();

    // Top Offers Hook
    const {
        data: topOffers,
        loading: offersLoading,
        error: offersError
    } = useTopOffers({
        limit: 5,
        ...dateRange
    });

    // Performance Chart Hook
    const {
        data: performance,
        loading: performanceLoading,
        error: performanceError
    } = usePerformance({
        ...dateRange,
        group_by: 'day'
    });

    // Top Affiliates Hook
    const {
        data: topAffiliates,
        totalConversions,
        loading: affiliatesLoading,
        error: affiliatesError
    } = useTopAffiliates({
        limit: 5,
        ...dateRange
    });

    // Info Cards Hook
    const {
        data: infoCards,
        loading: infoLoading,
        error: infoError
    } = useInfoCards();

    // Top Countries Hook
    const {
        data: topCountries,
        loading: countriesLoading,
        error: countriesError
    } = useTopCountries({
        limit: 10,
        ...dateRange,
        metric: 'revenue'
    });

    // Summary Report Hook
    const {
        data: summary,
        loading: summaryLoading,
        error: summaryError
    } = useSummaryReport({
        ...dateRange,
        ...(selectedOffer && { offer_id: selectedOffer }),
        ...(selectedPublisher && { publisher_id: selectedPublisher })
    });

    // Detailed Report Hook with Pagination
    const {
        data: detailed,
        pagination,
        loading: detailedLoading,
        error: detailedError
    } = useDetailedReport(
        {
            ...dateRange,
            ...(selectedOffer && { offer_id: selectedOffer })
        },
        page,
        20
    );

    // Publisher Conversions Hook
    const {
        stats: publisherStats,
        summary: publisherSummary,
        loading: publisherLoading,
        error: publisherError
    } = usePublisherConversions({
        ...dateRange,
        ...(selectedPublisher && { publisher_id: selectedPublisher })
    });

    // Utility functions
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className="reports-example">
            <h1>Reports API - Example Implementation</h1>

            {/* Date Range Filter */}
            <div className="filters">
                <h3>Filters</h3>
                <div className="filter-group">
                    <label>
                        From:
                        <input
                            type="date"
                            value={dateRange.date_from}
                            onChange={(e) => setDateRange({ ...dateRange, date_from: e.target.value })}
                        />
                    </label>
                    <label>
                        To:
                        <input
                            type="date"
                            value={dateRange.date_to}
                            onChange={(e) => setDateRange({ ...dateRange, date_to: e.target.value })}
                        />
                    </label>
                </div>
            </div>

            {/* Dashboard Cards Section */}
            <section className="section">
                <h2>Dashboard Cards</h2>
                {cardsLoading && <div className="loading">Loading cards...</div>}
                {cardsError && <div className="error">Error: {cardsError}</div>}
                {cards && (
                    <div className="cards-grid">
                        <div className="card">
                            <h3>{cards.offers.label}</h3>
                            <p className="value">{cards.offers.total}</p>
                            <p className="status">{cards.offers.status_label}</p>
                        </div>
                        <div className="card">
                            <h3>{cards.publishers.label}</h3>
                            <p className="value">{cards.publishers.total}</p>
                            <p className="status">{cards.publishers.status_label}</p>
                        </div>
                        <div className="card">
                            <h3>{cards.clicks.label}</h3>
                            <p className="value">{formatNumber(cards.clicks.total)}</p>
                            <p className="status">{cards.clicks.status_label}</p>
                        </div>
                        <div className="card">
                            <h3>{cards.conversions.label}</h3>
                            <p className="value">{formatNumber(cards.conversions.total)}</p>
                            <p className="status">{cards.conversions.status_label}</p>
                        </div>
                        <div className="card">
                            <h3>{cards.revenue.label}</h3>
                            <p className="value">{formatCurrency(cards.revenue.total)}</p>
                            <p className="status">{cards.revenue.status_label}</p>
                        </div>
                        <div className="card">
                            <h3>{cards.advertisers.label}</h3>
                            <p className="value">{cards.advertisers.total}</p>
                            <p className="status">{cards.advertisers.status_label}</p>
                        </div>
                    </div>
                )}
                <button onClick={refetchCards}>Refresh Cards</button>
            </section>

            {/* Top Offers Section */}
            <section className="section">
                <h2>Top Offers by Conversions</h2>
                {offersLoading && <div className="loading">Loading offers...</div>}
                {offersError && <div className="error">Error: {offersError}</div>}
                {topOffers && topOffers.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Offer ID</th>
                                <th>Offer Name</th>
                                <th>Conversions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topOffers.map((offer) => (
                                <tr key={offer.offer_id}>
                                    <td>{offer.offer_id}</td>
                                    <td>{offer.offer_name}</td>
                                    <td>{formatNumber(offer.conversions)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Performance Chart Section */}
            <section className="section">
                <h2>Performance Chart</h2>
                {performanceLoading && <div className="loading">Loading performance...</div>}
                {performanceError && <div className="error">Error: {performanceError}</div>}
                {performance && performance.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Clicks</th>
                                <th>Conversions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {performance.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>{formatNumber(item.clicks)}</td>
                                    <td>{formatNumber(item.conversions)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Top Affiliates Section */}
            <section className="section">
                <h2>Top Affiliates</h2>
                {affiliatesLoading && <div className="loading">Loading affiliates...</div>}
                {affiliatesError && <div className="error">Error: {affiliatesError}</div>}
                {topAffiliates && topAffiliates.length > 0 && (
                    <>
                        <p>Total Conversions: {formatNumber(totalConversions)}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Publisher ID</th>
                                    <th>Publisher Name</th>
                                    <th>Conversions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topAffiliates.map((affiliate) => (
                                    <tr key={affiliate.publisher_id}>
                                        <td>{affiliate.publisher_id}</td>
                                        <td>{affiliate.publisher_name}</td>
                                        <td>{formatNumber(affiliate.conversions)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>

            {/* Info Cards Section */}
            <section className="section">
                <h2>Information</h2>
                {infoLoading && <div className="loading">Loading info...</div>}
                {infoError && <div className="error">Error: {infoError}</div>}
                {infoCards && (
                    <div>
                        <p>Active Offers: {infoCards.active_offers}</p>
                        <p>Offer Requests: {infoCards.offer_requests}</p>
                        <p>Pending Affiliates: {infoCards.pending_affiliates}</p>
                        {infoCards.account_manager && (
                            <div className="account-manager">
                                <h4>Account Manager</h4>
                                <p>Name: {infoCards.account_manager.name}</p>
                                {infoCards.account_manager.email && <p>Email: {infoCards.account_manager.email}</p>}
                                {infoCards.account_manager.phone && <p>Phone: {infoCards.account_manager.phone}</p>}
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Top Countries Section */}
            <section className="section">
                <h2>Top Countries</h2>
                {countriesLoading && <div className="loading">Loading countries...</div>}
                {countriesError && <div className="error">Error: {countriesError}</div>}
                {topCountries && topCountries.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Country</th>
                                <th>Clicks</th>
                                <th>Conversions</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCountries.map((country) => (
                                <tr key={country.country_code}>
                                    <td>{country.country_name} ({country.country_code})</td>
                                    <td>{formatNumber(country.clicks)}</td>
                                    <td>{formatNumber(country.conversions)}</td>
                                    <td>{formatCurrency(country.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Summary Report Section */}
            <section className="section">
                <h2>Summary Report</h2>
                {summaryLoading && <div className="loading">Loading summary...</div>}
                {summaryError && <div className="error">Error: {summaryError}</div>}
                {summary && (
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span>Affiliates:</span>
                            <span>{summary.affiliates}</span>
                        </div>
                        <div className="summary-item">
                            <span>Unique Clicks:</span>
                            <span>{formatNumber(summary.unique_clicks)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Impressions:</span>
                            <span>{formatNumber(summary.impressions)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Conversions:</span>
                            <span>{formatNumber(summary.conversions)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Revenue:</span>
                            <span>{formatCurrency(summary.revenue)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Payout:</span>
                            <span>{formatCurrency(summary.payout)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Profit:</span>
                            <span>{formatCurrency(summary.profit)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Conversion Rate:</span>
                            <span>{summary.conversion_rate}%</span>
                        </div>
                    </div>
                )}
            </section>

            {/* Detailed Report Section */}
            <section className="section">
                <h2>Detailed Report</h2>
                {detailedLoading && <div className="loading">Loading detailed report...</div>}
                {detailedError && <div className="error">Error: {detailedError}</div>}
                {detailed && detailed.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Offer</th>
                                    <th>Publisher</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailed.map((item) => (
                                    <tr key={item.click_id}>
                                        <td>{item.offer_name}</td>
                                        <td>{item.publisher_email}</td>
                                        <td>{item.country}</td>
                                        <td>{item.conversion_status || 'No conversion'}</td>
                                        <td>{formatCurrency(item.conversion_amount || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pagination && (
                            <div className="pagination">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {pagination.page} of {pagination.totalPages}</span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Publisher Conversions Section */}
            <section className="section">
                <h2>Publisher Conversion Statistics</h2>
                {publisherLoading && <div className="loading">Loading publisher stats...</div>}
                {publisherError && <div className="error">Error: {publisherError}</div>}
                {publisherStats && publisherStats.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Offer</th>
                                    <th>Clicks</th>
                                    <th>Conversions</th>
                                    <th>Revenue</th>
                                    <th>Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publisherStats.map((stat, index) => (
                                    <tr key={index}>
                                        <td>{stat.publisher?.company_name || stat.publisher?.email}</td>
                                        <td>{stat.offer?.name}</td>
                                        <td>{formatNumber(stat.clicks?.total)}</td>
                                        <td>{formatNumber(stat.conversions?.total)}</td>
                                        <td>{formatCurrency(stat.revenue?.total)}</td>
                                        <td>{stat.conversions?.conversion_rate?.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {publisherSummary && (
                            <div className="summary">
                                <p>Total Publishers: {publisherSummary.total_publishers}</p>
                                <p>Total Offers: {publisherSummary.total_offers}</p>
                                <p>Total Combinations: {publisherSummary.total_combinations}</p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default ReportsExample;
