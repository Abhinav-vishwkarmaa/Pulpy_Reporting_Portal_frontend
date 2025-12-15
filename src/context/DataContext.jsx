import { createContext, useContext, useState, useCallback } from 'react';

// Initial dummy data
const initialOffers = [
    {
        id: 1,
        name: 'Summer Sale Campaign',
        currency: 'USD',
        country: 'US',
        timeZone: 'America/New_York',
        advertiser: 'Acme Corp',
        category: 'E-commerce',
        revenueModel: 'CPA',
        costModel: 'CPA',
        revenue: 15.00,
        cost: 10.00,
        visibility: 'Public',
        startDate: '2024-01-01',
        startTime: '00:00',
        endDate: '2024-12-31',
        endTime: '23:59',
        status: 'Active',
        description: 'Summer sale promotion campaign'
    },
    {
        id: 2,
        name: 'Winter Promo',
        currency: 'EUR',
        country: 'DE',
        timeZone: 'Europe/Berlin',
        advertiser: 'Euro Store',
        category: 'Retail',
        revenueModel: 'CPC',
        costModel: 'CPC',
        revenue: 0.50,
        cost: 0.30,
        visibility: 'Private',
        startDate: '2024-11-01',
        startTime: '00:00',
        endDate: '2025-02-28',
        endTime: '23:59',
        status: 'Pending',
        description: 'Winter holiday promotions'
    },
    {
        id: 3,
        name: 'App Install',
        currency: 'INR',
        country: 'IN',
        timeZone: 'Asia/Kolkata',
        advertiser: 'TechStart',
        category: 'Mobile',
        revenueModel: 'CPI',
        costModel: 'CPI',
        revenue: 100.00,
        cost: 75.00,
        visibility: 'Public',
        startDate: '2024-03-01',
        startTime: '00:00',
        endDate: '2024-09-30',
        endTime: '23:59',
        status: 'Active',
        description: 'Mobile app install campaign'
    }
];

const initialAffiliates = [
    {
        id: 1,
        email: 'affiliate1@example.com',
        fullName: 'John Doe',
        companyName: 'Affiliate Networks Inc',
        country: 'US',
        status: 'Active',
        postbackUrl: 'https://affiliate1.com/postback'
    },
    {
        id: 2,
        email: 'partner2@example.com',
        fullName: 'Jane Smith',
        companyName: 'Digital Marketing Co',
        country: 'UK',
        status: 'Active',
        postbackUrl: 'https://partner2.com/track'
    },
    {
        id: 3,
        email: 'media@adnetwork.com',
        fullName: 'Mike Johnson',
        companyName: 'Ad Network Pro',
        country: 'CA',
        status: 'Pending',
        postbackUrl: 'https://adnetwork.com/postback'
    }
];

const initialAdvertisers = [
    {
        id: 1,
        email: 'advertiser@acme.com',
        fullName: 'Robert Brown',
        companyName: 'Acme Corp',
        country: 'US',
        status: 'Active',
        website: 'https://acme.com'
    },
    {
        id: 2,
        email: 'marketing@eurostore.eu',
        fullName: 'Hans Mueller',
        companyName: 'Euro Store',
        country: 'DE',
        status: 'Active',
        website: 'https://eurostore.eu'
    },
    {
        id: 3,
        email: 'ads@techstart.in',
        fullName: 'Raj Patel',
        companyName: 'TechStart',
        country: 'IN',
        status: 'Pending',
        website: 'https://techstart.in'
    }
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [offers, setOffers] = useState(initialOffers);
    const [affiliates, setAffiliates] = useState(initialAffiliates);
    const [advertisers, setAdvertisers] = useState(initialAdvertisers);

    // Offers CRUD
    const addOffer = useCallback((offer) => {
        const newOffer = { ...offer, id: Date.now() };
        setOffers(prev => [...prev, newOffer]);
        return newOffer;
    }, []);

    const updateOffer = useCallback((id, updates) => {
        setOffers(prev => prev.map(offer =>
            offer.id === id ? { ...offer, ...updates } : offer
        ));
    }, []);

    const deleteOffer = useCallback((id) => {
        setOffers(prev => prev.filter(offer => offer.id !== id));
    }, []);

    const getOffer = useCallback((id) => {
        return offers.find(offer => offer.id === parseInt(id));
    }, [offers]);

    // Affiliates CRUD
    const addAffiliate = useCallback((affiliate) => {
        const newAffiliate = { ...affiliate, id: Date.now(), status: 'Pending' };
        setAffiliates(prev => [...prev, newAffiliate]);
        return newAffiliate;
    }, []);

    const updateAffiliate = useCallback((id, updates) => {
        setAffiliates(prev => prev.map(affiliate =>
            affiliate.id === id ? { ...affiliate, ...updates } : affiliate
        ));
    }, []);

    const deleteAffiliate = useCallback((id) => {
        setAffiliates(prev => prev.filter(affiliate => affiliate.id !== id));
    }, []);

    const getAffiliate = useCallback((id) => {
        return affiliates.find(affiliate => affiliate.id === parseInt(id));
    }, [affiliates]);

    // Advertisers CRUD
    const addAdvertiser = useCallback((advertiser) => {
        const newAdvertiser = { ...advertiser, id: Date.now(), status: 'Pending' };
        setAdvertisers(prev => [...prev, newAdvertiser]);
        return newAdvertiser;
    }, []);

    const updateAdvertiser = useCallback((id, updates) => {
        setAdvertisers(prev => prev.map(advertiser =>
            advertiser.id === id ? { ...advertiser, ...updates } : advertiser
        ));
    }, []);

    const deleteAdvertiser = useCallback((id) => {
        setAdvertisers(prev => prev.filter(advertiser => advertiser.id !== id));
    }, []);

    const getAdvertiser = useCallback((id) => {
        return advertisers.find(advertiser => advertiser.id === parseInt(id));
    }, [advertisers]);

    // Stats
    const getStats = useCallback(() => {
        return {
            totalOffers: offers.length,
            activeOffers: offers.filter(o => o.status === 'Active').length,
            totalAffiliates: affiliates.length,
            activeAffiliates: affiliates.filter(a => a.status === 'Active').length,
            totalAdvertisers: advertisers.length,
            activeAdvertisers: advertisers.filter(a => a.status === 'Active').length
        };
    }, [offers, affiliates, advertisers]);

    return (
        <DataContext.Provider value={{
            // Offers
            offers,
            addOffer,
            updateOffer,
            deleteOffer,
            getOffer,
            // Affiliates
            affiliates,
            addAffiliate,
            updateAffiliate,
            deleteAffiliate,
            getAffiliate,
            // Advertisers
            advertisers,
            addAdvertiser,
            updateAdvertiser,
            deleteAdvertiser,
            getAdvertiser,
            // Stats
            getStats
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
