import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { offersAPI, advertisersAPI, assignmentsAPI, publishersAPI } from '../../services/api';
import { copyToClipboard as safeCopyToClipboard } from '../../utils/clipboard';
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

// Devices - EXACTLY matching HTML (matching NewOffer.jsx)
const devices = [
    'All',
    'Desktop',
    'Smartphone',
    'Tablet',
    'Feature Phone',
    'Console',
    'Tv',
    'Car Browser',
    'Smart Display',
    'Camera',
    'Portable Media Player',
    'Phablet',
    'Unsolved'
];

// OS - EXACTLY matching HTML (matching NewOffer.jsx)
const osList = [
    'All',
    'Android',
    'blackberry',
    'PalmOS',
    'Symbian',
    'Windows',
    'IOS',
    'MeeGo',
    'Maemo',
    'J2ME',
    'webOS',
    'Bada',
    'BREW',
    'Others'
];

// Token types - matching NewOffer.jsx
const tokenTypes = ['hasoffers', 'affise'];

// Advertiser Parameters - matching NewOffer.jsx
const advertiserParameters = [
    'aff_sub',
    'aff_sub2',
    'aff_sub3',
    'aff_sub4',
    'aff_sub5',
    'aff_unique1',
    'aff_unique2',
    'aff_unique3',
    'aff_unique4',
    'aff_unique5',
    'source',
    'aff_click_id',
    'google_aid',
    'ios_ifa',
    'unid',
    'user_id'
];

// Platform Tokens - matching NewOffer.jsx
const platformTokens = [
    '{tid}',
    '{ip}',
    '{offerid}',
    '{useragent}',
    '{row-useragent}',
    '{aff_id}',
    '{adv_id}',
    '{country}',
    '{timestamp}',
    '{aff_sub1}',
    '{aff_sub2}',
    '{aff_sub3}',
    '{aff_sub4}',
    '{aff_sub5}',
    '{deviceid}',
    '{source}',
    '{googleaid}',
    '{androidid}',
    '{iosidfa}',
    '{random}'
];

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
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [showTokenTable, setShowTokenTable] = useState(false);
    const [showMacrosInfo, setShowMacrosInfo] = useState(false);
    const [tokenMappings, setTokenMappings] = useState([]);

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

    // Form data - matching NewOffer.jsx structure exactly
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
        custom_category: '',
        status: 'live',
        offer_visibility: 'PUBLIC',
        preview_url: '',
        token_type: '',
        start_date: '',
        start_time: '00:00:00',
        end_date: '',
        end_time: '23:59:59',
        capping_type: 'none',
        daily_cap: '',
        weekly_cap: '',
        monthly_cap: '',
        total_cap: '',
        conversion_cap: '',
        budget_cap: '',
        cap_action: 'pause',
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
        fallback_offer_id: ''
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
            setFormData(prev => {
                const updated = { ...prev, [name]: value };
                // When offer_url changes, copy it to preview_url initially
                if (name === 'offer_url' && value) {
                    updated.preview_url = value;
                }
                return updated;
            });
            // Show token table when token type is selected
            if (name === 'token_type' && value) {
                setShowTokenTable(true);
                // Initialize with default mappings if empty
                if (tokenMappings.length === 0) {
                    const defaultMappings = [
                        { id: 0, enabled: false, advertiserParam: 'aff_sub', platformToken: '{row-useragent}' },
                        { id: 1, enabled: false, advertiserParam: 'aff_sub', platformToken: '{ip}' },
                        { id: 2, enabled: false, advertiserParam: 'aff_sub3', platformToken: '{offerid}' },
                        { id: 3, enabled: false, advertiserParam: 'aff_sub4', platformToken: '{useragent}' },
                        { id: 4, enabled: false, advertiserParam: 'aff_sub5', platformToken: '{row-useragent}' }
                    ];
                    setTokenMappings(defaultMappings);
                }
            } else if (name === 'token_type' && !value) {
                setShowTokenTable(false);
                if (formData.offer_url) {
                    setFormData(prev => ({ ...prev, preview_url: prev.offer_url }));
                }
            }
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

    const copyToClipboard = async (text) => {
        const result = await safeCopyToClipboard(text);
        if (result.success) {
            toast.success('Copied to clipboard!');
        } else {
            toast.error(result.error || 'Failed to copy to clipboard');
        }
    };

    const generateTrackingUrl = () => {
        const baseUrl = formData.trackingDomain || 'https://track.bngrenew.com';
        const url = `${baseUrl}/click?o=${formData.offerId}&a={affiliate_id}&s={source}&c={clickid}`;
        setFormData(prev => ({ ...prev, trackingUrl: url }));
        toast.success('Tracking URL generated!');
    };

    // Function to build preview URL with tokens
    const buildPreviewUrl = (baseUrl, mappings) => {
        if (!baseUrl) return '';

        try {
            const hashIndex = baseUrl.indexOf('#');
            const queryIndex = baseUrl.indexOf('?');

            let basePart = baseUrl;
            let hashPart = '';
            let existingQuery = '';

            if (hashIndex !== -1) {
                basePart = baseUrl.substring(0, hashIndex);
                const afterHash = baseUrl.substring(hashIndex + 1);
                const queryInHash = afterHash.indexOf('?');
                if (queryInHash !== -1) {
                    hashPart = afterHash.substring(0, queryInHash);
                    existingQuery = afterHash.substring(queryInHash + 1);
                } else {
                    hashPart = afterHash;
                }
            } else if (queryIndex !== -1) {
                basePart = baseUrl.substring(0, queryIndex);
                existingQuery = baseUrl.substring(queryIndex + 1);
            }

            const queryParams = [];
            mappings
                .filter(mapping => mapping.enabled)
                .forEach(mapping => {
                    queryParams.push(`${encodeURIComponent(mapping.advertiserParam)}=${mapping.platformToken}`);
                });

            const newQueryString = queryParams.join('&');
            let result = basePart;
            if (hashPart) {
                result += `#${hashPart}`;
            }
            if (newQueryString) {
                result += `?${newQueryString}`;
            }

            return result;
        } catch (e) {
            return baseUrl;
        }
    };

    const handleTokenMappingChange = (id, field, value) => {
        setTokenMappings(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            if (formData.offer_url && showTokenTable) {
                const previewUrl = buildPreviewUrl(formData.offer_url, updated);
                setFormData(formDataPrev => ({ ...formDataPrev, preview_url: previewUrl }));
            }
            return updated;
        });
    };

    const handleTestOfferLink = () => {
        const urlToTest = formData.preview_url || formData.offer_url;
        if (urlToTest) {
            window.open(urlToTest, '_blank');
        } else {
            toast.error('Please enter an Offer URL first');
        }
    };

    // Update preview URL when offer_url or token mappings change
    useEffect(() => {
        if (formData.offer_url) {
            if (tokenMappings.length > 0 && showTokenTable) {
                const previewUrl = buildPreviewUrl(formData.offer_url, tokenMappings);
                setFormData(prev => {
                    if (prev.preview_url !== previewUrl) {
                        return { ...prev, preview_url: previewUrl };
                    }
                    return prev;
                });
            } else {
                setFormData(prev => {
                    if (prev.preview_url !== prev.offer_url) {
                        return { ...prev, preview_url: prev.offer_url };
                    }
                    return prev;
                });
            }
        }
    }, [formData.offer_url, tokenMappings, showTokenTable]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name) {
                toast.error('Offer name is required');
                setLoading(false);
                return;
            }

            // Format the data for API - matching NewOffer.jsx exactly
            const finalCategory = showCustomCategory ? formData.custom_category : formData.category;

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
                category: finalCategory,
                status: formData.status.toLowerCase(),
                offer_visibility: formData.offer_visibility,
                preview_url: formData.preview_url || null,
                token_type: formData.token_type || null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
                // IP Targeting
                ip_action: formData.ip_action.toLowerCase(),
                ip_list: formData.ip_list || null,
                // Device Targeting
                device_targeting_json: formData.device_targeting && formData.device_targeting.length > 0
                    ? JSON.stringify({ device: formData.device_targeting })
                    : null,
                // OS Targeting
                os_targeting_json: formData.os_targeting && formData.os_targeting.length > 0
                    ? JSON.stringify({ os: formData.os_targeting })
                    : null,
                // Browser Targeting
                browser_targeting_json: formData.browser_targeting && formData.browser_targeting.length > 0
                    ? JSON.stringify({ browser: formData.browser_targeting })
                    : null,
                // Capping
                capping_type: formData.capping_type,
                daily_cap: formData.capping_type === 'daily' && formData.daily_cap ? parseInt(formData.daily_cap) : null,
                weekly_cap: formData.capping_type === 'weekly' && formData.weekly_cap ? parseInt(formData.weekly_cap) : null,
                monthly_cap: formData.capping_type === 'monthly' && formData.monthly_cap ? parseInt(formData.monthly_cap) : null,
                total_cap: formData.capping_type === 'total' && formData.total_cap ? parseInt(formData.total_cap) : null,
                conversion_cap: formData.capping_type === 'none' && formData.conversion_cap ? parseInt(formData.conversion_cap) : null,
                budget_cap: formData.budget_cap ? parseFloat(formData.budget_cap) : null,
                cap_action: formData.cap_action || 'pause',
                // Additional capping fields
                advertiser_capping_budget_duration: formData.advertiser_capping_budget_duration,
                advertiser_capping_budget_amount: formData.advertiser_capping_budget_amount && formData.advertiser_capping_budget_duration !== 'nocap'
                    ? parseFloat(formData.advertiser_capping_budget_amount)
                    : null,
                capping_conversions_duration: formData.capping_conversions_duration,
                capping_conversions: formData.capping_conversions && formData.capping_conversions_duration !== 'nocap'
                    ? parseInt(formData.capping_conversions)
                    : null,
                advertiser_over_capping: formData.advertiser_over_capping,
                affiliate_over_capping: formData.affiliate_over_capping,
                // Fallback
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
                <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2196F3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Loading offer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="offer-page">
            <div className="offer-header">
                <div className="offer-header-left">
                    <h1>Edit Offer</h1>
                    <p>Update offer details and settings</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="offer-form-container">
                    <div className="offer-form-header">
                        <h2>Offer Details</h2>
                        <p>Update the details below to modify the offer</p>
                    </div>

                    {/* Basic Information */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Basic Information</h3>
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
                                {!showCustomCategory ? (
                                    <select
                                        className="form-control"
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__custom__') {
                                                setShowCustomCategory(true);
                                                setFormData(prev => ({ ...prev, category: '', custom_category: '' }));
                                            } else {
                                                setFormData(prev => ({ ...prev, category: e.target.value, custom_category: '' }));
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__custom__">+ Add Custom Category</option>
                                    </select>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="custom_category"
                                            value={formData.custom_category}
                                            onChange={handleChange}
                                            placeholder="Enter custom category"
                                            required
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowCustomCategory(false);
                                                setFormData(prev => ({ ...prev, custom_category: '' }));
                                            }}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
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

                    </div>

                    {/* Pricing Information */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Pricing Information</h3>
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
                    </div>

                    {/* Schedule */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Schedule</h3>
                        <div className="offer-form-row two-col">
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
                                    step="1"
                                />
                            </div>
                        </div>
                        <div className="offer-form-row two-col">
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
                                    step="1"
                                />
                            </div>
                        </div>
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Offer Live/Pause</label>
                                <select
                                    className="form-control"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="live">Live (Take Live Now)</option>
                                    <option value="paused">Pause</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* URLs */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">URLs</h3>
                        {/* Offer URL */}
                        <div className="offer-form-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label required">Offer URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="offer_url"
                                    value={formData.offer_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/offer"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleTestOfferLink}
                                style={{ marginBottom: '0', height: 'fit-content', whiteSpace: 'nowrap' }}
                            >
                                🔗 Test Offer Link
                            </button>
                        </div>
                        {/* Offer URL Autocomplete */}
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Offer URL Autocomplete (with tokens)</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="preview_url"
                                    value={formData.preview_url}
                                    onChange={handleChange}
                                    placeholder="Autocomplete offer URL"
                                    disabled
                                />
                            </div>
                        </div>
                        {/* Tokens */}
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Tokens</label>
                                <select
                                    className="form-control"
                                    name="token_type"
                                    value={formData.token_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Partner</option>
                                    {tokenTypes.map(token => (
                                        <option key={token} value={token}>{token}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Token Mappings Table */}
                        {showTokenTable && tokenMappings.length > 0 && (
                            <div className="offer-form-row" style={{ marginTop: '20px' }}>
                                <div className="form-group" style={{ width: '100%' }}>
                                    <table className="table table-striped" style={{ marginTop: '10px' }}>
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="text-center" style={{ textTransform: 'uppercase' }}>Enable</th>
                                                <th className="text-center" style={{ textTransform: 'uppercase' }}>Advertiser Parameter</th>
                                                <th className="text-center" style={{ textTransform: 'uppercase' }}>Platform Token</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tokenMappings.map((mapping) => (
                                                <tr key={mapping.id}>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={mapping.enabled}
                                                            onChange={(e) => handleTokenMappingChange(mapping.id, 'enabled', e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="form-control"
                                                            value={mapping.advertiserParam}
                                                            onChange={(e) => handleTokenMappingChange(mapping.id, 'advertiserParam', e.target.value)}
                                                        >
                                                            {advertiserParameters.map(param => (
                                                                <option key={param} value={param}>{param}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="form-control"
                                                            value={mapping.platformToken}
                                                            onChange={(e) => handleTokenMappingChange(mapping.id, 'platformToken', e.target.value)}
                                                        >
                                                            {platformTokens.map(token => (
                                                                <option key={token} value={token}>{token}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* Tokens/Macros Info */}
                        <div className="offer-form-row" style={{ marginTop: '20px' }}>
                            <div className="form-group" style={{ width: '100%' }}>
                                <div className="card" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                                    <div
                                        className="card-header"
                                        style={{
                                            backgroundColor: '#e6eced',
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        onClick={() => setShowMacrosInfo(!showMacrosInfo)}
                                    >
                                        <h5 style={{ margin: 0 }}>Tokens/macros</h5>
                                        <span style={{ fontSize: '20px' }}>
                                            {showMacrosInfo ? '▼' : '▶'}
                                        </span>
                                    </div>
                                    {showMacrosInfo && (
                                        <div className="card-body" style={{ padding: '15px' }}>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{tid}'}</strong> = Unique ID of the transaction form this system.
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{ip}'}</strong> = Session IP4/6
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{offerid}'}</strong> = OfferID
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{useragent}'}</strong> = Device UserAgent Urlencoded
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{raw_useragent}'}</strong> = Raw Device UserAgent (not recommended)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_id}'}</strong> = Affiliate Account ID (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{sub_aff_id}'}</strong> = Sub Affiliate Account ID (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{adv_id}'}</strong> = Advertiser Account ID (advertiser data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{country}'}</strong> = Country
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{timestamp}'}</strong> = UTC Timestamp 1991-04-20 00:00:00
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_sub1}'}</strong> = Aff Sub ID 1 (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_sub2}'}</strong> = Aff Sub ID 2 (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_sub3}'}</strong> = Aff Sub ID 3 (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_sub4}'}</strong> = Aff Sub ID 4 (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{aff_sub5}'}</strong> = Aff Sub ID 5 (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{deviceid}'}</strong> = Device ID (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{source}'}</strong> = Traffic Source (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{googleaid}'}</strong> = Google AID (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{androidid}'}</strong> = Android ID (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{iosidfa}'}</strong> = iOS IDFA (affiliate data)
                                            </p>
                                            <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                <strong>{'{os}'}</strong> = OS Name (device data)
                                            </p>
                                            <p style={{ marginBottom: '0', fontSize: '14px' }}>
                                                <strong>{'{os_ver}'}</strong> = OS Version (device data)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Targeting */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Targeting</h3>
                        <div className="offer-form-row">
                            <div className="form-group" style={{ flex: '0 0 150px' }}>
                                <label className="form-label">Select Action</label>
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
                            <div className="form-group" style={{ flex: '1' }}>
                                <label className="form-label">Target IP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ip_list"
                                    value={formData.ip_list}
                                    onChange={handleChange}
                                    placeholder="1.1.1.1,2.2.2.2 (comma separated)"
                                />
                            </div>
                        </div>
                        <div className="offer-form-row">
                            <div className="form-group" style={{ flex: '0 0 150px' }}>
                                <label className="form-label">Select Action</label>
                                <select
                                    className="form-control"
                                    name="browser_action"
                                    value={formData.browser_action}
                                    onChange={handleChange}
                                >
                                    <option value="ALLOW">Allow</option>
                                    <option value="BLOCK">Block</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: '1' }}>
                                <label className="form-label">Target Browsers</label>
                                <select
                                    className="form-control"
                                    name="browser_targeting"
                                    value={formData.browser_targeting}
                                    onChange={handleChange}
                                    multiple
                                    size="5"
                                >
                                    {browsers.map(browser => (
                                        <option key={browser} value={browser.toLowerCase() === 'all' ? 'all' : browser.toLowerCase()}>
                                            {browser}
                                        </option>
                                    ))}
                                </select>
                                <small>Hold Ctrl/Cmd to select multiple</small>
                            </div>
                        </div>
                        <div className="offer-form-row">
                            <div className="form-group" style={{ flex: '0 0 150px' }}>
                                <label className="form-label">Select Action</label>
                                <select
                                    className="form-control"
                                    name="device_action"
                                    value={formData.device_action}
                                    onChange={handleChange}
                                >
                                    <option value="ALLOW">Allow</option>
                                    <option value="BLOCK">Block</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: '1' }}>
                                <label className="form-label">Target Devices</label>
                                <select
                                    className="form-control"
                                    name="device_targeting"
                                    value={formData.device_targeting}
                                    onChange={handleChange}
                                    multiple
                                    size="5"
                                >
                                    {devices.map(device => {
                                        const value = device.toLowerCase() === 'all' ? 'all' : device.toLowerCase().replace(/\s+/g, '_');
                                        return (
                                            <option key={device} value={value}>
                                                {device}
                                            </option>
                                        );
                                    })}
                                </select>
                                <small>Hold Ctrl/Cmd to select multiple</small>
                            </div>
                        </div>
                        <div className="offer-form-row">
                            <div className="form-group" style={{ flex: '0 0 150px' }}>
                                <label className="form-label">Select Action</label>
                                <select
                                    className="form-control"
                                    name="os_action"
                                    value={formData.os_action}
                                    onChange={handleChange}
                                >
                                    <option value="ALLOW">Allow</option>
                                    <option value="BLOCK">Block</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: '1' }}>
                                <label className="form-label">Target OS</label>
                                <select
                                    className="form-control"
                                    name="os_targeting"
                                    value={formData.os_targeting}
                                    onChange={handleChange}
                                    multiple
                                    size="5"
                                >
                                    {osList.map(os => (
                                        <option key={os} value={os.toLowerCase() === 'all' ? 'all' : os.toLowerCase()}>
                                            {os}
                                        </option>
                                    ))}
                                </select>
                                <small>Hold Ctrl/Cmd to select multiple</small>
                            </div>
                        </div>
                    </div>

                    {/* Capping */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Capping</h3>
                        <div className="offer-form-row three-col">
                            <div className="form-group">
                                <label className="form-label">Capping Type</label>
                                <select
                                    className="form-control"
                                    name="capping_type"
                                    value={formData.capping_type}
                                    onChange={handleChange}
                                >
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            {formData.capping_type === 'daily' && (
                                <div className="form-group">
                                    <label className="form-label">Daily Cap</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="daily_cap"
                                        value={formData.daily_cap}
                                        onChange={handleChange}
                                        placeholder="1000"
                                    />
                                </div>
                            )}

                            {formData.capping_type === 'weekly' && (
                                <div className="form-group">
                                    <label className="form-label">Weekly Cap</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="weekly_cap"
                                        value={formData.weekly_cap || ''}
                                        onChange={handleChange}
                                        placeholder="5000"
                                    />
                                </div>
                            )}

                            {formData.capping_type === 'monthly' && (
                                <div className="form-group">
                                    <label className="form-label">Monthly Cap</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="monthly_cap"
                                        value={formData.monthly_cap}
                                        onChange={handleChange}
                                        placeholder="20000"
                                    />
                                </div>
                            )}


                            {formData.capping_type === 'none' && (
                                <div className="form-group">
                                    <label className="form-label">Conversion Cap</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="conversion_cap"
                                        value={formData.conversion_cap || ''}
                                        onChange={handleChange}
                                        placeholder="10000"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Budget Cap</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="budget_cap"
                                    value={formData.budget_cap || ''}
                                    onChange={handleChange}
                                    placeholder="100000.00"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cap Action</label>
                                <select
                                    className="form-control"
                                    name="cap_action"
                                    value={formData.cap_action || 'pause'}
                                    onChange={handleChange}
                                >
                                    <option value="pause">Pause</option>
                                    <option value="alert">Alert</option>
                                    <option value="reject">Reject</option>
                                </select>
                            </div>
                        </div>

                        {/* Advertiser Capping Budget and Capping Conversions in same row */}
                        <div className="offer-form-row" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginTop: '20px' }}>
                            {/* Advertiser Capping Budget */}
                            <div className="form-group" style={{ flex: '1', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                <div style={{ flex: '0 0 60%' }}>
                                    <label className="form-label">Advertiser Capping Budget</label>
                                    <select
                                        className="form-control"
                                        name="advertiser_capping_budget_duration"
                                        value={formData.advertiser_capping_budget_duration}
                                        onChange={handleChange}
                                    >
                                        <option value="nocap">No Capping</option>
                                        <option value="daily">daily</option>
                                        <option value="weekly">weekly</option>
                                        <option value="monthly">monthly</option>
                                    </select>
                                </div>
                                <div style={{ flex: '0 0 38%' }}>
                                    <label className="form-label">Budget Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="advertiser_capping_budget_amount"
                                        value={formData.advertiser_capping_budget_amount}
                                        onChange={handleChange}
                                        placeholder="00.00"
                                        disabled={formData.advertiser_capping_budget_duration === 'nocap'}
                                    />
                                </div>
                            </div>

                            {/* Capping Conversions */}
                            <div className="form-group" style={{ flex: '1', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                <div style={{ flex: '0 0 60%' }}>
                                    <label className="form-label">Capping Conversions</label>
                                    <select
                                        className="form-control"
                                        name="capping_conversions_duration"
                                        value={formData.capping_conversions_duration}
                                        onChange={handleChange}
                                    >
                                        <option value="nocap">No Capping</option>
                                        <option value="daily">daily</option>
                                        <option value="weekly">weekly</option>
                                        <option value="monthly">monthly</option>
                                    </select>
                                </div>
                                <div style={{ flex: '0 0 38%' }}>
                                    <label className="form-label">Conversion Count</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="capping_conversions"
                                        value={formData.capping_conversions}
                                        onChange={handleChange}
                                        placeholder="00.00"
                                        disabled={formData.capping_conversions_duration === 'nocap'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advertiser Over Capping and Affiliate Over Capping in same row */}
                        <div className="offer-form-row two-col" style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Advertiser Over Capping</label>
                                <select
                                    className="form-control"
                                    name="advertiser_over_capping"
                                    value={formData.advertiser_over_capping}
                                    onChange={handleChange}
                                >
                                    <option value="STOP">Stop Offer</option>
                                    <option value="ENABLEFALLBACK">Enable Fallback</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Affiliate Over Capping</label>
                                <select
                                    className="form-control"
                                    name="affiliate_over_capping"
                                    value={formData.affiliate_over_capping}
                                    onChange={handleChange}
                                >
                                    <option value="STOP">Stop Offer for affiliate</option>
                                    <option value="ENABLEFALLBACK">Enable Fallback for affiliate</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Fallback */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Fallback</h3>
                        <div className="offer-form-row">
                            <div className="form-group">
                                <label className="form-label">Enable Fallback</label>
                                <select
                                    className="form-control"
                                    name="fallback_enabled"
                                    value={formData.fallback_enabled ? 'true' : 'false'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fallback_enabled: e.target.value === 'true' }))}
                                >
                                    <option value="false">Disabled</option>
                                    <option value="true">Enable</option>
                                </select>
                            </div>
                        </div>
                        <div className="offer-form-row two-col">
                            <div className="form-group">
                                <label className="form-label">Fallback to URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="fallback_url"
                                    value={formData.fallback_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/fallback"
                                    disabled={!formData.fallback_enabled}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fallback to Offer</label>
                                <select
                                    className="form-control"
                                    name="fallback_offer_id"
                                    value={formData.fallback_offer_id}
                                    onChange={handleChange}
                                    disabled={!formData.fallback_enabled}
                                >
                                    <option value="">Select Offer</option>
                                    {/* Offers would be loaded from API */}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Advertiser Postback */}
                    <div className="offer-form-section">
                        <h3 className="offer-form-section-title">Advertiser Postback</h3>
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
                    </div>

                    {/* Postback */}
                    <div className="offer-form-section" id="postBackSection">
                        <h3 className="offer-form-section-title">Postback</h3>
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

                    {/* Actions */}
                    <div className="offer-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Offer'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/offer/list')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditOffer;
