import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { ErrorBoundary } from './core/errorBoundary/ErrorBoundary';
import { UserRole } from './types/auth.types';
import { createLazyComponent } from './core/performance/lazyLoader';
import ApiRouteHandler from './components/ApiRouteHandler';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Lazy load pages for code splitting
const LoginPage = createLazyComponent(() => import('./pages/auth/LoginPage'));
const AccessDeniedPage = createLazyComponent(() => import('./pages/auth/AccessDeniedPage'));
const LandingPage = createLazyComponent(() => import('./pages/public/LandingPage'));
const ContactUsPage = createLazyComponent(() => import('./pages/public/ContactUsPage'));
const UserManagementPage = createLazyComponent(() => import('./pages/admin/UserManagementPage'));
const ContactEnquiriesPage = createLazyComponent(() => import('./pages/admin/ContactEnquiriesPage'));
const PartnerManagementPage = createLazyComponent(() => import('./pages/admin/PartnerManagementPage'));
const DealerManagementPage = createLazyComponent(() => import('./pages/admin/DealerManagementPage'));
// FeedbackModerationPage and EnquiryManagementPage replaced by FeedbackPage and InquiriesPage
const UtilitiesManagementPage = createLazyComponent(() => import('./pages/admin/UtilitiesManagementPage'));
const CostConfigurationPage = createLazyComponent(() => import('./pages/admin/CostConfigurationPage'));
const NotificationSettingsPage = createLazyComponent(() => import('./pages/admin/NotificationSettingsPage'));
const NotificationLogsPage = createLazyComponent(() => import('./pages/admin/NotificationLogsPage'));
const EventManagementPage = createLazyComponent(() => import('./pages/admin/EventManagementPage'));
const ProductManagementPage = createLazyComponent(() => import('./pages/admin/ProductManagementPage'));
// CMSContentPage and AdminOffersPage replaced by CMSPage and OffersDiscountsPage
const ProjectsPage = createLazyComponent(() => import('./pages/admin/ProjectsPage'));
const TendersPage = createLazyComponent(() => import('./pages/admin/TendersPage'));
const SteelMarketPage = createLazyComponent(() => import('./pages/admin/SteelMarketPage'));
const TradingAdvicePage = createLazyComponent(() => import('./pages/admin/TradingAdvicePage'));
const LecturesPage = createLazyComponent(() => import('./pages/admin/LecturesPage'));
const EducationPostsPage = createLazyComponent(() => import('./pages/admin/EducationPostsPage'));
const QuizPage = createLazyComponent(() => import('./pages/admin/QuizPage'));
const ShortcutsPage = createLazyComponent(() => import('./pages/admin/ShortcutsPage'));
const VideosPage = createLazyComponent(() => import('./pages/admin/VideosPage'));
const DealershipApplicationsPage = createLazyComponent(() => import('./pages/admin/DealershipApplicationsPage'));
const AdminNotesPage = createLazyComponent(() => import('./pages/admin/AdminNotesPage'));
const LoyaltyPointsPage = createLazyComponent(() => import('./pages/admin/LoyaltyPointsPage'));
const ChecklistsPage = createLazyComponent(() => import('./pages/admin/ChecklistsPage'));
const InquiriesPage = createLazyComponent(() => import('./pages/admin/InquiriesPage'));
const FeedbackPage = createLazyComponent(() => import('./pages/admin/FeedbackPage'));
const CMSPage = createLazyComponent(() => import('./pages/admin/CMSPage'));
const OffersDiscountsPage = createLazyComponent(() => import('./pages/admin/OffersDiscountsPage'));
const PartnerBillingPage = createLazyComponent(() => import('./pages/partner/BillingPage'));
const DealerBillingPage = createLazyComponent(() => import('./pages/partner/BillingPage'));
const PartnerDashboardPage = createLazyComponent(() => import('./pages/partner/PartnerDashboardPage'));
const PartnerProfileEditorPage = createLazyComponent(() => import('./pages/partner/PartnerProfileEditorPage'));
const PartnerEnquiriesPage = createLazyComponent(() => import('./pages/partner/PartnerEnquiriesPage'));
const WorksManagementPage = createLazyComponent(() => import('./pages/partner/WorksManagementPage'));
const EventsPage = createLazyComponent(() => import('./pages/partner/EventsPage'));
const GalleryPage = createLazyComponent(() => import('./pages/partner/GalleryPage'));
const NotesPage = createLazyComponent(() => import('./pages/partner/NotesPage'));
const OffersPage = createLazyComponent(() => import('./pages/partner/OffersPage'));
const DealerDashboardPage = createLazyComponent(() => import('./pages/dealer/DealerDashboardPage'));
const DealerProfileEditorPage = createLazyComponent(() => import('./pages/dealer/DealerProfileEditorPage'));
const DealerEnquiriesPage = createLazyComponent(() => import('./pages/dealer/DealerEnquiriesPage'));
const ProductCataloguePage = createLazyComponent(() => import('./pages/dealer/ProductCataloguePage'));
const AdminDashboardPage = createLazyComponent(() => import('./pages/admin/AdminDashboardPage'));
const AnalyticsDashboardPage = createLazyComponent(() => import('./pages/admin/AnalyticsDashboardPage'));
const ReportsPage = createLazyComponent(() => import('./pages/admin/ReportsPage'));
const PartnerAnalyticsPage = createLazyComponent(() => import('./pages/partner/PartnerAnalyticsPage'));
const DealerAnalyticsPage = createLazyComponent(() => import('./pages/dealer/DealerAnalyticsPage'));
const DealerProductsPage = createLazyComponent(() => import('./pages/dealer/DealerProductsPage'));
const DealerFeedbacksPage = createLazyComponent(() => import('./pages/dealer/DealerFeedbacksPage'));
const DealerOffersPage = createLazyComponent(() => import('./pages/dealer/DealerOffersPage'));
const VastuPage = createLazyComponent(() => import('./pages/admin/VastuPage'));
const SettingsPage = createLazyComponent(() => import('./pages/settings/SettingsPage'));
const PrivacyPolicyPage = createLazyComponent(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsAndConditionsPage = createLazyComponent(() => import('./pages/legal/TermsAndConditionsPage'));
const RefundPolicyPage = createLazyComponent(() => import('./pages/legal/RefundPolicyPage'));

// Dashboard redirect based on user role
const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case UserRole.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case UserRole.PARTNER:
      return <Navigate to="/partner/dashboard" replace />;
    case UserRole.DEALER:
      return <Navigate to="/dealer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Auto-refresh tokens
  useTokenRefresh();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      {/* Suppress React Router warning for /api endpoint (backend API, not a frontend route) */}
      <Route path="/api" element={<ApiRouteHandler />} />
      <Route path="/api/*" element={<ApiRouteHandler />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      
      {/* Auth routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/access-denied"
        element={<AccessDeniedPage />}
      />
      <Route
        path="/dashboard"
        element={<DashboardRedirect />}
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AppLayout>
              <UserManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact-enquiries"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AppLayout>
              <ContactEnquiriesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={<AnalyticsDashboardPage />}
      />
      <Route
        path="/admin/reports"
        element={<ReportsPage />}
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminLayout title="Settings">
            <SettingsPage />
          </AdminLayout>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />}
      />
      <Route
        path="/admin/partners"
        element={<PartnerManagementPage />}
      />
      <Route
        path="/admin/dealers"
        element={<DealerManagementPage />}
      />
      <Route
        path="/admin/feedback"
        element={<FeedbackPage />}
      />
      <Route
        path="/admin/enquiries"
        element={<InquiriesPage />}
      />
      <Route
        path="/admin/utilities"
        element={<UtilitiesManagementPage />}
      />
      <Route
        path="/admin/cost-configuration"
        element={<CostConfigurationPage />}
      />
      <Route
        path="/admin/notification-settings"
        element={<NotificationSettingsPage />}
      />
      <Route
        path="/admin/notification-logs"
        element={<NotificationLogsPage />}
      />
      <Route
        path="/admin/users"
        element={<UserManagementPage />}
      />
      <Route
        path="/admin/products"
        element={<ProductManagementPage />}
      />
      <Route
        path="/admin/events"
        element={<EventManagementPage />}
      />
      <Route
        path="/admin/cms"
        element={<CMSPage />}
      />
      <Route
        path="/admin/offers"
        element={<OffersDiscountsPage />}
      />
      <Route
        path="/admin/partner-works"
        element={<WorksManagementPage />}
      />
      <Route
        path="/admin/projects"
        element={<ProjectsPage />}
      />
      <Route
        path="/admin/tenders"
        element={<TendersPage />}
      />
      <Route
        path="/admin/steel-market"
        element={<SteelMarketPage />}
      />
      <Route
        path="/admin/trading-advice"
        element={<TradingAdvicePage />}
      />
      <Route
        path="/admin/lectures"
        element={<LecturesPage />}
      />
      <Route
        path="/admin/education-posts"
        element={<EducationPostsPage />}
      />
      <Route
        path="/admin/quiz"
        element={<QuizPage />}
      />
      <Route
        path="/admin/shortcuts"
        element={<ShortcutsPage />}
      />
      <Route
        path="/admin/videos"
        element={<VideosPage />}
      />
      <Route
        path="/admin/dealership-applications"
        element={<DealershipApplicationsPage />}
      />
      <Route
        path="/admin/notes"
        element={<AdminNotesPage />}
      />
      <Route
        path="/admin/loyalty-points"
        element={<LoyaltyPointsPage />}
      />
      <Route
        path="/admin/checklists"
        element={<ChecklistsPage />}
      />
      <Route
        path="/admin/vastu"
        element={<VastuPage />}
      />
      {/* Partner Routes */}
      <Route
        path="/partner/dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
            <AppLayout>
              <PartnerDashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner/profile"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
            <AppLayout>
              <PartnerProfileEditorPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner/enquiries"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
            <AppLayout>
              <PartnerEnquiriesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner/analytics"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
            <AppLayout>
              <PartnerAnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner/billing"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
            <AppLayout>
              <PartnerBillingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* Dealer Routes */}
      <Route
        path="/dealer/dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerDashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/profile"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerProfileEditorPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/enquiries"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerEnquiriesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/works"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <WorksManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/events"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <EventsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/gallery"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <GalleryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/notes"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <NotesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/offers"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <OffersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/products"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerProductsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/feedbacks"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerFeedbacksPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/offers"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerOffersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/product-catalogue"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <ProductCataloguePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/analytics"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerAnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dealer/billing"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
            <AppLayout>
              <DealerBillingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* Catch-all route for 404 - redirects unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;



