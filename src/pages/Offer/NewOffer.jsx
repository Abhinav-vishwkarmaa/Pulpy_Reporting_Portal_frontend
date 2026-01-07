import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { offersAPI, advertisersAPI } from '../../services/api';
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

// Timezones - matching HTML format
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

// Revenue models - matching HTML (CPA, CPM shown, but including all common ones)
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
    'Console',
    'Tv',
    'Car Browser',
    'Smart Display',
    'Camera',
    'Portable Media Player',
    'Phablet',
    'Unsolved'
];

// OS - EXACTLY matching HTML
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

// Token types - matching HTML (hasoffers, affise shown, but including API ones)
const tokenTypes = ['hasoffers', 'affise'];

// Advertiser Parameters - matching HTML
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

// Platform Tokens - matching HTML
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

function NewOffer() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [advertisers, setAdvertisers] = useState([]);
    const [loadingAdvertisers, setLoadingAdvertisers] = useState(true);
    const [showTokenTable, setShowTokenTable] = useState(false);
    const [showMacrosInfo, setShowMacrosInfo] = useState(false);
    const [tokenMappings, setTokenMappings] = useState([]);

    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [formData, setFormData] = useState({
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

    // Function to build preview URL with tokens
    const buildPreviewUrl = (baseUrl, mappings) => {
        if (!baseUrl) return '';

        try {
            // Split URL into parts: base, hash fragment, and existing query
            const hashIndex = baseUrl.indexOf('#');
            const queryIndex = baseUrl.indexOf('?');

            let basePart = baseUrl;
            let hashPart = '';
            let existingQuery = '';

            // Extract hash fragment if present
            if (hashIndex !== -1) {
                basePart = baseUrl.substring(0, hashIndex);
                const afterHash = baseUrl.substring(hashIndex + 1);

                // Check if there's a query string after the hash
                const queryInHash = afterHash.indexOf('?');
                if (queryInHash !== -1) {
                    hashPart = afterHash.substring(0, queryInHash);
                    existingQuery = afterHash.substring(queryInHash + 1);
                } else {
                    hashPart = afterHash;
                }
            } else if (queryIndex !== -1) {
                // No hash, but has query string
                basePart = baseUrl.substring(0, queryIndex);
                existingQuery = baseUrl.substring(queryIndex + 1);
            }

            // Build query string from enabled mappings (without URL encoding the tokens)
            const queryParams = [];
            mappings
                .filter(mapping => mapping.enabled)
                .forEach(mapping => {
                    // Don't URL encode the token values - keep them as {token}
                    queryParams.push(`${encodeURIComponent(mapping.advertiserParam)}=${mapping.platformToken}`);
                });

            const newQueryString = queryParams.join('&');

            // Combine: base + hash + query
            let result = basePart;
            if (hashPart) {
                result += `#${hashPart}`;
            }
            if (newQueryString) {
                result += `?${newQueryString}`;
            }

            return result;
        } catch (e) {
            // If URL is invalid, just return base URL
            return baseUrl;
        }
    };

    // Update preview URL when offer_url or token mappings change
    useEffect(() => {
        if (formData.offer_url) {
            if (tokenMappings.length > 0 && showTokenTable) {
                // Build URL with token mappings
                const previewUrl = buildPreviewUrl(formData.offer_url, tokenMappings);
                setFormData(prev => {
                    if (prev.preview_url !== previewUrl) {
                        return { ...prev, preview_url: previewUrl };
                    }
                    return prev;
                });
            } else {
                // If no token mappings, just use the base URL
                setFormData(prev => {
                    if (prev.preview_url !== prev.offer_url) {
                        return { ...prev, preview_url: prev.offer_url };
                    }
                    return prev;
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.offer_url, tokenMappings, showTokenTable]);

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
                    // Preview URL will remain as base URL since all mappings are disabled
                }
            } else if (name === 'token_type' && !value) {
                setShowTokenTable(false);
                // Reset preview URL to base offer URL when token type is cleared
                if (formData.offer_url) {
                    setFormData(prev => ({ ...prev, preview_url: prev.offer_url }));
                }
            }
        }
    };

    const handleTokenMappingChange = (id, field, value) => {
        setTokenMappings(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            // Immediately update preview URL when mappings change
            if (formData.offer_url && showTokenTable) {
                const previewUrl = buildPreviewUrl(formData.offer_url, updated);
                setFormData(formDataPrev => ({ ...formDataPrev, preview_url: previewUrl }));
            }
            return updated;
        });
    };

    const handleTestOfferLink = () => {
        // Test the preview URL if available, otherwise test the base offer URL
        const urlToTest = formData.preview_url || formData.offer_url;
        if (urlToTest) {
            window.open(urlToTest, '_blank');
        } else {
            toast.error('Please enter an Offer URL first');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name) {
                toast.error('Offer name is required');
                setLoading(false);
                return;
            }
            if (!formData.advertiser_id) {
                toast.error('Advertiser is required');
                setLoading(false);
                return;
            }
            const finalCategory = showCustomCategory ? formData.custom_category : formData.category;
            if (!finalCategory) {
                toast.error('Category is required');
                setLoading(false);
                return;
            }
            if (!formData.advertiser_amount) {
                toast.error('Advertiser amount is required');
                setLoading(false);
                return;
            }
            if (!formData.affiliate_amount) {
                toast.error('Affiliate amount is required');
                setLoading(false);
                return;
            }

            // Format the data for API - convert HTML values to API values
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
                category: showCustomCategory ? formData.custom_category : formData.category,
                status: formData.status.toLowerCase(), // LIVE -> live, PAUSE -> paused
                offer_visibility: formData.offer_visibility,
                preview_url: formData.preview_url || null,
                token_type: formData.token_type || null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
                // IP Targeting - convert ALLOW/BLOCK to allow/block
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
                conversion_cap: formData.capping_type === 'none' && formData.conversion_cap ? parseInt(formData.conversion_cap) : null,
                budget_cap: formData.budget_cap ? parseFloat(formData.budget_cap) : null,
                cap_action: formData.cap_action || 'pause',
                // Additional capping fields for backward compatibility
                capping_conversions: formData.capping_conversions && formData.capping_conversions_duration !== 'nocap'
                    ? parseInt(formData.capping_conversions)
                    : null,
                advertiser_capping_budget_amount: formData.advertiser_capping_budget_amount && formData.advertiser_capping_budget_duration !== 'nocap'
                    ? parseFloat(formData.advertiser_capping_budget_amount)
                    : null,
                // Fallback
                fallback_enabled: formData.fallback_enabled ? 1 : 0,
                fallback_url: formData.fallback_url || null,
                fallback_offer_id: formData.fallback_offer_id ? parseInt(formData.fallback_offer_id) : null
            };

            await offersAPI.createOffer(offerData);
            toast.success('Offer created successfully!');
            navigate('/offer/list');
        } catch (error) {
            console.error('Create offer error:', error);
            toast.error('Failed to create offer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="offer-page">
            <div className="offer-header">
                <div className="offer-header-left">
                    <h1>New Offer</h1>
                    <p>Create a new offer for your campaigns</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="offer-form-container">
                    <div className="offer-form-header">
                        <h2>Offer Details</h2>
                        <p>Fill in the details below to create a new offer</p>
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
                                                setFormData(prev => ({ ...prev, category: '', custom_category: '' }));
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
                                    <option value="total">Total</option>
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

                            {formData.capping_type === 'total' && (
                                <div className="form-group">
                                    <label className="form-label">Total Cap</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="total_cap"
                                        value={formData.total_cap}
                                        onChange={handleChange}
                                        placeholder="50000"
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

                    {/* Actions */}
                    <div className="offer-form-actions">
                        <button type="submit" className="btn btn-success" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Offer'}
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

export default NewOffer;
