import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import BookingPage from '@/pages/BookingPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import HelpPage from '@/pages/HelpPage.jsx';
import DriversPage from '@/pages/DriversPage.jsx';
import DriverResourcesPage from '@/pages/DriverResourcesPage.jsx';
import AuthProvider from '@/contexts/AuthContext.jsx';
import { LocaleProvider } from '@/contexts/LocaleContext.jsx';
import { BookingProvider } from '@/contexts/BookingContext.jsx';
import BookingConfirmedPage from '@/pages/BookingConfirmedPage.jsx';
import DriverLoginPage from '@/pages/DriverLoginPage.jsx';
import DriverPendingApprovalPage from '@/pages/DriverPendingApprovalPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';
import AdminRoute from '@/components/admin/AdminRoute.jsx';
import AdminDriverDetailPage from '@/pages/AdminDriverDetailPage.jsx';
import DriverLayout from '@/components/driver/DriverLayout.jsx';
import DriverRoute from '@/components/driver/DriverRoute.jsx';
import DriverDashboardIndexPage from '@/pages/driver/DriverDashboardIndexPage.jsx';
import DriverProfilePage from '@/pages/driver/DriverProfilePage.jsx';
import DriverHistoryPage from '@/pages/driver/DriverHistoryPage.jsx';
import DriverEarningsPage from '@/pages/driver/DriverEarningsPage.jsx';
import DriverDocumentsPage from '@/pages/driver/DriverDocumentsPage.jsx';
import RideTrackingPage from '@/pages/RideTrackingPage.jsx';
import DriverSettingsPage from '@/pages/driver/DriverSettingsPage.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AdminGuidePage from '@/pages/AdminGuidePage.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LocaleProvider>
        <AuthProvider>
          <BookingProvider>
            <Routes>
              <Route path="/track/:bookingId" element={<RideTrackingPage />} />

              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/driver-login" element={<DriverLoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin-guide" element={<AdminGuidePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmedPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/drivers" element={<DriversPage />} />
                <Route path="/driver-resources" element={<DriverResourcesPage />} />
                <Route path="/driver-pending-approval" element={<DriverPendingApprovalPage />} />
              </Route>

              <Route path="/driver" element={<DriverRoute><DriverLayout /></DriverRoute>}>
                <Route index element={<DriverDashboardIndexPage />} />
                <Route path="dashboard" element={<DriverDashboardIndexPage />} />
                <Route path="profile" element={<DriverProfilePage />} />
                <Route path="history" element={<DriverHistoryPage />} />
                <Route path="earnings" element={<DriverEarningsPage />} />
                <Route path="documents" element={<DriverDocumentsPage />} />
                <Route path="settings" element={<DriverSettingsPage />} />
              </Route>

              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              <Route path="/admin/driver/:driverId" element={<AdminRoute><AdminDriverDetailPage /></AdminRoute>} />
              
              <Route path="/driver-dashboard" element={<DriverRoute><DriverLayout><DriverDashboardIndexPage /></DriverLayout></DriverRoute>} />
            </Routes>
            <Toaster />
          </BookingProvider>
        </AuthProvider>
      </LocaleProvider>
    </Router>
  );
}

export default App;