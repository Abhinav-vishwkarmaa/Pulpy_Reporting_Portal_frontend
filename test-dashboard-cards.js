/**
 * Test Script for Dashboard Cards API
 * 
 * This script demonstrates how to test the new /dashboard/cards endpoint
 * Copy and paste this into your browser console to test
 */

import { dashboardAPI } from './src/services/api';

async function testDashboardCardsAPI() {
    console.log('🧪 Testing Dashboard Cards API...\n');

    try {
        const response = await dashboardAPI.getDashboardCards();

        if (response.success) {
            console.log('✅ SUCCESS! Dashboard Cards API is working\n');
            console.log('📊 Response Data:', response.data);
            console.log('\n📈 Card Details:');
            console.log('━'.repeat(50));

            // Offers Card
            console.log('\n🏷️  OFFERS:');
            console.log(`   Total: ${response.data.offers.total}`);
            console.log(`   Active: ${response.data.offers.active}`);
            console.log(`   Status: ${response.data.offers.status_label}`);

            // Publishers Card
            console.log('\n👥 PUBLISHERS:');
            console.log(`   Total: ${response.data.publishers.total}`);
            console.log(`   Active: ${response.data.publishers.active}`);
            console.log(`   Status: ${response.data.publishers.status_label}`);

            // Clicks Card
            console.log('\n🖱️  CLICKS:');
            console.log(`   Total: ${response.data.clicks.total.toLocaleString()}`);
            console.log(`   Unique: ${response.data.clicks.unique.toLocaleString()}`);
            console.log(`   Status: ${response.data.clicks.status_label}`);

            // Conversions Card
            console.log('\n📈 CONVERSIONS:');
            console.log(`   Total: ${response.data.conversions.total}`);
            console.log(`   Approved: ${response.data.conversions.approved}`);
            console.log(`   Pending: ${response.data.conversions.pending}`);
            console.log(`   Rejected: ${response.data.conversions.rejected}`);
            console.log(`   Approval Rate: ${response.data.conversions.approval_rate}`);
            console.log(`   Status: ${response.data.conversions.status_label}`);

            // Revenue Card
            console.log('\n💰 REVENUE:');
            console.log(`   Total: $${response.data.revenue.total}`);
            console.log(`   Payout: $${response.data.revenue.payout}`);
            console.log(`   Profit: $${response.data.revenue.profit}`);
            console.log(`   Today: $${response.data.revenue.today}`);
            console.log(`   Yesterday: $${response.data.revenue.yesterday}`);
            console.log(`   Change: $${response.data.revenue.change}`);
            console.log(`   Status: ${response.data.revenue.status_label}`);

            // Advertisers Card
            console.log('\n📢 ADVERTISERS:');
            console.log(`   Total: ${response.data.advertisers.total}`);
            console.log(`   Active: ${response.data.advertisers.active}`);
            console.log(`   Status: ${response.data.advertisers.status_label}`);

            console.log('\n' + '━'.repeat(50));
            console.log('✅ All card data retrieved successfully!');

            return response.data;
        } else {
            console.error('❌ FAILED: API returned success: false');
            console.error('Error:', response.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('❌ ERROR: Failed to fetch dashboard cards');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        return null;
    }
}

// Run the test
console.log('Starting Dashboard Cards API Test...\n');
testDashboardCardsAPI();

// Export for use in other files
export default testDashboardCardsAPI;
