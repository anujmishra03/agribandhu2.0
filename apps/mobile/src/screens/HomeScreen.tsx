import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onNavigate: (tab: 'home' | 'farms' | 'scan' | 'calendar' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user, selectedFarm, events, isLoading, refreshData, completeEvent } = useApp();

  const todayEvents = events.filter((e) => e.status === 'Today' || e.status === 'Upcoming');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} colors={['#059669']} />}
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.greeting}>Namaste, {user.name} 🌾</Text>
          <Text style={styles.greetingSub}>
            {selectedFarm ? `${selectedFarm.village}, ${selectedFarm.district}` : 'Field Overview'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.aiAdvisoryBtn}
          onPress={() => onNavigate('scan')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="robot" size={18} color="#059669" />
          <Text style={styles.aiAdvisoryBtnText}>AI Health</Text>
        </TouchableOpacity>
      </View>

      {/* Weather & Microclimate Metrics */}
      <View style={styles.weatherMetricsCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.cardHeaderTitle}>Field Microclimate & Sensors</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#F59E0B" />
            <Text style={styles.metricValue}>29°C</Text>
            <Text style={styles.metricLabel}>Temp (Optimal)</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="water-percent" size={24} color="#3B82F6" />
            <Text style={styles.metricValue}>68%</Text>
            <Text style={styles.metricLabel}>Soil Moisture</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="weather-windy" size={24} color="#10B981" />
            <Text style={styles.metricValue}>12 km/h</Text>
            <Text style={styles.metricLabel}>NW Wind</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="white-balance-sunny" size={24} color="#EC4899" />
            <Text style={styles.metricValue}>6.4</Text>
            <Text style={styles.metricLabel}>UV Index</Text>
          </View>
        </View>
      </View>

      {/* Quick Action Matrix */}
      <Text style={styles.sectionTitle}>Quick Farm Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#ECFDF5' }]}
          onPress={() => onNavigate('scan')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#10B981' }]}>
            <MaterialCommunityIcons name="leaf-circle" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Scan Leaf</Text>
          <Text style={styles.actionDesc}>Detect disease in 5s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#EFF6FF' }]}
          onPress={() => onNavigate('calendar')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#3B82F6' }]}>
            <MaterialCommunityIcons name="calendar-plus" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Smart Schedule</Text>
          <Text style={styles.actionDesc}>AI task reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FEF3C7' }]}
          onPress={() => onNavigate('farms')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#F59E0B' }]}>
            <MaterialCommunityIcons name="sprout" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Crop Status</Text>
          <Text style={styles.actionDesc}>Stage & soil records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#F3E8FF' }]}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#8B5CF6' }]}>
            <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Farmer Profile</Text>
          <Text style={styles.actionDesc}>Kisan ID & settings</Text>
        </TouchableOpacity>
      </View>

      {/* Active Crop Health Status Card */}
      {selectedFarm?.crop && (
        <View style={styles.cropStatusCard}>
          <View style={styles.cropStatusHeader}>
            <View>
              <Text style={styles.cropNameText}>{selectedFarm.crop.name}</Text>
              <Text style={styles.cropVarietyText}>Variety: {selectedFarm.crop.variety || 'Certified High-Yield'}</Text>
            </View>
            <View style={styles.stagePill}>
              <Text style={styles.stagePillText}>{selectedFarm.crop.growthStage || 'Vegetative'}</Text>
            </View>
          </View>

          <View style={styles.growthProgressContainer}>
            <View style={styles.growthProgressBar}>
              <View style={[styles.growthProgressFill, { width: '65%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressDateText}>Sown: {selectedFarm.crop.sowingDate || 'Nov 2026'}</Text>
              <Text style={styles.progressPercentText}>Day 48 / 120 (65%)</Text>
              <Text style={styles.progressDateText}>Harvest: {selectedFarm.crop.expectedHarvest || 'Apr 2027'}</Text>
            </View>
          </View>

          <View style={styles.soilPillRow}>
            <View style={styles.soilMetricTag}>
              <Text style={styles.soilMetricLabel}>Soil pH</Text>
              <Text style={styles.soilMetricVal}>{selectedFarm.soil?.ph ?? '7.1'}</Text>
            </View>
            <View style={styles.soilMetricTag}>
              <Text style={styles.soilMetricLabel}>Nitrogen (N)</Text>
              <Text style={styles.soilMetricVal}>{selectedFarm.soil?.nitrogen ?? '280'} kg/ha</Text>
            </View>
            <View style={styles.soilMetricTag}>
              <Text style={styles.soilMetricLabel}>Phosphorus (P)</Text>
              <Text style={styles.soilMetricVal}>{selectedFarm.soil?.phosphorus ?? '24'} kg/ha</Text>
            </View>
          </View>
        </View>
      )}

      {/* Upcoming / Today Field Schedule */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Field Schedule & Alerts</Text>
        <TouchableOpacity onPress={() => onNavigate('calendar')}>
          <Text style={styles.viewAllText}>View All ({events.length})</Text>
        </TouchableOpacity>
      </View>

      {todayEvents.map((event) => (
        <View key={event.id} style={styles.eventItemCard}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              event.status === 'Completed' && styles.checkboxCompleted,
            ]}
            onPress={() => completeEvent(event.id)}
          >
            {event.status === 'Completed' && <Feather name="check" size={14} color="#FFFFFF" />}
          </TouchableOpacity>

          <View style={styles.eventItemBody}>
            <View style={styles.eventItemTop}>
              <Text
                style={[
                  styles.eventTitle,
                  event.status === 'Completed' && styles.eventTitleCompleted,
                ]}
              >
                {event.title}
              </Text>
              <View
                style={[
                  styles.priorityTag,
                  event.priority === 'Critical' && styles.priorityCritical,
                  event.priority === 'High' && styles.priorityHigh,
                ]}
              >
                <Text style={styles.priorityTagText}>{event.priority}</Text>
              </View>
            </View>

            {event.description ? (
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
            ) : null}

            <View style={styles.eventFooter}>
              <View style={styles.eventTimeGroup}>
                <Feather name="clock" size={12} color="#64748B" />
                <Text style={styles.eventTimeText}>
                  {event.startDate} • {event.startTime || '08:00'}
                </Text>
              </View>
              <View style={styles.eventTypeTag}>
                <Text style={styles.eventTypeText}>{event.eventType}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeTextGroup: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  greetingSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  aiAdvisoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  aiAdvisoryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  weatherMetricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  actionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cropStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  cropStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  cropVarietyText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stagePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stagePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  growthProgressContainer: {
    marginVertical: 8,
  },
  growthProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  growthProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressDateText: {
    fontSize: 10,
    color: '#64748B',
  },
  progressPercentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  soilPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  soilMetricTag: {
    alignItems: 'center',
  },
  soilMetricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  soilMetricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  eventItemBody: {
    flex: 1,
  },
  eventItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  eventTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  priorityTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityCritical: {
    backgroundColor: '#FEE2E2',
  },
  priorityHigh: {
    backgroundColor: '#FFEDD5',
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  eventDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  eventTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  eventTypeTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
});
