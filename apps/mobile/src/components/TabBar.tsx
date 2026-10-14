import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export type TabType = 'home' | 'farms' | 'scan' | 'calendar' | 'profile';

interface TabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('home')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="view-dashboard"
          size={24}
          color={currentTab === 'home' ? '#059669' : '#64748B'}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Farms Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('farms')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="tractor"
          size={24}
          color={currentTab === 'farms' ? '#059669' : '#64748B'}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'farms' && styles.tabLabelActive]}
        >
          Farms
        </Text>
      </TouchableOpacity>

      {/* Center AI Doctor Scan Button */}
      <TouchableOpacity
        style={styles.centerFabContainer}
        onPress={() => onSelectTab('scan')}
        activeOpacity={0.85}
      >
        <View style={styles.centerFab}>
          <MaterialCommunityIcons name="line-scan" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.centerFabLabel}>AI Doctor</Text>
      </TouchableOpacity>

      {/* Calendar Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('calendar')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="calendar-clock"
          size={24}
          color={currentTab === 'calendar' ? '#059669' : '#64748B'}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'calendar' && styles.tabLabelActive]}
        >
          Calendar
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('profile')}
        activeOpacity={0.7}
      >
        <FontAwesome5
          name="user-alt"
          size={20}
          color={currentTab === 'profile' ? '#059669' : '#64748B'}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'profile' && styles.tabLabelActive]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#059669',
    fontWeight: '700',
  },
  centerFabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
    width: 68,
  },
  centerFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  centerFabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
});
