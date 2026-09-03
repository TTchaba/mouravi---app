import React, { useState, useEffect } from 'react';
import App from './App';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdminAuthGuard from './components/AdminAuthGuard';
import { auth } from './utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * AnalyticsRouter Component
 * Routes between main Mouravi app and admin analytics dashboard
 * Handles navigation based on URL path
 */
export default function AnalyticsRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Set up Firebase auth listener
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle navigation
  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Render analytics dashboard
  if (currentPath.startsWith('/admin/analytics')) {
    return (
      <AdminAuthGuard>
        <AnalyticsDashboard />
      </AdminAuthGuard>
    );
  }

  // Render main app
  return <App onNavigateToAnalytics={() => navigateTo('/admin/analytics')} />;
}
