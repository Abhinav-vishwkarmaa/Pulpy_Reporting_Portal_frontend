# Reports API - Quick Reference

## 🚀 Quick Start

### 1. Import the API
```javascript
import { dashboardAPI } from '../services/api';
```

### 2. Import Hooks (Recommended)
```javascript
import { useDashboardCards, useSummaryReport, useDetailedReport } from '../hooks/useReports';
```

---

## 📡 All Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getDashboardCards()` | `/dashboard/cards` | Main dashboard metrics |
| `getDashboard()` | `/dashboard` | Complete dashboard stats |
| `getTopOffers(params)` | `/dashboard/top-offers` | Top performing offers |
| `getPerformance(params)` | `/dashboard/performance` | Performance chart data |
| `getTopAffiliates(params)` | `/dashboard/top-affiliates` | Top affiliates |
| `getInfoCards()` | `/dashboard/info-cards` | Additional info |
| `getTopCountries(params)` | `/dashboard/top-countries` | Geographic data |
| `getSummary(params)` | `/summary` | Summary report |
| `getDetailed(params)` | `/detailed` | Detailed report |
| `getPublisherConversions(params)` | `/publisher-conversions` | Publisher stats |

---

## 🎯 Common Use Cases

### Use Case 1: Display Dashboard Cards
```javascript
const { data, loading, error } = useDashboardCards();

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
  <div>
    <h3>Total Offers: {data.offers.total}</h3>
    <h3>Total Revenue: ${data.revenue.total}</h3>
  </div>
);
```

### Use Case 2: Fetch Summary with Filters
```javascript
const { data, loading, error } = useSummaryReport({
  date_from: '2026-01-01',
  date_to: '2026-01-07',
  offer_id: 1,
  country: 'US'
});
```

### Use Case 3: Paginated Detailed Report
```javascript
const [page, setPage] = useState(1);
const { data, pagination, loading, error } = useDetailedReport(
  { date_from: '2026-01-01', date_to: '2026-01-07' },
  page,
  50
);

// Navigate pages
<button onClick={() => setPage(page + 1)}>Next</button>
```

### Use Case 4: Direct API Call (Without Hooks)
```javascript
const fetchData = async () => {
  try {
    const response = await dashboardAPI.getDashboardCards();
    if (response.success) {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔧 Common Filters

### Date Range
```javascript
{
  date_from: '2026-01-01',
  date_to: '2026-01-07'
}
```

### Entity Filters
```javascript
{
  offer_id: 1,
  publisher_id: 5,
  country: 'US'
}
```

### Pagination
```javascript
{
  page: 1,
  limit: 50
}
```

### Device & Tracking
```javascript
{
  device_brand: 'Samsung',
  os: 'Android',
  browser: 'Chrome',
  tid: 'tracking123',
  source_id: 'src789'
}
```

---

## 📊 Response Formats

### Dashboard Cards Response
```javascript
{
  success: true,
  data: {
    offers: { total, active, label, status_label },
    publishers: { total, active, label, status_label },
    clicks: { total, unique, label, status_label },
    conversions: { total, approved, pending, rejected, approval_rate, label, status_label },
    revenue: { total, payout, profit, today, yesterday, change, label, status_label },
    advertisers: { total, active, label, status_label }
  }
}
```

### Summary Report Response
```javascript
{
  success: true,
  data: {
    affiliates: 5,
    unique_clicks: 1250,
    impressions: 5000,
    conversions: 125,
    revenue: 450.75,
    payout: 375.50,
    profit: 75.25,
    conversion_rate: 10.00
  }
}
```

### Detailed Report Response
```javascript
{
  success: true,
  data: [
    {
      click_id, click_uuid, offer_id, offer_name,
      publisher_id, publisher_email, publisher_company,
      ip, country, device_type, browser, os,
      conversion_id, conversion_status, conversion_amount,
      // ... more fields
    }
  ],
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

### Format Number
```javascript
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
```

### Format Currency
```javascript
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
};
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
```

---

## ⚠️ Error Handling

### Always Check Success Flag
```javascript
const response = await dashboardAPI.getDashboard();
if (response.success) {
  // Success
  setData(response.data);
} else {
  // Error
  setError(response.message);
}
```

### Use Try-Catch
```javascript
try {
  const response = await dashboardAPI.getDashboard();
  if (response.success) {
    setData(response.data);
  }
} catch (error) {
  console.error('Network error:', error);
  setError(error.message);
}
```

---

## 🎨 Example Components

### Simple Dashboard Card
```javascript
function DashboardCard() {
  const { data, loading, error } = useDashboardCards();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="card">
      <h3>{data.revenue.label}</h3>
      <p>${data.revenue.total}</p>
      <p>{data.revenue.status_label}</p>
    </div>
  );
}
```

### Filtered Summary Report
```javascript
function SummaryReport({ dateFrom, dateTo, offerId }) {
  const { data, loading, error } = useSummaryReport({
    date_from: dateFrom,
    date_to: dateTo,
    offer_id: offerId
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <p>Conversions: {data.conversions}</p>
      <p>Revenue: ${data.revenue}</p>
      <p>Profit: ${data.profit}</p>
      <p>Conversion Rate: {data.conversion_rate}%</p>
    </div>
  );
}
```

### Paginated Table
```javascript
function DetailedTable() {
  const [page, setPage] = useState(1);
  const { data, pagination, loading, error } = useDetailedReport({}, page, 20);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Offer</th>
            <th>Publisher</th>
            <th>Country</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.click_id}>
              <td>{item.offer_name}</td>
              <td>{item.publisher_email}</td>
              <td>{item.country}</td>
              <td>{item.conversion_status || 'No conversion'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}>
          Next
        </button>
      </div>
    </>
  );
}
```

---

## 🚀 Performance Tips

### 1. Use Hooks for Automatic Caching
```javascript
// Hooks automatically manage state and re-fetching
const { data, loading, error } = useDashboardCards();
```

### 2. Fetch Multiple Endpoints in Parallel
```javascript
const fetchAll = async () => {
  const [cards, summary, topOffers] = await Promise.all([
    dashboardAPI.getDashboardCards(),
    dashboardAPI.getSummary(),
    dashboardAPI.getTopOffers()
  ]);
};
```

### 3. Implement Manual Caching
```javascript
const CACHE_DURATION = 30000; // 30 seconds
let cache = {};

const fetchWithCache = async (key, apiCall) => {
  const now = Date.now();
  if (cache[key] && (now - cache[key].timestamp) < CACHE_DURATION) {
    return cache[key].data;
  }
  const response = await apiCall();
  cache[key] = { data: response, timestamp: now };
  return response;
};
```

---

## 📝 Checklist

- [ ] Import `dashboardAPI` from `../services/api`
- [ ] Import hooks from `../hooks/useReports` (recommended)
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Check `response.success` before using data
- [ ] Use try-catch for network errors
- [ ] Format numbers and currency for display
- [ ] Implement pagination for large datasets
- [ ] Add filters for better data insights
- [ ] Test with different date ranges

---

## 🔗 Resources

- **Full Documentation:** `REPORTS_API_FRONTEND_GUIDE.md`
- **API Service:** `/src/services/api.js`
- **Custom Hooks:** `/src/hooks/useReports.js`
- **Example Component:** `/src/components/ReportsExample/ReportsExample.jsx`
- **Dashboard Component:** `/src/pages/Dashboard/Dashboard.jsx`

---

**Last Updated:** January 7, 2026  
**Version:** 1.0
