# Delete Offer Fix

## Issue
The user was unable to delete offers because the frontend was using a local mock function (`deleteOffer` from `useData`) instead of calling the actual API endpoint `/api/admin/offers/:id`. Additionally, the `deleteOffer` method was missing from the `offersAPI` service definition.

## Changes Made

### 1. API Service Update
*   **File:** `src/services/api.js`
*   **Change:** Added `deleteOffer` method to `offersAPI` object.
*   **Method:** `DELETE`
*   **Endpoint:** `/api/admin/offers/:id`

### 2. Offer List Component Update
*   **File:** `src/pages/Offer/OfferList.jsx`
*   **Change:** Replaced the usage of the local `deleteOffer` function with `offersAPI.deleteOffer(id)`.
*   **Change:** Removed the `deleteOffer` destructuring from `useData` since it is no longer needed.

## Verification
*   The `confirmDelete` function in `OfferList.jsx` now awaits the API call.
*   Upon success, it shows a toast message and refreshes the offers list from the server.
