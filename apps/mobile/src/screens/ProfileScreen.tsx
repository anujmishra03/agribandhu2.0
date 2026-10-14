import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';

export const ProfileScreen: React.FC = () => {
  const { user, farms, language, setLanguage, logout } = useApp();
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [isSaved, setIsSaved] = useState(false);

  const totalAcres = farms.reduce((acc, f) => acc + (f.area || 0), 0);

  const handleSaveApiUrl = () => {
    setApiBaseUrl(apiUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Kisan Digital Identity Card */}
      <View style={styles.kisanIdCard}>
        <View style={styles.kisanHeader}>
          <View style={styles.emblemBadge}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#059669" />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.kisanCardTitle}>AgriBandhu Digital Farmer ID</Text>
            <Text style={styles.kisanCardSub}>Verified Agricultural Producer</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.kisanBody}>
          <View style={styles.avatarCircle}>
            <FontAwesome5 name="user-tie" size={32} color="#065F46" />
          </View>
          <View style={styles.kisanDetails}>
            <Text style={styles.farmerName}>{user.name}</Text>
            <Text style={styles.farmerPhone}>{user.phone}</Text>
            <Text style={styles.farmerLocation}>
              {user.village}, {user.district}, {user.state}
            </Text>
            <Text style={styles.kisanNumber}>ID: AGRI-2026-PB-9812</Text>
          </View>
        </View>
      </View>

      {/* Farm Holdings Overview */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{farms.length}</Text>
          <Text style={styles.statLabel}>Total Plots</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{totalAcres.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total Acres</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#059669' }]}>A+</Text>
          <Text style={styles.statLabel}>Soil Health</Text>
        </View>
      </View>

      {/* Language Preferences */}
      <Text style={styles.sectionTitle}>Preferred Language</Text>
      <View style={styles.langRow}>
        {[
          { key: 'en', label: 'English' },
          { key: 'hi', label: 'हिन्दी (Hindi)' },
          { key: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.langChip, language === item.key && styles.langChipActive]}
            onPress={() => setLanguage(item.key as any)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.langChipText,
                language === item.key && styles.langChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Backend API Configuration */}
      <Text style={styles.sectionTitle}>Backend API Connection</Text>
      <View style={styles.apiConfigCard}>
        <Text style={styles.apiPrompt}>
          Configure Express REST API endpoint for local testing or physical phone connection:
        </Text>
        <TextInput
          style={styles.apiInput}
          value={apiUrl}
          onChangeText={setApiUrl}
          autoCapitalize="none"
          placeholder="http://192.168.1.51:5000/api"
          placeholderTextColor="#94A3B8"
        />
        <View style={styles.apiPresetRow}>
          <TouchableOpacity
            style={[styles.presetPill, { backgroundColor: '#D1FAE5' }]}
            onPress={() => setApiUrl('https://agribandhu-api.vercel.app/api')}
          >
            <Text style={[styles.presetText, { color: '#065F46', fontWeight: '700' }]}>☁️ Live Vercel API</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetPill}
            onPress={() => setApiUrl('http://localhost:5000/api')}
          >
            <Text style={styles.presetText}>localhost:5000</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetPill}
            onPress={() => setApiUrl('http://10.0.2.2:5000/api')}
          >
            <Text style={styles.presetText}>Android (10.0.2.2)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveApiBtn} onPress={handleSaveApiUrl}>
          <Text style={styles.saveApiBtnText}>
            {isSaved ? '✓ Connected & Saved!' : 'Save Connection'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={18} color="#DC2626" />
        <Text style={styles.logoutBtnText}>Sign Out from Account</Text>
      </TouchableOpacity>

      {/* App & System Version info */}
      <View style={styles.versionCard}>
        <Text style={styles.versionTitle}>AgriBandhu Mobile v1.0.0</Text>
        <Text style={styles.versionDesc}>
          Antigravity Monorepo Edition • React Native 0.86 & Expo 57
        </Text>
        <Text style={styles.versionDesc}>Integrated with AgriBandhu Express REST API</Text>
      </View>
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
  kisanIdCard: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#059669',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
  },
  kisanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    paddingBottom: 10,
    marginBottom: 14,
  },
  emblemBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kisanCardTitle: {
    color: '#ECFDF5',
    fontSize: 13,
    fontWeight: '800',
  },
  kisanCardSub: {
    color: '#A7F3D0',
    fontSize: 10,
  },
  verifiedTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  kisanBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kisanDetails: {
    flex: 1,
  },
  farmerName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  farmerPhone: {
    color: '#D1FAE5',
    fontSize: 12,
    marginTop: 2,
  },
  farmerLocation: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 2,
  },
  kisanNumber: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  langChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  langChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  langChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  apiConfigCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  apiPrompt: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  apiInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  apiPresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  presetPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  presetText: {
    fontSize: 11,
    color: '#475569',
  },
  saveApiBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveApiBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  versionCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  versionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
});
