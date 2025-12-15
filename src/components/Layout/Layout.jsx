import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { DataProvider } from '../../context/DataContext';
import './Layout.css';

function Layout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <DataProvider>
            <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    mobileOpen={mobileMenuOpen}
                    onCloseMobile={() => setMobileMenuOpen(false)}
                />
                <div className="layout-main">
                    <Header
                        onToggleSidebar={toggleSidebar}
                        onToggleMobileMenu={toggleMobileMenu}
                    />
                    <main className="layout-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </DataProvider>
    );
}

export default Layout;
