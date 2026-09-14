import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SavedProductsProvider } from './context/SavedProductsContext';
import { AppShell } from './components/common/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages
import { MarketplacePage } from './pages/MarketplacePage';
import { AuthPage } from './pages/AuthPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SellPage } from './pages/SellPage';
import { ChatPage } from './pages/ChatPage';
import { RidesPage } from './pages/RidesPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Redirect to /auth if the user is not logged in when visiting the home page. */
const HomeGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MarketplacePage /> : <Navigate to="/auth" replace />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedProductsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppShell />}>
                {/* Home — redirect to /auth if not logged in */}
                <Route index element={<HomeGuard />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="rides" element={<RidesPage />} />

                {/* Protected Routes */}
                <Route path="sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
                <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
                <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SavedProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
