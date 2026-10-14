import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { TabBar, TabType } from './src/components/TabBar';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FarmsScreen } from './src/screens/FarmsScreen';
import { DiseaseScanScreen } from './src/screens/DiseaseScanScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const MainNavigator: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" backgroundColor="#064E3B" />
        <AuthScreen />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentTab} />;
      case 'farms':
        return <FarmsScreen />;
      case 'scan':
        return <DiseaseScanScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={setCurrentTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#064E3B" />
      <Header />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <TabBar currentTab={currentTab} onSelectTab={setCurrentTab} />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#064E3B',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
