import { useAuth } from '../../context/AuthContext';
import './Header.css';

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

function Header({ onToggleSidebar, onToggleMobileMenu }) {
    const { user } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <button className="header-toggle" onClick={onToggleSidebar} title="Toggle Sidebar">
                    <MenuIcon />
                </button>
                <button
                    className="header-toggle mobile-only"
                    onClick={onToggleMobileMenu}
                    style={{ display: 'none' }}
                >
                    <MenuIcon />
                </button>
                <div className="header-search">
                    <SearchIcon />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="header-right">
                <button className="header-icon-btn" title="Notifications">
                    <BellIcon />
                    <span className="header-notification-badge"></span>
                </button>
                <button className="header-icon-btn" title="Settings">
                    <SettingsIcon />
                </button>
                <div className="header-user">
                    <div className="header-avatar">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="header-user-info">
                        <span className="header-user-name">{user?.fullName || 'User'}</span>
                        <span className="header-user-email">{user?.email || 'user@example.com'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
