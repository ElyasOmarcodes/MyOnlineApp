/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';
import { View, Text, useColorScheme } from 'react-native';

// Actual components
import Home from './pages/Home';
import Player from './pages/Player';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import About from './pages/About';

// Placeholder components for screens
import Admin from './pages/Admin';
import AdminPosts from './pages/AdminPosts';
import AdminCategories from './pages/AdminCategories';
import AdminTopPosts from './pages/AdminTopPosts';
import CategoryPage from './pages/CategoryPage';
import ProfileEdit from './pages/ProfileEdit';
import Comments from './pages/Comments';
import SplashAndRegister from './components/SplashAndRegister';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator id="MainTabs" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();

  if (!isReady) {
    return <SplashAndRegister onComplete={() => setIsReady(true)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Player" component={Player} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="AdminPosts" component={AdminPosts} />
        <Stack.Screen name="AdminCategories" component={AdminCategories} />
        <Stack.Screen name="AdminTopPosts" component={AdminTopPosts} />
        <Stack.Screen name="Category" component={CategoryPage} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="Comments" component={Comments} />
      </Stack.Navigator>
    </NavigationContainer>
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
