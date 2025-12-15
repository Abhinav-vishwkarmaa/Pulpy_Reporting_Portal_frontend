import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

// Icons as SVG components
const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
);

const OfferIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const AffiliateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const AdvertiserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
);

const AssignmentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
);

const ReportsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const ImportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({
        offer: true,
        affiliate: true,
        advertiser: true,
        assignment: true,
        settings: true
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const menuItems = [
        {
            type: 'link',
            path: '/',
            icon: <DashboardIcon />,
            text: 'Dashboard',
            exact: true
        },
        {
            type: 'menu',
            key: 'offer',
            icon: <OfferIcon />,
            text: 'Offer',
            basePath: '/offer',
            children: [
                { path: '/offer/list', text: 'Offer List' },
                { path: '/offer/new', text: 'New Offer' }
            ]
        },
        {
            type: 'menu',
            key: 'affiliate',
            icon: <AffiliateIcon />,
            text: 'Affiliate',
            basePath: '/affiliate',
            children: [
                { path: '/affiliate/manage', text: 'Manage Affiliate' },
                { path: '/affiliate/new', text: 'New Affiliate' },
                { path: '/affiliate/postback-test', text: 'Aff. Postback Test' }
            ]
        },
        {
            type: 'menu',
            key: 'advertiser',
            icon: <AdvertiserIcon />,
            text: 'Advertiser',
            basePath: '/advertiser',
            children: [
                { path: '/advertiser/manage', text: 'Manage Advertiser' },
                { path: '/advertiser/new', text: 'New Advertiser' }
            ]
        },
        {
            type: 'menu',
            key: 'assignment',
            icon: <AssignmentIcon />,
            text: 'Assignment',
            basePath: '/assignment',
            children: [
                { path: '/assignment/manage', text: 'Manage Assignment' },
                { path: '/assignment/new', text: 'New Assignment' }
            ]
        },
        {
            type: 'link',
            path: '/reports',
            icon: <ReportsIcon />,
            text: 'Reports'
        },
        {
            type: 'menu',
            key: 'settings',
            icon: <SettingsIcon />,
            text: 'Settings',
            basePath: '/settings',
            children: [
                { path: '/settings/profile', text: 'Update Profile' }
            ]
        },
        {
            type: 'link',
            path: '/import',
            icon: <ImportIcon />,
            text: 'Import'
        }
    ];

    const handleLogout = () => {
        logout();
        onCloseMobile();
    };

    return (
        <>
            <div className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`} onClick={onCloseMobile}></div>
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">P</div>
                    <span className="sidebar-brand">Pulpy Reporting Portal</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => {
                        if (item.type === 'link') {
                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive: active }) =>
                                        `nav-item ${item.exact ? (location.pathname === item.path ? 'active' : '') : (active ? 'active' : '')}`
                                    }
                                    data-tooltip={item.text}
                                    onClick={onCloseMobile}
                                    end={item.exact}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-text">{item.text}</span>
                                </NavLink>
                            );
                        }

                        if (item.type === 'menu') {
                            return (
                                <div key={index} className="nav-section">
                                    <div
                                        className={`nav-item ${isActive(item.basePath) ? 'active' : ''}`}
                                        onClick={() => toggleMenu(item.key)}
                                        data-tooltip={item.text}
                                    >
                                        <span className="nav-item-icon">{item.icon}</span>
                                        <span className="nav-item-text">{item.text}</span>
                                        <span className={`nav-item-arrow ${openMenus[item.key] ? 'open' : ''}`}>
                                            <ChevronIcon />
                                        </span>
                                    </div>
                                    <div className={`nav-submenu ${openMenus[item.key] ? 'open' : ''}`}>
                                        {item.children.map((child, childIndex) => (
                                            <NavLink
                                                key={childIndex}
                                                to={child.path}
                                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                                onClick={onCloseMobile}
                                            >
                                                <span className="nav-item-text">{child.text}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.fullName || 'User'}</div>
                            <div className="sidebar-user-role">{user?.role || 'Admin'}</div>
                        </div>
                    </div>
                    <div
                        className="nav-item"
                        onClick={handleLogout}
                        style={{ marginTop: '12px', cursor: 'pointer' }}
                        data-tooltip="Logout"
                    >
                        <span className="nav-item-icon"><LogoutIcon /></span>
                        <span className="nav-item-text">Logout</span>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
