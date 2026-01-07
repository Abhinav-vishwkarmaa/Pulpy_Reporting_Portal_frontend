/**
 * Test Script for Offer Edit API
 * 
 * This script demonstrates how to test the new /offers/:id/edit endpoint
 * Copy and paste this into your browser console to test
 */

import { offersAPI } from './src/services/api';

async function testOfferEditAPI(offerId = 16) {
    console.log(`🧪 Testing Offer Edit API for Offer ID: ${offerId}...\n`);

    try {
        const response = await offersAPI.getOfferForEdit(offerId);

        if (response.success) {
            console.log('✅ SUCCESS! Offer Edit API is working\n');
            console.log('📊 Response Data:', response.data);
            console.log('━'.repeat(50));

            const offer = response.data;
            console.log(`\n🏷️  OFFER DETAILS:`);
            console.log(`   ID: ${offer.id}`);
            console.log(`   Name: ${offer.name}`);
            console.log(`   Status: ${offer.status}`);
            console.log(`   Category: ${offer.category}`);
            console.log(`   Country: ${offer.country}`);

            console.log(`\n💰  PAYOUT INFO:`);
            console.log(`   Advertiser Model: ${offer.advertiser_model} ($${offer.advertiser_amount})`);
            console.log(`   Affiliate Model: ${offer.affiliate_model} ($${offer.affiliate_amount})`);

            console.log(`\n🔗  URLS:`);
            console.log(`   Offer URL: ${offer.offer_url}`);
            console.log(`   Preview URL: ${offer.preview_url}`);

            console.log(`\n📅  SCHEDULE:`);
            console.log(`   Start: ${offer.start_date}`);
            console.log(`   End: ${offer.end_date}`);

            console.log('\n' + '━'.repeat(50));
            return response.data;
        } else {
            console.error('❌ FAILED: API returned success: false');
            console.error('Error:', response.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('❌ ERROR: Failed to fetch offer for edit');
        console.error('Error message:', error.message);
        return null;
    }
}

// How to run:
// 1. Open browser console
// 2. Paste code
// 3. Run: testOfferEditAPI(16)

export default testOfferEditAPI;
