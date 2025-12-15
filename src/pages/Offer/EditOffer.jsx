import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { offersAPI, advertisersAPI, assignmentsAPI, publishersAPI } from '../../services/api';
import './Offer.css';

// Country and Currency data - matching HTML
const countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AE', name: 'United Arab Emirates' }
];

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'AED'];

const timeZones = [
    '(GMT-12:00) International Date Line West',
    '(GMT-11:00) Midway Island, Samoa',
    '(GMT-10:00) Hawaii',
    '(GMT-09:00) Alaska',
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-07:00) Mountain Time (US & Canada)',
    '(GMT-06:00) Central Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT-04:00) Atlantic Time (Canada)',
    '(GMT-03:00) Buenos Aires, Georgetown',
    '(GMT+00:00) London, Dublin, Lisbon',
    '(GMT+01:00) Paris, Berlin, Rome',
    '(GMT+02:00) Cairo, Athens, Istanbul',
    '(GMT+03:00) Moscow, Kuwait, Riyadh',
    '(GMT+04:00) Dubai, Abu Dhabi',
    '(GMT+05:00) Islamabad, Karachi',
    '(GMT+05:30) Mumbai, Chennai, Kolkata',
    '(GMT+06:00) Dhaka, Almaty',
    '(GMT+07:00) Bangkok, Hanoi, Jakarta',
    '(GMT+08:00) Beijing, Hong Kong, Singapore',
    '(GMT+09:00) Tokyo, Seoul, Osaka',
    '(GMT+10:00) Sydney, Melbourne',
    '(GMT+12:00) Auckland, Wellington'
];

const categories = [
    'Shopping',
    'E-commerce',
    'Finance',
    'Gaming',
    'Health & Fitness',
    'Travel',
    'Mobile',
    'Retail',
    'Entertainment',
    'Education',
    'Technology'
];

// Revenue models - matching HTML
const revenueModels = ['CPA', 'CPC', 'CPL', 'CPI', 'CPS', 'CPM'];

// Browsers - EXACTLY matching HTML
const browsers = [
    'All',
    'Chrome',
    'Dolfin',
    'Opera',
    'Skyfire',
    'Edge',
    'IE',
    'Firefox',
    'Bolt',
    'TeaShark',
    'Blazer',
    'Safari',
    'WeChat',
    'UCBrowser',
    'baiduboxapp',
    'baidubrowser',
    'DiigoBrowser',
    'Mercury',
    'ObigoBrowser',
    'NetFront',
    'GenericBrowser',
    'PaleMoon',
    'Others'
];

// Devices - EXACTLY matching HTML
const devices = [
    'All',
    'Desktop',
    'Smartphone',
    'Tablet',
    'Feature Phone',
    'Smart TV',
    'Console',
    'Wearable',
    'Others'
];

// Operating Systems - EXACTLY matching HTML
const operatingSystems = [
    'All',
    'Android',
    'iOS',
    'Windows',
    'macOS',
    'Linux',
    'Chrome OS',
    'BlackBerry',
    'Symbian',
    'Others'
];

// Capping types
const cappingTypes = [
    { id: 'none', name: 'No Capping' },
    { id: 'conversions', name: 'Capping Conversions' },
    { id: 'clicks', name: 'Capping Clicks' },
    { id: 'budget', name: 'Capping Budget' }
];

const cappingPeriods = ['Daily', 'Weekly', 'Monthly', 'Total'];
const overCappingActions = ['STOP', 'CONTINUE'];

// Available tokens for destination URL
const availableTokens = [
    'RCID',
    'Aff Sub1',
    'Aff Sub2',
    'Aff Sub3',
    'Aff Sub4',
    'Aff Sub5',
    'Aff Click ID',
    'Sub Aff ID',
    'Google AID',
    'Device ID',
    'Android ID',
    'IOS ID FA',
    'Source'
];

// Icons
const ChevronIcon = ({ isOpen }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CopyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
);

// Collapsible Section Component
function CollapsibleSection({ title, isOpen, onToggle, children, badge }) {
    return (
        <div className="collapsible-section">
            <div className="collapsible-header" onClick={onToggle}>
                <div className="collapsible-title">
                    <h3>{title}</h3>
                    {badge && <span className="section-badge">{badge}</span>}
                </div>
                <span className="collapsible-icon">
                    <ChevronIcon isOpen={isOpen} />
                </span>
            </div>
            {isOpen && <div className="collapsible-content">{children}</div>}
        </div>
    );
}

function EditOffer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingOffer, setLoadingOffer] = useState(true);
    const [advertisers, setAdvertisers] = useState([]);
    const [loadingAdvertisers, setLoadingAdvertisers] = useState(false);
    const [publishers, setPublishers] = useState([]);
    const [loadingPublishers, setLoadingPublishers] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [publisherAssignments, setPublisherAssignments] = useState([]);

    // Section states - matching original website
    const [openSections, setOpenSections] = useState({
        offerInfo: true,
        offerUrl: true,
        targeting: true,
        capping: true,
        fallback: true,
        advertiserPostback: true,
        affiliates: true,
        postback: true
    });

    // Form data - matching NewOffer.jsx structure
    const [formData, setFormData] = useState({
        offerId: '',
        advertiser_id: '',
        name: '',
        offer_currency: 'USD',
        country: 'US',
        timezone: '(GMT+05:30) Mumbai, Chennai, Kolkata',
        advertiser_model: 'CPA',
        advertiser_amount: '',
        affiliate_model: 'CPA',
        affiliate_amount: '',
        offer_url: '',
        description: '',
        category: '',
        status: 'draft',
        offer_visibility: 'PUBLIC',
        preview_url: '',
        token_type: '',
        start_date: '',
        start_time: '00:00:00',
        end_date: '',
        end_time: '23:59:59',
        capping_type: 'daily',
        daily_cap: '',
        monthly_cap: '',
        total_cap: '',
        // IP Targeting
        ip_action: 'ALLOW',
        ip_list: '',
        // Browser Targeting
        browser_action: 'ALLOW',
        browser_targeting: [],
        // Device Targeting
        device_action: 'ALLOW',
        device_targeting: [],
        // OS Targeting
        os_action: 'ALLOW',
        os_targeting: [],
        // Capping Budget
        advertiser_capping_budget_duration: 'nocap',
        advertiser_capping_budget_amount: '',
        // Capping Conversions
        capping_conversions_duration: 'nocap',
        capping_conversions: '',
        // Over Capping
        advertiser_over_capping: 'STOP',
        affiliate_over_capping: 'STOP',
        // Fallback
        fallback_enabled: false,
        fallback_url: '',
        fallback_offer_id: '',
        fallbackType: 'url',
        // Targeting fields for UI (mapped from API fields)
        geoTargetingType: 'include',
        targetedCountries: [],
        connectionTypes: ['all'],
        deviceTypes: [],
        operatingSystems: [],
        browsers: [],
        ipWhitelist: '',
        ipBlacklist: '',
        // Capping fields
        globalCapping: 'none',
        globalCappingValue: '',
        globalCappingPeriod: 'Daily',
        affiliateCapping: 'none',
        affiliateCappingValue: '',
        affiliateCappingPeriod: 'Daily',
        dailyClickCap: '',
        dailyConversionCap: '',
        totalClickCap: '',
        totalConversionCap: '',
        sendEmailOnCap: false,
        capEmailRecipients: '',
        // Advertiser Postback
        advertiserPostbackEnabled: false,
        advertiserPostbackUrl: '',
        advertiserPostbackMethod: 'GET',
        advertiserPostbackEvents: [],
        // Postback
        globalPostbackUrl: '',
        postbackMethod: 'GET',
        postbackEvents: []
    });

    // Fetch advertisers from API
    useEffect(() => {
        const fetchAdvertisers = async () => {
            try {
                setLoadingAdvertisers(true);
                const response = await advertisersAPI.getAdvertisers({ status: 'active', limit: 100 });
                if (response.success && response.data) {
                    setAdvertisers(response.data);
                }
            } catch (error) {
                console.error('Error fetching advertisers:', error);
                toast.error('Failed to load advertisers');
            } finally {
                setLoadingAdvertisers(false);
            }
        };

        fetchAdvertisers();
    }, [toast]);

    // Fetch publishers from API
    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                setLoadingPublishers(true);
                const response = await publishersAPI.getPublishers({ status: 'active', limit: 100 });
                if (response.success && response.data) {
                    setPublishers(response.data);
                }
            } catch (error) {
                console.error('Error fetching publishers:', error);
                toast.error('Failed to load publishers');
            } finally {
                setLoadingPublishers(false);
            }
        };

        fetchPublishers();
    }, [toast]);

    // Fetch assignments for this offer
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!id) return;
            try {
                setLoadingAssignments(true);
                const response = await assignmentsAPI.getAssignments({ offer_id: id });
                if (response.success && response.data) {
                    setAssignments(response.data);
                    // Initialize publisher assignments from existing assignments
                    const initialAssignments = response.data.map(assignment => ({
                        publisher_id: assignment.publisher_id,
                        publisher_email: assignment.publisher_email,
                        payout_override: assignment.payout_override || '',
                        conversion_approval_percentage: assignment.conversion_approval_percentage || '',
                        capping_budget: assignment.capping_budget || { duration: 'day', amount: '' },
                        capping_conversions: assignment.capping_conversions || { duration: 'day', amount: '' },
                        callback_url: assignment.callback_url || '',
                        offer_url: assignment.offer_url || '',
                        notes: assignment.notes || '',
                        status: assignment.status || 'active',
                        assignment_id: assignment.id, // Keep track of existing assignment ID
                        tracking_url: '', // Initialize tracking URL
                        selectedTokens: [] // Initialize selected tokens
                    }));
                    setPublisherAssignments(initialAssignments);

                    // Automatically fetch tracking URLs for all assignments
                    const fetchTrackingUrls = async () => {
                        const updatedAssignments = await Promise.all(
                            initialAssignments.map(async (assignment) => {
                                if (assignment.assignment_id) {
                                    try {
                                        const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.assignment_id);
                                        if (trackingResponse.success) {
                                            return {
                                                ...assignment,
                                                tracking_url: trackingResponse.data.tracking_url
                                            };
                                        }
                                    } catch (error) {
                                        console.error(`Error fetching tracking URL for assignment ${assignment.assignment_id}:`, error);
                                    }
                                }
                                return assignment;
                            })
                        );
                        setPublisherAssignments(updatedAssignments);
                    };

                    fetchTrackingUrls();
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoadingAssignments(false);
            }
        };

        fetchAssignments();
    }, [id, toast]);

    // Load offer data from API
    useEffect(() => {
        const fetchOffer = async () => {
            try {
                setLoadingOffer(true);
                const response = await offersAPI.getOffer(id);
                if (response.success && response.data) {
                    const offer = response.data;
                    // Parse JSON fields if they exist
                    const deviceTargeting = offer.device_targeting_json ? (typeof offer.device_targeting_json === 'string' ? JSON.parse(offer.device_targeting_json) : offer.device_targeting_json) : {};
                    const osTargeting = offer.os_targeting_json ? (typeof offer.os_targeting_json === 'string' ? JSON.parse(offer.os_targeting_json) : offer.os_targeting_json) : {};
                    const browserTargeting = offer.browser_targeting_json ? (typeof offer.browser_targeting_json === 'string' ? JSON.parse(offer.browser_targeting_json) : offer.browser_targeting_json) : {};
                    const macrosJson = offer.macros_json ? (typeof offer.macros_json === 'string' ? JSON.parse(offer.macros_json) : offer.macros_json) : {};

                    setFormData(prev => ({
                        ...prev,
                        offerId: `o${String(id).padStart(4, '0')}`,
                        name: offer.name || '',
                        description: offer.description || '',
                        offer_currency: offer.offer_currency || 'USD',
                        country: offer.country || 'US',
                        timezone: offer.timezone || '(GMT+05:30) Mumbai, Chennai, Kolkata',
                        advertiser_id: offer.advertiser_id?.toString() || '',
                        category: offer.category || '',
                        advertiser_model: offer.advertiser_model || 'CPA',
                        advertiser_amount: offer.advertiser_amount || '',
                        affiliate_model: offer.affiliate_model || 'CPA',
                        affiliate_amount: offer.affiliate_amount || '',
                        offer_url: offer.offer_url || '',
                        preview_url: offer.preview_url || '',
                        token_type: offer.token_type || '',
                        offer_visibility: offer.offer_visibility || 'PUBLIC',
                        status: offer.status || 'draft',
                        start_date: offer.start_date ? offer.start_date.split('T')[0] : '',
                        start_time: offer.start_time || '00:00:00',
                        end_date: offer.end_date ? offer.end_date.split('T')[0] : '',
                        end_time: offer.end_time || '23:59:59',
                        capping_type: offer.capping_type || 'daily',
                        daily_cap: offer.daily_cap || '',
                        monthly_cap: offer.monthly_cap || '',
                        total_cap: offer.total_cap || '',
                        ip_action: offer.ip_action?.toUpperCase() || 'ALLOW',
                        ip_list: offer.ip_list || '',
                        device_targeting: deviceTargeting.device || [],
                        os_targeting: osTargeting.os || [],
                        browser_targeting: browserTargeting.browser || [],
                        device_action: 'ALLOW',
                        os_action: 'ALLOW',
                        browser_action: 'ALLOW',
                        advertiser_capping_budget_duration: offer.advertiser_capping_budget_duration || 'nocap',
                        advertiser_capping_budget_amount: offer.budget_cap || '',
                        capping_conversions_duration: offer.capping_conversions_duration || 'nocap',
                        capping_conversions: offer.conversion_cap || '',
                        advertiser_over_capping: offer.advertiser_over_capping?.toUpperCase() || 'STOP',
                        affiliate_over_capping: offer.affiliate_over_capping?.toUpperCase() || 'STOP',
                        fallback_enabled: offer.fallback_enabled === 1 || offer.fallback_enabled === true,
                        fallback_url: offer.fallback_url || '',
                        fallback_offer_id: offer.fallback_offer_id?.toString() || '',
                        fallbackType: offer.fallback_url ? 'url' : (offer.fallback_offer_id ? 'offer' : 'url'),
                        // Capping fields
                        globalCapping: 'none',
                        globalCappingValue: '',
                        globalCappingPeriod: 'Daily',
                        affiliateCapping: 'none',
                        affiliateCappingValue: '',
                        affiliateCappingPeriod: 'Daily',
                        dailyClickCap: offer.daily_cap || '',
                        dailyConversionCap: offer.conversion_cap || '',
                        totalClickCap: offer.total_cap || '',
                        totalConversionCap: '',
                        sendEmailOnCap: false,
                        capEmailRecipients: '',
                        // Advertiser Postback
                        advertiserPostbackEnabled: !!(offer.advertiser_postback_url),
                        advertiserPostbackUrl: offer.advertiser_postback_url || '',
                        advertiserPostbackMethod: offer.advertiser_postback_method || 'GET',
                        advertiserPostbackEvents: ['conversion'],
                        // Postback
                        globalPostbackUrl: offer.system_postback_url || '',
                        postbackMethod: offer.system_postback_method || 'GET',
                        postbackEvents: ['conversion']
                    }));
                } else {
                    toast.error('Offer not found');
                    navigate('/offer/list');
                }
            } catch (error) {
                console.error('Error fetching offer:', error);
                toast.error('Failed to load offer');
                navigate('/offer/list');
            } finally {
                setLoadingOffer(false);
            }
        };

        if (id) {
            fetchOffer();
        }
    }, [id, navigate, toast]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'select-multiple') {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, [name]: selectedValues }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayToggle = (field, value) => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            return {
                ...prev,
                [field]: currentArray.includes(value)
                    ? currentArray.filter(v => v !== value)
                    : [...currentArray, value]
            };
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const generateTrackingUrl = () => {
        const baseUrl = formData.trackingDomain || 'https://track.bngrenew.com';
        const url = `${baseUrl}/click?o=${formData.offerId}&a={affiliate_id}&s={source}&c={clickid}`;
        setFormData(prev => ({ ...prev, trackingUrl: url }));
        toast.success('Tracking URL generated!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name) {
                toast.error('Offer name is required');
                setLoading(false);
                return;
            }

            // Format the data for API - similar to NewOffer.jsx
            const offerData = {
                advertiser_id: parseInt(formData.advertiser_id),
                name: formData.name,
                offer_currency: formData.offer_currency,
                country: formData.country,
                timezone: formData.timezone,
                advertiser_model: formData.advertiser_model,
                advertiser_amount: parseFloat(formData.advertiser_amount),
                affiliate_model: formData.affiliate_model,
                affiliate_amount: parseFloat(formData.affiliate_amount),
                offer_url: formData.offer_url,
                description: formData.description,
                category: formData.category,
                status: formData.status.toLowerCase(),
                offer_visibility: formData.offer_visibility,
                preview_url: formData.preview_url || null,
                token_type: formData.token_type || null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
                capping_type: formData.capping_type,
                daily_cap: formData.daily_cap ? parseInt(formData.daily_cap) : null,
                monthly_cap: formData.monthly_cap ? parseInt(formData.monthly_cap) : null,
                total_cap: formData.total_cap ? parseInt(formData.total_cap) : null,
                ip_action: formData.ip_action.toLowerCase(),
                ip_list: formData.ip_list || null,
                device_targeting_json: formData.device_targeting && formData.device_targeting.length > 0 
                    ? JSON.stringify({ device: formData.device_targeting }) 
                    : null,
                os_targeting_json: formData.os_targeting && formData.os_targeting.length > 0 
                    ? JSON.stringify({ os: formData.os_targeting }) 
                    : null,
                browser_targeting_json: formData.browser_targeting && formData.browser_targeting.length > 0 
                    ? JSON.stringify({ browser: formData.browser_targeting }) 
                    : null,
                advertiser_capping_budget_duration: formData.advertiser_capping_budget_duration,
                advertiser_capping_budget_amount: formData.advertiser_capping_budget_amount ? parseFloat(formData.advertiser_capping_budget_amount) : null,
                capping_conversions_duration: formData.capping_conversions_duration,
                capping_conversions: formData.capping_conversions ? parseInt(formData.capping_conversions) : null,
                advertiser_over_capping: formData.advertiser_over_capping,
                affiliate_over_capping: formData.affiliate_over_capping,
                fallback_enabled: formData.fallback_enabled === true || formData.fallback_enabled === 1 ? 1 : 0,
                fallback_url: formData.fallback_url || null,
                fallback_offer_id: formData.fallback_offer_id ? parseInt(formData.fallback_offer_id) : null
            };

            await offersAPI.updateOffer(id, offerData);
            toast.success('Offer updated successfully!');
            navigate('/offer/list');
        } catch (error) {
            console.error('Error updating offer:', error);
            toast.error(error.message || 'Failed to update offer');
        } finally {
            setLoading(false);
        }
    };

    // Scroll to section helper
    const goToElement = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loadingOffer) {
        return (
            <div className="offer-page">
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <p>Loading offer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="offer-page">
            <div className="offerInfo mt-2 mb-3 p-3 ml-2 mr-2 d-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', margin: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <h2 style={{ margin: 0 }}>{formData.name || 'Loading...'} - {formData.offerId}</h2>
                <div className="buttonsItem" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        type="button" 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                            setOpenSections(prev => ({ ...prev, postback: true }));
                            goToElement('postBackSection');
                        }}
                    >
                        Postback
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                            setOpenSections(prev => ({ ...prev, affiliates: true }));
                            goToElement('affiliatesSection');
                        }}
                    >
                        Assign Publishers
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                {/* ==================== SECTION 1: OFFER INFO ==================== */}
                <CollapsibleSection
                    title="Offer Info"
                    isOpen={openSections.offerInfo}
                    onToggle={() => toggleSection('offerInfo')}
                >
                    <div className="offer-form-row">
                        <div className="form-group">
                            <label className="form-label required">Offer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter offer name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter the campaign description"
                                rows="2"
                            />
                        </div>
                    </div>

                    <div className="offer-form-row three-col">
                        <div className="form-group">
                            <label className="form-label">Offer Currency</label>
                            <select
                                className="form-control"
                                name="offer_currency"
                                value={formData.offer_currency}
                                onChange={handleChange}
                            >
                                {currencies.map(curr => (
                                    <option key={curr} value={curr}>{curr}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select
                                className="form-control"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                {countries.map(country => (
                                    <option key={country.code} value={country.code}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time Zone</label>
                            <select
                                className="form-control"
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                            >
                                {timeZones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="offer-form-row three-col">
                        <div className="form-group">
                            <label className="form-label required">Advertiser</label>
                            <select
                                className="form-control"
                                name="advertiser_id"
                                value={formData.advertiser_id}
                                onChange={handleChange}
                                required
                                disabled={loadingAdvertisers}
                            >
                                <option value="">
                                    {loadingAdvertisers ? 'Loading advertisers...' : 'Select Advertiser'}
                                </option>
                                {advertisers.map(advertiser => (
                                    <option key={advertiser.id} value={advertiser.id}>
                                        {advertiser.name} {advertiser.company_name ? `(${advertiser.company_name})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Category</label>
                            <select
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Offer Visibility</label>
                            <select
                                className="form-control"
                                name="offer_visibility"
                                value={formData.offer_visibility}
                                onChange={handleChange}
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PUBLICREQUIREAPPROVAL">Public Require Approval</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                        </div>
                    </div>

                    <div className="offer-form-row two-col">
                        <div className="form-group">
                            <label className="form-label">Advertiser Model (Revenue)</label>
                            <select
                                className="form-control"
                                name="advertiser_model"
                                value={formData.advertiser_model}
                                onChange={handleChange}
                            >
                                {revenueModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Advertiser Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="advertiser_amount"
                                value={formData.advertiser_amount}
                                onChange={handleChange}
                                placeholder="00.00"
                                required
                            />
                        </div>
                    </div>
                    <div className="offer-form-row two-col">
                        <div className="form-group">
                            <label className="form-label">Affiliate Model (Cost)</label>
                            <select
                                className="form-control"
                                name="affiliate_model"
                                value={formData.affiliate_model}
                                onChange={handleChange}
                            >
                                {revenueModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Affiliate Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="affiliate_amount"
                                value={formData.affiliate_amount}
                                onChange={handleChange}
                                placeholder="00.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="offer-form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-control"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-control"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="offer-form-row">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="draft">Draft</option>
                                <option value="live">Live</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* ==================== SECTION 2: OFFER URL ==================== */}
                <CollapsibleSection
                    title="Offer URL"
                    isOpen={openSections.offerUrl}
                    onToggle={() => toggleSection('offerUrl')}
                >
                    {/* Tracking Domain */}
                    <div className="form-group">
                        <label className="form-label">Tracking Domain</label>
                        <select className="form-control" name="trackingDomain" value={formData.trackingDomain} onChange={handleChange}>
                            <option value="https://track.bngrenew.com">https://track.bngrenew.com</option>
                            <option value="https://trk.bngrenew.com">https://trk.bngrenew.com</option>
                        </select>
                    </div>

                    {/* Tracking URL */}
                    <div className="form-group">
                        <label className="form-label">Tracking Link</label>
                        <div className="input-with-action">
                            <input type="text" className="form-control" name="trackingUrl" value={formData.trackingUrl} readOnly />
                            <button type="button" className="btn btn-icon" onClick={() => copyToClipboard(formData.trackingUrl)} title="Copy">
                                <CopyIcon />
                            </button>
                            <button type="button" className="btn btn-icon" onClick={generateTrackingUrl} title="Regenerate">
                                <RefreshIcon />
                            </button>
                        </div>
                        <div className="form-helper">
                            Available Macros: {'{affiliate_id}'}, {'{source}'}, {'{clickid}'}, {'{sub1}'}, {'{sub2}'}, {'{sub3}'}, {'{sub4}'}, {'{sub5}'}
                        </div>
                    </div>

                    {/* Impression URL */}
                    <div className="form-group">
                        <label className="form-label">Impression URL</label>
                        <div className="input-with-action">
                            <input type="text" className="form-control" name="impressionUrl" value={formData.impressionUrl} readOnly />
                            <button type="button" className="btn btn-icon" onClick={() => copyToClipboard(formData.impressionUrl)}>
                                <CopyIcon />
                            </button>
                        </div>
                    </div>

                    {/* Destination URL */}
                    <div className="form-group">
                        <label className="form-label">Destination URL (Advertiser URL)</label>
                        <input
                            type="url"
                            className="form-control"
                            name="destinationUrl"
                            value={formData.destinationUrl}
                            onChange={handleChange}
                            placeholder="https://advertiser.com/offer?clickid={clickid}"
                        />
                        <div className="form-helper">
                            Macros: {'{clickid}'}, {'{affiliate_id}'}, {'{source}'}, {'{sub1-5}'}, {'{device}'}, {'{os}'}, {'{country}'}
                        </div>
                    </div>

                    {/* Deep Link */}
                    <div className="form-group">
                        <label className="form-label">Deep Link (Optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="deepLink"
                            value={formData.deepLink}
                            onChange={handleChange}
                            placeholder="app://offer/details"
                        />
                    </div>

                    {/* Platform Specific URLs */}
                    <div className="offer-form-row two-col">
                        <div className="form-group">
                            <label className="form-label">Android URL (Optional)</label>
                            <input
                                type="url"
                                className="form-control"
                                name="androidUrl"
                                value={formData.androidUrl}
                                onChange={handleChange}
                                placeholder="https://play.google.com/store/apps/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">iOS URL (Optional)</label>
                            <input
                                type="url"
                                className="form-control"
                                name="iosUrl"
                                value={formData.iosUrl}
                                onChange={handleChange}
                                placeholder="https://apps.apple.com/app/..."
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* ==================== SECTION 3: TARGETING ==================== */}
                <CollapsibleSection
                    title="Targeting"
                    isOpen={openSections.targeting}
                    onToggle={() => toggleSection('targeting')}
                >
                    {/* Geotargeting */}
                    <div className="targeting-subsection">
                        <h4>Geotargeting</h4>
                        <div className="offer-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Targeting Type</label>
                                <div className="radio-group">
                                    <label className="radio-item">
                                        <input type="radio" name="geoTargetingType" value="include" checked={formData.geoTargetingType === 'include'} onChange={handleChange} />
                                        <span>Include Only</span>
                                    </label>
                                    <label className="radio-item">
                                        <input type="radio" name="geoTargetingType" value="exclude" checked={formData.geoTargetingType === 'exclude'} onChange={handleChange} />
                                        <span>Exclude</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Countries</label>
                            <div className="checkbox-grid">
                                {countries.slice(0, 20).map(c => (
                                    <label key={c.code} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.targetedCountries.includes(c.code)}
                                            onChange={() => handleArrayToggle('targetedCountries', c.code)}
                                        />
                                        <span>{c.name}</span>
                                    </label>
                                ))}
                            </div>
                            <button type="button" className="btn btn-link" style={{ marginTop: '8px' }}>
                                + Show All Countries
                            </button>
                        </div>
                    </div>

                    {/* Device Types */}
                    <div className="targeting-subsection">
                        <h4>Device Types</h4>
                        <div className="checkbox-group">
                            {devices.map(device => (
                                <label key={device} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.device_targeting.includes(device)}
                                        onChange={() => handleArrayToggle('device_targeting', device)}
                                    />
                                    <span>{device}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Operating Systems */}
                    <div className="targeting-subsection">
                        <h4>Operating Systems</h4>
                        <div className="checkbox-group">
                            {operatingSystems.map(os => (
                                <label key={os} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.os_targeting.includes(os)}
                                        onChange={() => handleArrayToggle('os_targeting', os)}
                                    />
                                    <span>{os}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Browsers */}
                    <div className="targeting-subsection">
                        <h4>Browsers</h4>
                        <div className="checkbox-group">
                            {browsers.map(browser => (
                                <label key={browser} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.browser_targeting.includes(browser)}
                                        onChange={() => handleArrayToggle('browser_targeting', browser)}
                                    />
                                    <span>{browser}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* IP Targeting */}
                    <div className="targeting-subsection">
                        <h4>IP Targeting</h4>
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">IP Action</label>
                                <select
                                    className="form-control"
                                    name="ip_action"
                                    value={formData.ip_action}
                                    onChange={handleChange}
                                >
                                    <option value="ALLOW">Allow</option>
                                    <option value="BLOCK">Block</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">IP List</label>
                                <textarea
                                    className="form-control"
                                    name="ip_list"
                                    value={formData.ip_list}
                                    onChange={handleChange}
                                    placeholder="Enter IPs, comma-separated (e.g., 1.1.1.1,2.2.2.2)"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* ==================== SECTION 4: CAPPING ==================== */}
                <CollapsibleSection
                    title="Capping"
                    isOpen={openSections.capping}
                    onToggle={() => toggleSection('capping')}
                >
                    {/* Global Capping */}
                    <div className="capping-subsection">
                        <h4>Global Capping</h4>
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Capping Type</label>
                                <select className="form-control" name="globalCapping" value={formData.globalCapping} onChange={handleChange}>
                                    {cappingTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                                </select>
                            </div>
                            {formData.globalCapping !== 'none' && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Value</label>
                                        <input type="number" className="form-control" name="globalCappingValue" value={formData.globalCappingValue} onChange={handleChange} placeholder="Enter value" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Period</label>
                                        <select className="form-control" name="globalCappingPeriod" value={formData.globalCappingPeriod} onChange={handleChange}>
                                            {cappingPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Daily/Total Caps */}
                    <div className="capping-subsection">
                        <h4>Quick Caps</h4>
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Daily Click Cap</label>
                                <input type="number" className="form-control" name="dailyClickCap" value={formData.dailyClickCap} onChange={handleChange} placeholder="Unlimited" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Daily Conversion Cap</label>
                                <input type="number" className="form-control" name="dailyConversionCap" value={formData.dailyConversionCap} onChange={handleChange} placeholder="Unlimited" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Click Cap</label>
                                <input type="number" className="form-control" name="totalClickCap" value={formData.totalClickCap} onChange={handleChange} placeholder="Unlimited" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Conversion Cap</label>
                                <input type="number" className="form-control" name="totalConversionCap" value={formData.totalConversionCap} onChange={handleChange} placeholder="Unlimited" />
                            </div>
                        </div>
                    </div>

                    {/* Affiliate Capping */}
                    <div className="capping-subsection">
                        <h4>Affiliate Capping</h4>
                        <div className="offer-form-row three-col">
                            <div className="form-group">
                                <label className="form-label">Capping Type</label>
                                <select className="form-control" name="affiliateCapping" value={formData.affiliateCapping} onChange={handleChange}>
                                    {cappingTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                                </select>
                            </div>
                            {formData.affiliateCapping !== 'none' && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Value</label>
                                        <input type="number" className="form-control" name="affiliateCappingValue" value={formData.affiliateCappingValue} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Period</label>
                                        <select className="form-control" name="affiliateCappingPeriod" value={formData.affiliateCappingPeriod} onChange={handleChange}>
                                            {cappingPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Over Capping Actions */}
                    <div className="capping-subsection">
                        <h4>Over Capping Actions</h4>
                        <div className="offer-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Advertiser Over Capping</label>
                                <select className="form-control" name="advertiserOverCapping" value={formData.advertiserOverCapping} onChange={handleChange}>
                                    {overCappingActions.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Affiliate Over Capping</label>
                                <select className="form-control" name="affiliateOverCapping" value={formData.affiliateOverCapping} onChange={handleChange}>
                                    {overCappingActions.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Email Notification */}
                    <div className="form-group">
                        <label className="switch-label">
                            <input type="checkbox" name="sendEmailOnCap" checked={formData.sendEmailOnCap} onChange={handleChange} />
                            <span>Send email notification when cap is reached</span>
                        </label>
                        {formData.sendEmailOnCap && (
                            <input
                                type="email"
                                className="form-control"
                                name="capEmailRecipients"
                                value={formData.capEmailRecipients}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                style={{ marginTop: '8px' }}
                            />
                        )}
                    </div>
                </CollapsibleSection>

                {/* ==================== SECTION 5: FALLBACK ==================== */}
                <CollapsibleSection
                    title="Fallback"
                    isOpen={openSections.fallback}
                    onToggle={() => toggleSection('fallback')}
                >
                    <div className="form-group">
                        <label className="switch-label">
                            <input type="checkbox" name="fallback_enabled" checked={formData.fallback_enabled} onChange={handleChange} />
                            <span>Enable Fallback</span>
                        </label>
                    </div>

                    {formData.fallback_enabled && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Fallback Type</label>
                                <div className="radio-group">
                                    <label className="radio-item">
                                        <input type="radio" name="fallbackType" value="url" checked={formData.fallbackType === 'url'} onChange={handleChange} />
                                        <span>Custom URL</span>
                                    </label>
                                    <label className="radio-item">
                                        <input type="radio" name="fallbackType" value="offer" checked={formData.fallbackType === 'offer'} onChange={handleChange} />
                                        <span>Another Offer</span>
                                    </label>
                                    <label className="radio-item">
                                        <input type="radio" name="fallbackType" value="smartlink" checked={formData.fallbackType === 'smartlink'} onChange={handleChange} />
                                        <span>SmartLink</span>
                                    </label>
                                </div>
                            </div>

                            {formData.fallbackType === 'url' && (
                                <div className="form-group">
                                    <label className="form-label">Fallback URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="fallbackUrl"
                                        value={formData.fallbackUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/fallback"
                                    />
                                </div>
                            )}

                            {formData.fallbackType === 'offer' && (
                                <div className="form-group">
                                    <label className="form-label">Fallback Offer ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fallbackOfferId"
                                        value={formData.fallbackOfferId}
                                        onChange={handleChange}
                                        placeholder="Enter offer ID"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CollapsibleSection>

                {/* ==================== SECTION 6: ADVERTISER POSTBACK ==================== */}
                <CollapsibleSection
                    title="Advertiser Postback"
                    isOpen={openSections.advertiserPostback}
                    onToggle={() => toggleSection('advertiserPostback')}
                >
                    <div className="form-group">
                        <label className="switch-label">
                            <input type="checkbox" name="advertiserPostbackEnabled" checked={formData.advertiserPostbackEnabled || false} onChange={handleChange} />
                            <span>Enable Advertiser Postback</span>
                        </label>
                    </div>

                    {formData.advertiserPostbackEnabled && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Postback URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="advertiserPostbackUrl"
                                    value={formData.advertiserPostbackUrl}
                                    onChange={handleChange}
                                    placeholder="https://advertiser.com/postback?clickid={clickid}"
                                />
                                <div className="form-helper">
                                    Macros: {'{clickid}'}, {'{payout}'}, {'{offer_id}'}, {'{affiliate_id}'}, {'{goal}'}, {'{status}'}
                                </div>
                            </div>

                            <div className="offer-form-row two-col">
                                <div className="form-group">
                                    <label className="form-label">Method</label>
                                    <select className="form-control" name="advertiserPostbackMethod" value={formData.advertiserPostbackMethod} onChange={handleChange}>
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Events</label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-item">
                                            <input type="checkbox" checked={(formData.advertiserPostbackEvents || []).includes('conversion')} onChange={() => handleArrayToggle('advertiserPostbackEvents', 'conversion')} />
                                            <span>Conversion</span>
                                        </label>
                                        <label className="checkbox-item">
                                            <input type="checkbox" checked={(formData.advertiserPostbackEvents || []).includes('click')} onChange={() => handleArrayToggle('advertiserPostbackEvents', 'click')} />
                                            <span>Click</span>
                                        </label>
                                        <label className="checkbox-item">
                                            <input type="checkbox" checked={(formData.advertiserPostbackEvents || []).includes('reject')} onChange={() => handleArrayToggle('advertiserPostbackEvents', 'reject')} />
                                            <span>Reject</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CollapsibleSection>

                {/* ==================== SECTION 7: PUBLISHER ASSIGNMENTS ==================== */}
                <CollapsibleSection
                    title="Publisher Assignments"
                    isOpen={openSections.affiliates}
                    onToggle={() => toggleSection('affiliates')}
                    badge={assignments.length}
                >
                    <div 
                        id="affiliatesSection"
                        onKeyDown={(e) => {
                            // Prevent form submission when Enter is pressed in assignment section
                            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                    >
                        {loadingAssignments ? (
                            <p>Loading assignments...</p>
                        ) : (
                            <>
                                {/* Add Publisher Assignment */}
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Add Publisher</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                        <select
                                            className="form-control"
                                            value={''}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    const publisherId = parseInt(e.target.value);
                                                    const publisher = publishers.find(p => p.id === publisherId);
                                                    if (publisher && !publisherAssignments.find(a => a.publisher_id === publisherId)) {
                                                        setPublisherAssignments(prev => [...prev, {
                                                            publisher_id: publisherId,
                                                            payout_override: '',
                                                            conversion_approval_percentage: '',
                                                            capping_budget: { duration: 'day', amount: '' },
                                                            capping_conversions: { duration: 'day', amount: '' },
                                                            callback_url: '',
                                                            offer_url: '',
                                                            notes: '',
                                                            status: 'active',
                                                            selectedTokens: []
                                                        }]);
                                                    }
                                                    e.target.value = '';
                                                }
                                            }}
                                            disabled={loadingPublishers}
                                        >
                                            <option value="">Select Publisher to Add</option>
                                            {publishers
                                                .filter(p => !publisherAssignments.find(a => a.publisher_id === p.id))
                                                .map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.first_name} ({p.email}) - {p.company_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Publisher Assignments List */}
                                {publisherAssignments.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <h4 style={{ marginBottom: '15px' }}>Assigned Publishers ({publisherAssignments.length})</h4>
                                        {publisherAssignments.map((assignment, index) => {
                                            const publisher = publishers.find(p => p.id === assignment.publisher_id);
                                            return (
                                                <div key={index} style={{ 
                                                    border: '1px solid #ddd', 
                                                    borderRadius: '8px', 
                                                    padding: '15px', 
                                                    marginBottom: '15px',
                                                    background: '#f9f9f9'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                        <h5 style={{ margin: 0 }}>
                                                            {publisher ? `${publisher.first_name} (${publisher.email})` : `Publisher: ${assignment.publisher_email}`}
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => {
                                                                setPublisherAssignments(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <div className="offer-form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Payout Override</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="form-control"
                                                                value={assignment.payout_override}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].payout_override = e.target.value;
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                placeholder="Leave empty for default"
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Conversion Approval %</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                className="form-control"
                                                                value={assignment.conversion_approval_percentage}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].conversion_approval_percentage = e.target.value;
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                placeholder="0-100"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="offer-form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Capping Budget Duration</label>
                                                            <select
                                                                className="form-control"
                                                                value={assignment.capping_budget?.duration || 'day'}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].capping_budget = {
                                                                        ...updated[index].capping_budget,
                                                                        duration: e.target.value
                                                                    };
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                            >
                                                                <option value="day">Day</option>
                                                                <option value="week">Week</option>
                                                                <option value="month">Month</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Capping Budget Amount</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="form-control"
                                                                value={assignment.capping_budget?.amount || ''}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].capping_budget = {
                                                                        ...updated[index].capping_budget,
                                                                        amount: e.target.value
                                                                    };
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                placeholder="Leave empty for no cap"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="offer-form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Capping Conversions Duration</label>
                                                            <select
                                                                className="form-control"
                                                                value={assignment.capping_conversions?.duration || 'day'}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].capping_conversions = {
                                                                        ...updated[index].capping_conversions,
                                                                        duration: e.target.value
                                                                    };
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                            >
                                                                <option value="day">Day</option>
                                                                <option value="week">Week</option>
                                                                <option value="month">Month</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Capping Conversions Amount</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={assignment.capping_conversions?.amount || ''}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].capping_conversions = {
                                                                        ...updated[index].capping_conversions,
                                                                        amount: e.target.value
                                                                    };
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                placeholder="Leave empty for no cap"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">Callback URL</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            value={assignment.callback_url}
                                                            onChange={(e) => {
                                                                const updated = [...publisherAssignments];
                                                                updated[index].callback_url = e.target.value;
                                                                setPublisherAssignments(updated);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }
                                                            }}
                                                            placeholder="https://affiliate.com/postback?click_id={click_id}&payout={payout}"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label">Offer URL</label>
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            value={assignment.offer_url}
                                                            onChange={(e) => {
                                                                const updated = [...publisherAssignments];
                                                                updated[index].offer_url = e.target.value;
                                                                setPublisherAssignments(updated);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }
                                                            }}
                                                            placeholder="https://pulpy.com/click?offer_id=10&publisher_id=7&tid={TID}"
                                                        />
                                                    </div>

                                                    {/* Tokens Available Section */}
                                                    <div className="form-group" style={{ marginTop: '15px' }}>
                                                        <label className="form-label">Tokens Available:</label>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            flexWrap: 'wrap', 
                                                            gap: '15px',
                                                            marginTop: '10px',
                                                            padding: '10px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            background: '#f9f9f9'
                                                        }}>
                                                            {availableTokens.map(token => (
                                                                <label 
                                                                    key={token}
                                                                    style={{ 
                                                                        display: 'flex', 
                                                                        alignItems: 'center',
                                                                        cursor: 'pointer',
                                                                        fontSize: '14px'
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={(assignment.selectedTokens || []).includes(token)}
                                                                        onChange={(e) => {
                                                                            const updated = [...publisherAssignments];
                                                                            const currentTokens = updated[index].selectedTokens || [];
                                                                            if (e.target.checked) {
                                                                                updated[index].selectedTokens = [...currentTokens, token];
                                                                            } else {
                                                                                updated[index].selectedTokens = currentTokens.filter(t => t !== token);
                                                                            }
                                                                            setPublisherAssignments(updated);
                                                                        }}
                                                                        style={{ marginRight: '5px' }}
                                                                    />
                                                                    <span>{token}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="offer-form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Status</label>
                                                            <select
                                                                className="form-control"
                                                                value={assignment.status}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].status = e.target.value;
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Notes</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={assignment.notes}
                                                                onChange={(e) => {
                                                                    const updated = [...publisherAssignments];
                                                                    updated[index].notes = e.target.value;
                                                                    setPublisherAssignments(updated);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }
                                                                }}
                                                                placeholder="Optional notes"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Tracking URL for existing assignments */}
                                                    {assignment.assignment_id && (
                                                        <div className="form-group">
                                                            <label className="form-label">Tracking URL</label>
                                                            <div 
                                                                style={{ display: 'flex', gap: '10px' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={assignment.tracking_url || ''}
                                                                    readOnly
                                                                    id={`tracking-url-${assignment.assignment_id}`}
                                                                    placeholder={loadingAssignments ? 'Loading...' : 'No tracking URL available'}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        e.nativeEvent?.stopImmediatePropagation();
                                                                        const trackingUrl = assignment.tracking_url || '';
                                                                        if (trackingUrl) {
                                                                            navigator.clipboard.writeText(trackingUrl);
                                                                            toast.success('Copied to clipboard!');
                                                                        } else {
                                                                            toast.error('No tracking URL available');
                                                                        }
                                                                    }}
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                    }}
                                                                    title="Copy tracking URL"
                                                                >
                                                                    <CopyIcon />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Save Assignments Button */}
                                {publisherAssignments.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={async () => {
                                                try {
                                                    setLoading(true);
                                                    const assignmentData = {
                                                        offer_id: parseInt(id),
                                                        publishers: publisherAssignments.map(assignment => ({
                                                            publisher_id: assignment.publisher_id,
                                                            payout_override: assignment.payout_override ? parseFloat(assignment.payout_override) : null,
                                                            conversion_approval_percentage: assignment.conversion_approval_percentage ? parseFloat(assignment.conversion_approval_percentage) : null,
                                                            capping_budget: assignment.capping_budget?.amount ? {
                                                                duration: assignment.capping_budget.duration,
                                                                amount: parseFloat(assignment.capping_budget.amount)
                                                            } : null,
                                                            capping_conversions: assignment.capping_conversions?.amount ? {
                                                                duration: assignment.capping_conversions.duration,
                                                                amount: parseInt(assignment.capping_conversions.amount)
                                                            } : null,
                                                            callback_url: assignment.callback_url || null,
                                                            offer_url: assignment.offer_url || null,
                                                            notes: assignment.notes || null,
                                                            status: assignment.status
                                                        }))
                                                    };

                                                    await assignmentsAPI.createOrUpdateAssignments(assignmentData);
                                                    toast.success('Assignments saved successfully!');
                                                    
                                                    // Reload assignments
                                                    const response = await assignmentsAPI.getAssignments({ offer_id: id });
                                                    if (response.success && response.data) {
                                                        setAssignments(response.data);
                                                        const initialAssignments = response.data.map(assignment => ({
                                                            publisher_id: assignment.publisher_id,
                                                            payout_override: assignment.payout_override || '',
                                                            conversion_approval_percentage: assignment.conversion_approval_percentage || '',
                                                            capping_budget: assignment.capping_budget || { duration: 'day', amount: '' },
                                                            capping_conversions: assignment.capping_conversions || { duration: 'day', amount: '' },
                                                            callback_url: assignment.callback_url || '',
                                                            offer_url: assignment.offer_url || '',
                                                            notes: assignment.notes || '',
                                                            status: assignment.status || 'active',
                                                            assignment_id: assignment.id,
                                                            tracking_url: '', // Initialize tracking URL
                                                            selectedTokens: [] // Initialize selected tokens
                                                        }));
                                                        
                                                        // Automatically fetch tracking URLs for all assignments
                                                        const updatedAssignments = await Promise.all(
                                                            initialAssignments.map(async (assignment) => {
                                                                if (assignment.assignment_id) {
                                                                    try {
                                                                        const trackingResponse = await assignmentsAPI.getTrackingUrl(assignment.assignment_id);
                                                                        if (trackingResponse.success) {
                                                                            return {
                                                                                ...assignment,
                                                                                tracking_url: trackingResponse.data.tracking_url
                                                                            };
                                                                        }
                                                                    } catch (error) {
                                                                        console.error(`Error fetching tracking URL for assignment ${assignment.assignment_id}:`, error);
                                                                    }
                                                                }
                                                                return assignment;
                                                            })
                                                        );
                                                        setPublisherAssignments(updatedAssignments);
                                                    }
                                                } catch (error) {
                                                    console.error('Error saving assignments:', error);
                                                    toast.error(error.message || 'Failed to save assignments');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Assignments'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CollapsibleSection>

                {/* ==================== SECTION 8: POSTBACK ==================== */}
                <CollapsibleSection
                    title="Postback"
                    isOpen={openSections.postback}
                    onToggle={() => toggleSection('postback')}
                >
                    <div id="postBackSection">
                        <div className="form-group">
                        <label className="form-label">Global Postback URL</label>
                        <div className="input-with-action">
                            <input
                                type="text"
                                className="form-control"
                                name="globalPostbackUrl"
                                value={formData.globalPostbackUrl}
                                onChange={handleChange}
                                placeholder="https://track.bngrenew.com/postback"
                            />
                            <button type="button" className="btn btn-icon" onClick={() => copyToClipboard(formData.globalPostbackUrl)}>
                                <CopyIcon />
                            </button>
                        </div>
                        <div className="form-helper">
                            Macros: {'{clickid}'}, {'{payout}'}, {'{offer_id}'}, {'{affiliate_id}'}, {'{goal}'}, {'{source}'}, {'{sub1-5}'}
                        </div>
                    </div>

                    <div className="offer-form-row two-col">
                        <div className="form-group">
                            <label className="form-label">Method</label>
                            <select className="form-control" name="postbackMethod" value={formData.postbackMethod} onChange={handleChange}>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fire Postback On</label>
                            <div className="checkbox-group">
                                <label className="checkbox-item">
                                    <input type="checkbox" checked={(formData.postbackEvents || []).includes('conversion')} onChange={() => handleArrayToggle('postbackEvents', 'conversion')} />
                                    <span>Conversion</span>
                                </label>
                                <label className="checkbox-item">
                                    <input type="checkbox" checked={(formData.postbackEvents || []).includes('pending')} onChange={() => handleArrayToggle('postbackEvents', 'pending')} />
                                    <span>Pending</span>
                                </label>
                                <label className="checkbox-item">
                                    <input type="checkbox" checked={(formData.postbackEvents || []).includes('rejected')} onChange={() => handleArrayToggle('postbackEvents', 'rejected')} />
                                    <span>Rejected</span>
                                </label>
                            </div>
                        </div>
                    </div>

                        {/* Add Custom Postback */}
                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <button type="button" className="btn btn-outline">
                                <PlusIcon /> Add Custom Postback
                            </button>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Form Actions */}
                <div className="offer-form-actions" style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                        {loading ? 'Updating Offer...' : 'Update Offer'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/offer/list')}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={() => window.location.reload()}>
                        Reset Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditOffer;
