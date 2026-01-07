# Reports API - Testing Guide

## 🧪 Testing Checklist

Use this guide to verify that all Reports API endpoints are working correctly.

---

## 🚀 Prerequisites

Before testing, ensure:

- [ ] Backend server is running on `http://localhost:5001`
- [ ] Frontend development server is running (`npm run dev`)
- [ ] You are logged in as an admin user
- [ ] Browser console is open (F12) to view API responses

---

## 📋 Test Cases

### Test 1: Dashboard Cards API

**Endpoint:** `GET /api/admin/reports/dashboard/cards`

**Test Code:**
```javascript
import { dashboardAPI } from './src/services/api';

async function testDashboardCards() {
  console.log('Testing Dashboard Cards API...');
  try {
    const response = await dashboardAPI.getDashboardCards();
    console.log('✅ Success:', response);
    
    // Verify response structure
    if (response.success && response.data) {
      console.log('✅ Response has correct structure');
      console.log('Offers:', response.data.offers);
      console.log('Publishers:', response.data.publishers);
      console.log('Clicks:', response.data.clicks);
      console.log('Conversions:', response.data.conversions);
      console.log('Revenue:', response.data.revenue);
      console.log('Advertisers:', response.data.advertisers);
    } else {
      console.error('❌ Invalid response structure');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDashboardCards();
```

**Expected Result:**
```javascript
{
  success: true,
  data: {
    offers: { total: 3, active: 3, label: "TOTAL OFFERS", status_label: "Active" },
    publishers: { total: 2, active: 2, label: "PUBLISHERS", status_label: "Active" },
    clicks: { total: 29, unique: 28, label: "TOTAL CLICKS", status_label: "Unique" },
    conversions: { total: 4, approved: 4, pending: 0, rejected: 0, approval_rate: "100.00%", ... },
    revenue: { total: "0.36", payout: "0.30", profit: "0.06", ... },
    advertisers: { total: 2, active: 2, label: "ADVERTISERS", status_label: "Active" }
  }
}
```

---

### Test 2: Complete Dashboard API

**Endpoint:** `GET /api/admin/reports/dashboard`

**Test Code:**
```javascript
async function testDashboard() {
  console.log('Testing Dashboard API...');
  try {
    const response = await dashboardAPI.getDashboard();
    console.log('✅ Success:', response);
    
    if (response.success && response.data) {
      console.log('✅ Response has correct structure');
      console.log('Conversions:', response.data.conversions);
      console.log('Clicks:', response.data.clicks);
      console.log('Revenue:', response.data.revenue);
      console.log('Offers:', response.data.offers);
      console.log('Publishers:', response.data.publishers);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDashboard();
```

---

### Test 3: Top Offers API

**Endpoint:** `GET /api/admin/reports/dashboard/top-offers`

**Test Code:**
```javascript
async function testTopOffers() {
  console.log('Testing Top Offers API...');
  try {
    const response = await dashboardAPI.getTopOffers({
      limit: 5,
      date_from: '2026-01-01',
      date_to: '2026-01-07'
    });
    console.log('✅ Success:', response);
    
    if (response.success && Array.isArray(response.data)) {
      console.log('✅ Response is an array');
      console.log('Number of offers:', response.data.length);
      response.data.forEach((offer, index) => {
        console.log(`${index + 1}. ${offer.offer_name}: ${offer.conversions} conversions`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTopOffers();
```

---

### Test 4: Performance Chart API

**Endpoint:** `GET /api/admin/reports/dashboard/performance`

**Test Code:**
```javascript
async function testPerformance() {
  console.log('Testing Performance Chart API...');
  try {
    const response = await dashboardAPI.getPerformance({
      date_from: '2026-01-01',
      date_to: '2026-01-07',
      group_by: 'day'
    });
    console.log('✅ Success:', response);
    
    if (response.success && Array.isArray(response.data)) {
      console.log('✅ Response is an array');
      console.log('Number of data points:', response.data.length);
      response.data.forEach((item) => {
        console.log(`${item.date}: ${item.clicks} clicks, ${item.conversions} conversions`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPerformance();
```

---

### Test 5: Top Affiliates API

**Endpoint:** `GET /api/admin/reports/dashboard/top-affiliates`

**Test Code:**
```javascript
async function testTopAffiliates() {
  console.log('Testing Top Affiliates API...');
  try {
    const response = await dashboardAPI.getTopAffiliates({
      limit: 5
    });
    console.log('✅ Success:', response);
    
    if (response.success && Array.isArray(response.data)) {
      console.log('✅ Response is an array');
      console.log('Total conversions:', response.total_conversions);
      response.data.forEach((affiliate, index) => {
        console.log(`${index + 1}. ${affiliate.publisher_name}: ${affiliate.conversions} conversions`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTopAffiliates();
```

---

### Test 6: Info Cards API

**Endpoint:** `GET /api/admin/reports/dashboard/info-cards`

**Test Code:**
```javascript
async function testInfoCards() {
  console.log('Testing Info Cards API...');
  try {
    const response = await dashboardAPI.getInfoCards();
    console.log('✅ Success:', response);
    
    if (response.success && response.data) {
      console.log('✅ Response has correct structure');
      console.log('Active Offers:', response.data.active_offers);
      console.log('Offer Requests:', response.data.offer_requests);
      console.log('Pending Affiliates:', response.data.pending_affiliates);
      if (response.data.account_manager) {
        console.log('Account Manager:', response.data.account_manager.name);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testInfoCards();
```

---

### Test 7: Top Countries API

**Endpoint:** `GET /api/admin/reports/dashboard/top-countries`

**Test Code:**
```javascript
async function testTopCountries() {
  console.log('Testing Top Countries API...');
  try {
    const response = await dashboardAPI.getTopCountries({
      limit: 10,
      metric: 'revenue'
    });
    console.log('✅ Success:', response);
    
    if (response.success && Array.isArray(response.data)) {
      console.log('✅ Response is an array');
      console.log('Number of countries:', response.data.length);
      response.data.forEach((country, index) => {
        console.log(`${index + 1}. ${country.country_name}: $${country.revenue}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTopCountries();
```

---

### Test 8: Summary Report API

**Endpoint:** `GET /api/admin/reports/summary`

**Test Code:**
```javascript
async function testSummary() {
  console.log('Testing Summary Report API...');
  try {
    const response = await dashboardAPI.getSummary({
      date_from: '2026-01-01',
      date_to: '2026-01-07',
      offer_id: 1,
      country: 'US'
    });
    console.log('✅ Success:', response);
    
    if (response.success && response.data) {
      console.log('✅ Response has correct structure');
      console.log('Affiliates:', response.data.affiliates);
      console.log('Unique Clicks:', response.data.unique_clicks);
      console.log('Conversions:', response.data.conversions);
      console.log('Revenue:', response.data.revenue);
      console.log('Payout:', response.data.payout);
      console.log('Profit:', response.data.profit);
      console.log('Conversion Rate:', response.data.conversion_rate + '%');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSummary();
```

---

### Test 9: Detailed Report API

**Endpoint:** `GET /api/admin/reports/detailed`

**Test Code:**
```javascript
async function testDetailed() {
  console.log('Testing Detailed Report API...');
  try {
    const response = await dashboardAPI.getDetailed({
      page: 1,
      limit: 20,
      date_from: '2026-01-01',
      date_to: '2026-01-07'
    });
    console.log('✅ Success:', response);
    
    if (response.success && Array.isArray(response.data)) {
      console.log('✅ Response is an array');
      console.log('Number of records:', response.data.length);
      console.log('Pagination:', response.pagination);
      
      if (response.data.length > 0) {
        const firstRecord = response.data[0];
        console.log('First record:', {
          click_id: firstRecord.click_id,
          offer_name: firstRecord.offer_name,
          publisher_email: firstRecord.publisher_email,
          country: firstRecord.country,
          conversion_status: firstRecord.conversion_status
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDetailed();
```

---

### Test 10: Publisher Conversions API

**Endpoint:** `GET /api/admin/reports/publisher-conversions`

**Test Code:**
```javascript
async function testPublisherConversions() {
  console.log('Testing Publisher Conversions API...');
  try {
    const response = await dashboardAPI.getPublisherConversions({
      publisher_id: 5,
      date_from: '2026-01-01',
      date_to: '2026-01-07'
    });
    console.log('✅ Success:', response);
    
    if (response.success && response.data) {
      console.log('✅ Response has correct structure');
      console.log('Number of stats:', response.data.stats?.length || 0);
      console.log('Summary:', response.data.summary);
      
      if (response.data.stats && response.data.stats.length > 0) {
        const firstStat = response.data.stats[0];
        console.log('First stat:', {
          publisher: firstStat.publisher?.company_name,
          offer: firstStat.offer?.name,
          clicks: firstStat.clicks?.total,
          conversions: firstStat.conversions?.total,
          revenue: firstStat.revenue?.total
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testPublisherConversions();
```

---

## 🧪 Testing with React Hooks

### Test Hook: useDashboardCards

**Test Code:**
```javascript
import { useDashboardCards } from './src/hooks/useReports';

function TestComponent() {
  const { data, loading, error, refetch } = useDashboardCards();

  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h3>Dashboard Cards Test</h3>
      <p>Total Offers: {data.offers.total}</p>
      <p>Total Revenue: ${data.revenue.total}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## 🔍 Manual Testing in Browser

### Step 1: Open Browser Console
1. Open your browser (Chrome/Firefox/Edge)
2. Press F12 to open Developer Tools
3. Go to the Console tab

### Step 2: Copy and Paste Test Code
1. Copy any test function from above
2. Paste it into the browser console
3. Press Enter to execute

### Step 3: Verify Results
- ✅ Look for "✅ Success" messages
- ❌ Check for any "❌ Error" messages
- 📊 Inspect the logged data

---

## 📊 Expected Response Times

| Endpoint | Expected Time | Status |
|----------|---------------|--------|
| Dashboard Cards | < 500ms | ⚡ Fast |
| Dashboard | < 500ms | ⚡ Fast |
| Top Offers | < 300ms | ⚡ Fast |
| Performance | < 400ms | ⚡ Fast |
| Top Affiliates | < 300ms | ⚡ Fast |
| Info Cards | < 200ms | ⚡ Fast |
| Top Countries | < 400ms | ⚡ Fast |
| Summary | < 600ms | ✅ Good |
| Detailed | < 800ms | ✅ Good |
| Publisher Conversions | < 700ms | ✅ Good |

---

## 🐛 Common Issues & Solutions

### Issue 1: 401 Unauthorized Error

**Symptom:** API returns 401 status code

**Solution:**
1. Check if you're logged in
2. Verify token exists in localStorage:
   ```javascript
   const user = localStorage.getItem('bng_user');
   console.log('User:', user);
   ```
3. Re-login if token is missing or expired

---

### Issue 2: Network Error / CORS

**Symptom:** "Failed to fetch" or CORS error

**Solution:**
1. Verify backend is running on `http://localhost:5001`
2. Check backend CORS configuration
3. Ensure `.env` has correct `VITE_API_URL`

---

### Issue 3: Empty Data Arrays

**Symptom:** API returns `{ success: true, data: [] }`

**Solution:**
1. This is normal if no data exists in database
2. Add test data to backend database
3. Verify date filters are not too restrictive

---

### Issue 4: Pagination Not Working

**Symptom:** Pagination returns same data

**Solution:**
1. Verify `page` parameter is being passed
2. Check `limit` parameter is set
3. Ensure total records > limit

---

## ✅ Test Results Template

Use this template to track your testing:

```
# Reports API Test Results

Date: _____________
Tester: _____________

## Test Results

- [ ] Test 1: Dashboard Cards API - ✅ Pass / ❌ Fail
- [ ] Test 2: Complete Dashboard API - ✅ Pass / ❌ Fail
- [ ] Test 3: Top Offers API - ✅ Pass / ❌ Fail
- [ ] Test 4: Performance Chart API - ✅ Pass / ❌ Fail
- [ ] Test 5: Top Affiliates API - ✅ Pass / ❌ Fail
- [ ] Test 6: Info Cards API - ✅ Pass / ❌ Fail
- [ ] Test 7: Top Countries API - ✅ Pass / ❌ Fail
- [ ] Test 8: Summary Report API - ✅ Pass / ❌ Fail
- [ ] Test 9: Detailed Report API - ✅ Pass / ❌ Fail
- [ ] Test 10: Publisher Conversions API - ✅ Pass / ❌ Fail

## Notes:
_____________________________________________
_____________________________________________
_____________________________________________
```

---

## 🎯 Quick Test Script

Run all tests at once:

```javascript
import { dashboardAPI } from './src/services/api';

async function runAllTests() {
  console.log('🧪 Running all Reports API tests...\n');

  const tests = [
    { name: 'Dashboard Cards', fn: () => dashboardAPI.getDashboardCards() },
    { name: 'Dashboard', fn: () => dashboardAPI.getDashboard() },
    { name: 'Top Offers', fn: () => dashboardAPI.getTopOffers({ limit: 5 }) },
    { name: 'Performance', fn: () => dashboardAPI.getPerformance({ group_by: 'day' }) },
    { name: 'Top Affiliates', fn: () => dashboardAPI.getTopAffiliates({ limit: 5 }) },
    { name: 'Info Cards', fn: () => dashboardAPI.getInfoCards() },
    { name: 'Top Countries', fn: () => dashboardAPI.getTopCountries({ limit: 10 }) },
    { name: 'Summary', fn: () => dashboardAPI.getSummary() },
    { name: 'Detailed', fn: () => dashboardAPI.getDetailed({ page: 1, limit: 20 }) },
    { name: 'Publisher Conversions', fn: () => dashboardAPI.getPublisherConversions() }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await test.fn();
      if (response.success) {
        console.log(`✅ ${test.name} - PASS`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAIL (Invalid response)`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAIL (${error.message})`);
      failed++;
    }
    console.log(''); // Empty line
  }

  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
}

runAllTests();
```

---

## 📝 Final Checklist

Before marking testing as complete:

- [ ] All 10 API endpoints tested
- [ ] All hooks tested
- [ ] Error handling verified
- [ ] Loading states verified
- [ ] Pagination tested
- [ ] Filters tested
- [ ] Authentication working
- [ ] Response times acceptable
- [ ] No console errors
- [ ] Data displays correctly in UI

---

**Last Updated:** January 7, 2026  
**Version:** 1.0
