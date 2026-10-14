import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const CalendarScreen: React.FC = () => {
  const { events, selectedFarm, completeEvent, generateAISchedule, isLoading } = useApp();
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');

  const filteredEvents = events.filter((e) => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'IRRIGATION':
        return { name: 'water', color: '#2563EB' };
      case 'FERTILIZER':
        return { name: 'flask', color: '#7C3AED' };
      case 'HARVEST':
        return { name: 'barley', color: '#D97706' };
      case 'AI_RECOMMENDATION':
        return { name: 'robot', color: '#059669' };
      case 'PESTICIDE':
        return { name: 'shield-alert', color: '#DC2626' };
      default:
        return { name: 'calendar-check', color: '#475569' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header & AI Schedule Generator Button */}
      <View style={styles.headerBox}>
        <View>
          <Text style={styles.title}>Crop Activity Calendar</Text>
          <Text style={styles.subtitle}>
            {selectedFarm?.name || 'Farm'} schedule & growth timings
          </Text>
        </View>

        <TouchableOpacity
          style={styles.aiGenBtn}
          onPress={() => selectedFarm && generateAISchedule(selectedFarm.id)}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="auto-fix" size={16} color="#FFFFFF" />
              <Text style={styles.aiGenBtnText}>AI Schedule</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['All', 'Today', 'Upcoming', 'Completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, filter === tab && styles.filterChipActive]}
            onPress={() => setFilter(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === tab && styles.filterChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events Timeline */}
      {filteredEvents.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name="calendar-blank" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No activities scheduled</Text>
          <Text style={styles.emptySub}>
            Tap "AI Schedule" to automatically generate recommendations based on your crop growth stage!
          </Text>
        </View>
      ) : (
        filteredEvents.map((event) => {
          const iconInfo = getEventIcon(event.eventType);
          const isDone = event.status === 'Completed';

          return (
            <View key={event.id} style={[styles.eventCard, isDone && styles.eventCardDone]}>
              <View style={styles.eventCardLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${iconInfo.color}15` }]}>
                  <MaterialCommunityIcons
                    name={iconInfo.name as any}
                    size={22}
                    color={iconInfo.color}
                  />
                </View>
              </View>

              <View style={styles.eventCardRight}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.eventTitle, isDone && styles.eventTitleDone]}>
                    {event.title}
                  </Text>
                  <TouchableOpacity
                    style={[styles.statusToggle, isDone && styles.statusToggleDone]}
                    onPress={() => completeEvent(event.id)}
                  >
                    <Feather
                      name={isDone ? 'check-circle' : 'circle'}
                      size={16}
                      color={isDone ? '#10B981' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                </View>

                {event.description && (
                  <Text style={styles.eventDesc}>{event.description}</Text>
                )}

                <View style={styles.cardMetaRow}>
                  <View style={styles.dateGroup}>
                    <Feather name="calendar" size={12} color="#64748B" />
                    <Text style={styles.metaDateText}>
                      {event.startDate} • {event.startTime || '08:00 AM'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.priorityBadge,
                      event.priority === 'Critical' && styles.priorityCrit,
                      event.priority === 'High' && styles.priorityHigh,
                    ]}
                  >
                    <Text style={styles.priorityBadgeText}>{event.priority}</Text>
                  </View>
                </View>

                {event.notes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>Note: {event.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
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
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  aiGenBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  aiGenBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  eventCardDone: {
    opacity: 0.65,
    backgroundColor: '#F1F5F9',
  },
  eventCardLeft: {
    marginRight: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCardRight: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  eventTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  statusToggle: {
    padding: 2,
  },
  statusToggleDone: {
    //
  },
  eventDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  priorityBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityCrit: {
    backgroundColor: '#FEE2E2',
  },
  priorityHigh: {
    backgroundColor: '#FFEDD5',
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  notesBox: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  notesText: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
  },
});
