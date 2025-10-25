import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import UserLayout from './layouts/UserLayout';
import Register from './views/Register';
import ProtectedRoute from './ProtectedRoute';
import OAuthCallback from './views/OAuthCallback';

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const loadCSS = async () => {
      if (location.pathname === '/register') {
        await import('./assets/clients/css/register.css');
      } else if (location.pathname.startsWith('/user')) {
        await import('./assets/clients/css/bootstrap.min.css');
        await import('./assets/clients/css/owl.carousel.min.css');
        await import('./assets/clients/css/ticker-style.css');
        await import('./assets/clients/css/flaticon.css');
        await import('./assets/clients/css/slicknav.css');
        await import('./assets/clients/css/animate.min.css');
        await import('./assets/clients/css/magnific-popup.css');
        await import('./assets/clients/css/fontawesome-all.min.css');
        await import('./assets/clients/css/themify-icons.css');
        await import('./assets/clients/css/slick.css');
        await import('./assets/clients/css/nice-select.css');
        await import('./assets/clients/css/style.css');
      }
    };

    loadCSS();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/register" element={<Register key={location.key} />} />
      
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      {/* Protected Routes */}
      {UserRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.layout + route.path}
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserLayout>
                <route.component />
              </UserLayout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* Fallback to /register */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default AppRoutes;
