import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { user, selectedFarm, farms, setSelectedFarm } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.branding}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="sprout" size={24} color="#10B981" />
          </View>
          <View>
            <Text style={styles.title}>AgriBandhu 2.0</Text>
            <Text style={styles.subtitle}>Smart Agriculture Platform</Text>
          </View>
        </View>

        <View style={styles.weatherWidget}>
          <Ionicons name="sunny" size={16} color="#F59E0B" />
          <Text style={styles.weatherTemp}>29°C</Text>
          <Text style={styles.weatherDesc}>Ludhiana</Text>
        </View>
      </View>

      {/* Selected Farm Selector Chip */}
      {selectedFarm && (
        <View style={styles.farmSelectorRow}>
          <MaterialCommunityIcons name="map-marker-radius" size={16} color="#059669" />
          <Text style={styles.farmSelectorLabel}>Active Farm:</Text>
          <TouchableOpacity
            style={styles.farmPill}
            onPress={() => {
              // Toggle between available farms
              const nextIndex = (farms.findIndex((f) => f.id === selectedFarm.id) + 1) % farms.length;
              setSelectedFarm(farms[nextIndex]);
            }}
          >
            <Text style={styles.farmPillText} numberOfLines={1}>
              {selectedFarm.name} ({selectedFarm.area} {selectedFarm.unit})
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={14} color="#065F46" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#064E3B',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#022C22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ECFDF5',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '500',
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 95, 70, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#059669',
  },
  weatherTemp: {
    color: '#FDE68A',
    fontWeight: '700',
    fontSize: 13,
  },
  weatherDesc: {
    color: '#D1FAE5',
    fontSize: 11,
  },
  farmSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 44, 34, 0.6)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  farmSelectorLabel: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  farmPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#A7F3D0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  farmPillText: {
    color: '#064E3B',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
});
