/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Player from './pages/Player';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import About from './pages/About';
import Admin from './pages/Admin';
import CategoryPage from './pages/CategoryPage';
import SplashAndRegister from './components/SplashAndRegister';
import ProfileEdit from './pages/ProfileEdit';

function CapacitorHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backListener: any = null;

    const initCapacitor = async () => {
      try {
        // Handle Android Back Button
        if (CapApp && typeof CapApp.addListener === 'function') {
          backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
            if (location.pathname === '/') {
              CapApp.exitApp();
            } else {
              navigate(-1);
            }
          });
        }

        // Configure Status Bar
        if (StatusBar && typeof StatusBar.setOverlaysWebView === 'function') {
          await StatusBar.setOverlaysWebView({ overlay: true });
          if (mode === 'dark') {
            await StatusBar.setStyle({ style: Style.Dark });
          } else {
            await StatusBar.setStyle({ style: Style.Light });
          }
        }
      } catch (e) {
        console.warn('Capacitor plugins failed', e);
      }
    };

    initCapacitor();

    return () => {
      if (backListener) {
        backListener.remove();
      }
    };
  }, [navigate, location, mode]);

  return null;
}

function AppContent() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return <SplashAndRegister onComplete={() => setIsReady(true)} />;
  }

  return (
    <BrowserRouter>
      <CapacitorHandler />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="player" element={<Player />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<Admin />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="profile-edit" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </ThemeProvider>
  );
}
