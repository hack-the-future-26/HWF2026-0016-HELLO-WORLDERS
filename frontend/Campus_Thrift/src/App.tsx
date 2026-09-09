import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SavedProductsProvider } from './context/SavedProductsContext';
import { AppShell } from './components/common/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';

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

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedProductsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppShell />}>
                {/* Public Routes (No authentication required) */}
                <Route index element={<MarketplacePage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="rides" element={<RidesPage />} />

                {/* Protected Routes (Authentication required) */}
                <Route
                  path="sell"
                  element={
                    <ProtectedRoute>
                      <SellPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="chat/:id"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="my-listings"
                  element={
                    <ProtectedRoute>
                      <MyListingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
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
