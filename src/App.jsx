import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import OfferList from './pages/Offer/OfferList';
import NewOffer from './pages/Offer/NewOffer';
import EditOffer from './pages/Offer/EditOffer';
import OfferDetail from './pages/Offer/OfferDetail';
import ManageAffiliate from './pages/Affiliate/ManageAffiliate';
import NewAffiliate from './pages/Affiliate/NewAffiliate';
import EditAffiliate from './pages/Affiliate/EditAffiliate';
import PostbackTest from './pages/Affiliate/PostbackTest';
import ManageAdvertiser from './pages/Advertiser/ManageAdvertiser';
import NewAdvertiser from './pages/Advertiser/NewAdvertiser';
import EditAdvertiser from './pages/Advertiser/EditAdvertiser';
import ManageAssignment from './pages/Assignment/ManageAssignment';
import NewAssignment from './pages/Assignment/NewAssignment';
import EditAssignment from './pages/Assignment/EditAssignment';
import DetailedReports from './pages/Reports/DetailedReports';
import UpdateProfile from './pages/Settings/UpdateProfile';
import Logs from './pages/Logs/Logs';
import ImportData from './pages/Import/ImportData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="offer">
          <Route index element={<OfferList />} />
          <Route path="list" element={<OfferList />} />
          <Route path="new" element={<NewOffer />} />
          <Route path="edit/:id" element={<EditOffer />} />
          <Route path="detail/:id" element={<OfferDetail />} />
        </Route>
        <Route path="affiliate">
          <Route index element={<ManageAffiliate />} />
          <Route path="manage" element={<ManageAffiliate />} />
          <Route path="new" element={<NewAffiliate />} />
          <Route path="edit/:id" element={<EditAffiliate />} />
          <Route path="postback-test" element={<PostbackTest />} />
        </Route>
        <Route path="advertiser">
          <Route index element={<ManageAdvertiser />} />
          <Route path="manage" element={<ManageAdvertiser />} />
          <Route path="new" element={<NewAdvertiser />} />
          <Route path="edit/:id" element={<EditAdvertiser />} />
        </Route>
        <Route path="assignment">
          <Route index element={<ManageAssignment />} />
          <Route path="manage" element={<ManageAssignment />} />
          <Route path="new" element={<NewAssignment />} />
          <Route path="edit/:id" element={<EditAssignment />} />
        </Route>
        <Route path="reports">
          <Route index element={<DetailedReports />} />
          <Route path="detailed" element={<DetailedReports />} />
        </Route>
        <Route path="settings">
          <Route index element={<UpdateProfile />} />
          <Route path="profile" element={<UpdateProfile />} />
        </Route>
        <Route path="logs" element={<Logs />} />
        <Route path="import" element={<ImportData />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
