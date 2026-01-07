# Reports API - Frontend Implementation Guide

## 📋 Overview

This document provides a complete implementation guide for integrating the **Reports API** into the Pulpy Reporting Portal Frontend. All API endpoints are already implemented in `/src/services/api.js` and ready to use.

**Backend Base URL:** `http://localhost:5001/api/admin/reports`  
**Authentication:** All endpoints require admin authentication via Bearer token

---

## ✅ Implementation Status

### Already Implemented Endpoints

All the following endpoints are **already implemented** in `/src/services/api.js`:

| Endpoint | Method | Status | Usage |
|----------|--------|--------|-------|
| `/dashboard/cards` | `dashboardAPI.getDashboardCards()` | ✅ Implemented | Main dashboard metrics for UI cards |
| `/dashboard` | `dashboardAPI.getDashboard()` | ✅ Implemented | Complete dashboard statistics |
| `/dashboard/top-offers` | `dashboardAPI.getTopOffers(params)` | ✅ Implemented | Top performing offers |
| `/dashboard/performance` | `dashboardAPI.getPerformance(params)` | ✅ Implemented | Performance chart data |
| `/dashboard/top-affiliates` | `dashboardAPI.getTopAffiliates(params)` | ✅ Implemented | Top performing affiliates |
| `/dashboard/info-cards` | `dashboardAPI.getInfoCards()` | ✅ Implemented | Additional dashboard info |
| `/dashboard/top-countries` | `dashboardAPI.getTopCountries(params)` | ✅ Implemented | Geographic performance |
| `/summary` | `dashboardAPI.getSummary(params)` | ✅ Implemented | Aggregated summary statistics |
| `/detailed` | `dashboardAPI.getDetailed(params)` | ✅ Implemented | Detailed click-level data |
| `/publisher-conversions` | `dashboardAPI.getPublisherConversions(params)` | ✅ Implemented | Publisher conversion stats |

---

## 🚀 Quick Start Guide

### 1. Import the API

```javascript
import { dashboardAPI } from '../services/api';
```

### 2. Basic Usage Examples

#### Fetch Dashboard Cards (Main Metrics)

```javascript
const fetchDashboardCards = async () => {
  try {
    const response = await dashboardAPI.getDashboardCards();
    if (response.success) {
      console.log('Dashboard Cards:', response.data);
      // response.data contains: offers, publishers, clicks, conversions, revenue, advertisers
    }
  } catch (error) {
    console.error('Error fetching dashboard cards:', error);
  }
};
```

#### Fetch Complete Dashboard Statistics

```javascript
const fetchDashboard = async () => {
  try {
    const response = await dashboardAPI.getDashboard();
    if (response.success) {
      console.log('Dashboard Stats:', response.data);
      // response.data contains: conversions, clicks, impressions, revenue, offers, publishers, advertisers
    }
  } catch (error) {
    console.error('Error fetching dashboard:', error);
  }
};
```

#### Fetch Top Offers with Filters

```javascript
const fetchTopOffers = async () => {
  try {
    const response = await dashboardAPI.getTopOffers({
      limit: 10,
      date_from: '2026-01-01',
      date_to: '2026-01-07'
    });
    if (response.success) {
      console.log('Top Offers:', response.data);
    }
  } catch (error) {
    console.error('Error fetching top offers:', error);
  }
};
```

#### Fetch Performance Chart Data

```javascript
const fetchPerformance = async () => {
  try {
    const response = await dashboardAPI.getPerformance({
      date_from: '2026-01-01',
      date_to: '2026-01-07',
      group_by: 'day' // 'day', 'week', or 'month'
    });
    if (response.success) {
      console.log('Performance Data:', response.data);
      // Array of { date, clicks, conversions }
    }
  } catch (error) {
    console.error('Error fetching performance:', error);
  }
};
```

#### Fetch Summary Report with Filters

```javascript
const fetchSummary = async () => {
  try {
    const response = await dashboardAPI.getSummary({
      date_from: '2026-01-01',
      date_to: '2026-01-07',
      offer_id: 1,
      country: 'US'
    });
    if (response.success) {
      console.log('Summary:', response.data);
      // Contains: affiliates, unique_clicks, impressions, conversions, revenue, payout, profit, conversion_rate
    }
  } catch (error) {
    console.error('Error fetching summary:', error);
  }
};
```

#### Fetch Detailed Report with Pagination

```javascript
const fetchDetailed = async (page = 1, limit = 50) => {
  try {
    const response = await dashboardAPI.getDetailed({
      page,
      limit,
      date_from: '2026-01-01',
      date_to: '2026-01-07',
      offer_id: 1
    });
    if (response.success) {
      console.log('Detailed Data:', response.data);
      console.log('Pagination:', response.pagination);
    }
  } catch (error) {
    console.error('Error fetching detailed report:', error);
  }
};
```

#### Fetch Publisher Conversion Statistics

```javascript
const fetchPublisherStats = async () => {
  try {
    const response = await dashboardAPI.getPublisherConversions({
      publisher_id: 5,
      date_from: '2026-01-01',
      date_to: '2026-01-07'
    });
    if (response.success) {
      console.log('Publisher Stats:', response.data.stats);
      console.log('Summary:', response.data.summary);
    }
  } catch (error) {
    console.error('Error fetching publisher stats:', error);
  }
};
```

---

## 🎨 React Component Examples

### Example 1: Dashboard Cards Component

```javascript
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

function DashboardCards() {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getDashboardCards();
        if (response.success) {
          setCards(response.data);
        } else {
          setError('Failed to load dashboard cards');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cards) return null;

  return (
    <div className="dashboard-cards">
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
        <p className="value">{cards.clicks.total}</p>
        <p className="status">{cards.clicks.status_label}</p>
      </div>
      
      <div className="card">
        <h3>{cards.conversions.label}</h3>
        <p className="value">{cards.conversions.total}</p>
        <p className="status">{cards.conversions.status_label}</p>
      </div>
      
      <div className="card">
        <h3>{cards.revenue.label}</h3>
        <p className="value">${cards.revenue.total}</p>
        <p className="status">{cards.revenue.status_label}</p>
      </div>
      
      <div className="card">
        <h3>{cards.advertisers.label}</h3>
        <p className="value">{cards.advertisers.total}</p>
        <p className="status">{cards.advertisers.status_label}</p>
      </div>
    </div>
  );
}

export default DashboardCards;
```

### Example 2: Custom Hook for Reports

```javascript
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

/**
 * Custom hook for fetching detailed reports with pagination
 * @param {Object} filters - Filter parameters
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} - { data, pagination, loading, error, refetch }
 */
export function useDetailedReport(filters = {}, page = 1, limit = 50) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dashboardAPI.getDetailed({
        ...filters,
        page,
        limit
      });
      
      if (response.success) {
        setData(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page, limit]);

  return { data, pagination, loading, error, refetch: fetchData };
}

/**
 * Custom hook for fetching summary reports
 * @param {Object} filters - Filter parameters
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useSummaryReport(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dashboardAPI.getSummary(filters);
      
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch summary');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}
```

### Example 3: Using the Custom Hook

```javascript
import { useState } from 'react';
import { useDetailedReport } from '../../hooks/useReports';

function DetailedReportTable() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    date_from: '2026-01-01',
    date_to: '2026-01-07'
  });

  const { data, pagination, loading, error } = useDetailedReport(filters, page, 20);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
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
          {data.map((item) => (
            <tr key={item.click_id}>
              <td>{item.offer_name}</td>
              <td>{item.publisher_email}</td>
              <td>{item.country}</td>
              <td>{item.conversion_status || 'No conversion'}</td>
              <td>${item.conversion_amount || 0}</td>
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
    </div>
  );
}

export default DetailedReportTable;
```

---

## 📊 Available Query Parameters

### Date Filters
```javascript
{
  date_from: '2026-01-01',  // Start date (YYYY-MM-DD)
  date_to: '2026-01-07'     // End date (YYYY-MM-DD)
}
```

### Pagination
```javascript
{
  page: 1,      // Page number (default: 1)
  limit: 50     // Records per page (default: 50)
}
```

### Entity Filters
```javascript
{
  offer_id: 1,          // Filter by specific offer
  publisher_id: 5       // Filter by specific publisher
}
```

### Geographic Filters
```javascript
{
  country: 'US'         // Country code (ISO 2-letter)
}
```

### Device Filters
```javascript
{
  device_brand: 'Samsung',
  os: 'Android',
  browser: 'Chrome'
}
```

### Tracking Filters
```javascript
{
  tid: 'tracking123',     // Tracking ID
  rcid: 'remote456',      // Remote Conversion ID
  source_id: 'src789',    // Source ID
  google_id: 'gid012',    // Google ID
  android_id: 'aid345',   // Android ID
  ip: '192.168.1.1'       // IP Address
}
```

### Time Filters
```javascript
{
  hour: 14                // Hour of day (0-23)
}
```

### Sorting & Grouping
```javascript
{
  group_by: 'day',        // For performance charts: 'day', 'week', 'month'
  metric: 'revenue'       // For top countries: 'clicks', 'conversions', 'revenue'
}
```

---

## 🔒 Authentication

All API requests automatically include the Bearer token from localStorage. The token is retrieved from the `bng_user` key:

```javascript
// Token is automatically added by apiRequest helper
// No need to manually add Authorization header
const response = await dashboardAPI.getDashboard();
```

If you need to manually check the token:

```javascript
const getToken = () => {
  const user = localStorage.getItem('bng_user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};
```

---

## 🎯 Response Structures

### Success Response
```javascript
{
  success: true,
  data: { /* endpoint-specific data */ }
}
```

### Error Response
```javascript
{
  success: false,
  error: "Error Type",
  message: "Detailed error message",
  statusCode: 500
}
```

### Pagination Response
```javascript
{
  success: true,
  data: [ /* array of records */ ],
  pagination: {
    page: 1,
    limit: 50,
    total: 1250,
    totalPages: 25
  }
}
```

---

## 🛠️ Utility Functions

### Format Number with Commas
```javascript
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Usage
formatNumber(1234567); // "1,234,567"
```

### Format Currency
```javascript
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Usage
formatCurrency(1234.5); // "$1234.50"
```

### Calculate Trend
```javascript
const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    isPositive: change >= 0
  };
};

// Usage
const trend = calculateTrend(150, 100); // { value: "50.0", isPositive: true }
```

---

## ⚠️ Error Handling Best Practices

### 1. Always Check Success Flag
```javascript
const response = await dashboardAPI.getDashboard();
if (response.success) {
  // Handle success
  setData(response.data);
} else {
  // Handle error
  setError(response.message || 'Failed to load data');
}
```

### 2. Use Try-Catch for Network Errors
```javascript
try {
  const response = await dashboardAPI.getDashboard();
  if (response.success) {
    setData(response.data);
  }
} catch (error) {
  // Network error or other exception
  console.error('Error:', error);
  setError(error.message || 'Network error occurred');
}
```

### 3. Implement Retry Logic
```javascript
const fetchWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      if (response.success) {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

// Usage
const response = await fetchWithRetry(() => dashboardAPI.getDashboard());
```

---

## 🚀 Performance Optimization

### 1. Implement Caching
```javascript
const CACHE_DURATION = 30000; // 30 seconds
let cache = {};

const fetchWithCache = async (key, apiCall) => {
  const now = Date.now();
  
  if (cache[key] && (now - cache[key].timestamp) < CACHE_DURATION) {
    return cache[key].data;
  }
  
  const response = await apiCall();
  cache[key] = {
    data: response,
    timestamp: now
  };
  
  return response;
};

// Usage
const response = await fetchWithCache(
  'dashboard',
  () => dashboardAPI.getDashboard()
);
```

### 2. Debounce API Calls
```javascript
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

function SearchComponent() {
  const debouncedSearch = useCallback(
    debounce(async (filters) => {
      const response = await dashboardAPI.getDetailed(filters);
      // Handle response
    }, 500),
    []
  );

  const handleFilterChange = (newFilters) => {
    debouncedSearch(newFilters);
  };

  // ...
}
```

### 3. Parallel API Calls
```javascript
const fetchAllDashboardData = async () => {
  try {
    const [cards, topOffers, performance, topAffiliates] = await Promise.all([
      dashboardAPI.getDashboardCards(),
      dashboardAPI.getTopOffers(),
      dashboardAPI.getPerformance(),
      dashboardAPI.getTopAffiliates()
    ]);
    
    return {
      cards: cards.data,
      topOffers: topOffers.data,
      performance: performance.data,
      topAffiliates: topAffiliates.data
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
```

---

## 📝 Complete API Reference

### dashboardAPI.getDashboardCards()
**Returns:** Main dashboard metrics for UI cards display
```javascript
{
  offers: { total, active, label, status_label },
  publishers: { total, active, label, status_label },
  clicks: { total, unique, label, status_label },
  conversions: { total, approved, pending, rejected, approval_rate, label, status_label },
  revenue: { total, payout, profit, today, yesterday, change, label, status_label },
  advertisers: { total, active, label, status_label }
}
```

### dashboardAPI.getDashboard()
**Returns:** Complete dashboard statistics
```javascript
{
  conversions: { total, yesterday, conversion_rate, approved, pending, rejected },
  clicks: { total, yesterday, unique, mtd },
  impressions: { total, yesterday, mtd },
  revenue: { total, yesterday, mtd, profit, payout },
  offers: { total, active, paused, pending },
  publishers: { total, active, pending, suspended },
  advertisers: { total, active }
}
```

### dashboardAPI.getTopOffers(params)
**Params:** `{ limit?, date_from?, date_to? }`  
**Returns:** Array of top offers
```javascript
[
  { offer_id, offer_name, conversions }
]
```

### dashboardAPI.getPerformance(params)
**Params:** `{ date_from?, date_to?, group_by? }`  
**Returns:** Performance data over time
```javascript
[
  { date, clicks, conversions }
]
```

### dashboardAPI.getTopAffiliates(params)
**Params:** `{ limit?, date_from?, date_to? }`  
**Returns:** Top performing affiliates
```javascript
{
  data: [
    { publisher_id, publisher_name, conversions }
  ],
  total_conversions
}
```

### dashboardAPI.getInfoCards()
**Returns:** Additional dashboard information
```javascript
{
  active_offers,
  offer_requests,
  pending_affiliates,
  account_manager: { name, telegram, skype, email, phone },
  signup_link
}
```

### dashboardAPI.getTopCountries(params)
**Params:** `{ limit?, date_from?, date_to?, metric? }`  
**Returns:** Geographic performance data
```javascript
[
  { country_code, country_name, clicks, conversions, revenue }
]
```

### dashboardAPI.getSummary(params)
**Params:** All filter parameters  
**Returns:** Aggregated summary statistics
```javascript
{
  affiliates,
  unique_clicks,
  impressions,
  conversions,
  revenue,
  payout,
  profit,
  conversion_rate
}
```

### dashboardAPI.getDetailed(params)
**Params:** All filter parameters + pagination  
**Returns:** Detailed click-level data
```javascript
{
  data: [
    {
      click_id, click_uuid, offer_id, offer_name,
      publisher_id, publisher_email, publisher_company,
      ip, user_agent, referrer, country, region, city,
      device_type, browser, os, device_brand,
      conversion_id, conversion_status, conversion_amount,
      // ... and more fields
    }
  ],
  pagination: { page, limit, total, totalPages }
}
```

### dashboardAPI.getPublisherConversions(params)
**Params:** `{ publisher_id?, offer_id?, date_from?, date_to? }`  
**Returns:** Publisher conversion statistics
```javascript
{
  stats: [
    {
      publisher: { id, email, company_name, country },
      offer: { id, name, category },
      clicks: { total },
      conversions: { total, approved, pending, rejected, conversion_rate, approval_rate },
      revenue: { total, approved },
      payout: { total, approved },
      profit: { total, approved }
    }
  ],
  summary: { total_publishers, total_offers, total_combinations }
}
```

---

## 🔧 Configuration

### Update Base URL

If you need to change the backend URL, update the `.env` file:

```env
VITE_API_URL=http://localhost:5001
```

Or directly in `/src/services/api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
```

---

## 📚 Additional Resources

- **API Documentation:** See the complete Reports API documentation
- **Dashboard Component:** `/src/pages/Dashboard/Dashboard.jsx` - Reference implementation
- **API Service:** `/src/services/api.js` - All API methods

---

## 🎉 Summary

✅ **All 10 Reports API endpoints are implemented and ready to use**  
✅ **Authentication is handled automatically**  
✅ **Response structures are consistent**  
✅ **Error handling is built-in**  
✅ **Examples and best practices provided**

You can now use these APIs throughout your application to build powerful reporting features!

---

**Last Updated:** January 7, 2026  
**API Version:** 1.0  
**Frontend Implementation:** Complete
