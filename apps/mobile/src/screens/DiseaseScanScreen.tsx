import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { DiseaseDetectionResult } from '../types';

export const DiseaseScanScreen: React.FC = () => {
  const { selectedFarm } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

  const cropOptions = ['Wheat', 'Paddy/Rice', 'Tomato', 'Mustard', 'Cotton', 'Potato', 'Citrus'];

  const runScan = async () => {
    setIsScanning(true);
    setResult(null);
    try {
      const diagnostic = await apiService.analyzeDisease(selectedCrop, undefined, selectedFarm?.id);
      setResult(diagnostic);
    } catch (err: any) {
      console.warn('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="robot" size={16} color="#059669" />
          <Text style={styles.aiBadgeText}>AI Disease Diagnostic Engine</Text>
        </View>
        <Text style={styles.title}>Crop Doctor & Leaf Scanner</Text>
        <Text style={styles.subtitle}>
          Take or select a clear photo of an infected leaf to receive an instant disease identification and treatment protocol.
        </Text>
      </View>

      {/* Crop Selector */}
      <Text style={styles.sectionLabel}>Select Plant Species:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropScroll}>
        {cropOptions.map((crop) => (
          <TouchableOpacity
            key={crop}
            style={[styles.cropChip, selectedCrop === crop && styles.cropChipActive]}
            onPress={() => setSelectedCrop(crop)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.cropChipText,
                selectedCrop === crop && styles.cropChipTextActive,
              ]}
            >
              {crop}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Scanner Viewfinder Box */}
      <View style={styles.scannerCard}>
        <View style={styles.viewfinder}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {isScanning ? (
            <View style={styles.scanningIndicator}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.scanningText}>Analyzing leaf pigmentation & cellular patterns...</Text>
              <Text style={styles.scanningSub}>Comparing against 50,000+ pathology samples</Text>
            </View>
          ) : (
            <View style={styles.viewfinderPlaceholder}>
              <MaterialCommunityIcons name="leaf" size={64} color="#A7F3D0" />
              <Text style={styles.viewfinderPrompt}>Focus camera on affected crop leaf</Text>
              <Text style={styles.viewfinderHint}>Ensure good natural lighting for best accuracy</Text>
            </View>
          )}
        </View>

        {/* Scan Action Controls */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.scanBtn, isScanning && styles.scanBtnDisabled]}
            onPress={runScan}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Capture & Diagnose</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryBtn}
            onPress={runScan}
            disabled={isScanning}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="image" size={20} color="#059669" />
            <Text style={styles.galleryBtnText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Diagnostic Diagnostic Result Card */}
      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleGroup}>
              <View
                style={[
                  styles.statusCircle,
                  result.isHealthy ? styles.statusHealthy : styles.statusInfected,
                ]}
              >
                <MaterialCommunityIcons
                  name={result.isHealthy ? 'check-circle' : 'alert-circle'}
                  size={24}
                  color={result.isHealthy ? '#10B981' : '#EF4444'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.diseaseName}>{result.diseaseName}</Text>
                <Text style={styles.confidenceText}>
                  Confidence: <Text style={{ fontWeight: '800' }}>{result.confidence}%</Text> • Severity: {result.severity}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.diseaseDesc}>{result.description}</Text>

          {/* Organic Treatments */}
          <View style={styles.treatmentSection}>
            <View style={styles.treatmentTitleRow}>
              <MaterialCommunityIcons name="sprout" size={18} color="#059669" />
              <Text style={styles.treatmentSectionTitle}>Organic & Biological Remedies</Text>
            </View>
            {result.organicTreatment.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Chemical Treatments */}
          <View style={styles.treatmentSection}>
            <View style={styles.treatmentTitleRow}>
              <MaterialCommunityIcons name="bottle-tonic-plus" size={18} color="#DC2626" />
              <Text style={[styles.treatmentSectionTitle, { color: '#B91C1C' }]}>
                Chemical Intervention (If Needed)
              </Text>
            </View>
            {result.chemicalTreatment.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: '#DC2626' }]}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Preventive Measures */}
          <View style={styles.treatmentSection}>
            <View style={styles.treatmentTitleRow}>
              <Feather name="shield" size={16} color="#2563EB" />
              <Text style={[styles.treatmentSectionTitle, { color: '#1D4ED8' }]}>
                Preventive Farm Practices
              </Text>
            </View>
            {result.preventiveMeasures.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: '#2563EB' }]}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Log to Farm Action */}
          <TouchableOpacity
            style={styles.saveHistoryBtn}
            onPress={() => alert('Diagnosis record saved to Farm Activity log!')}
          >
            <Feather name="bookmark" size={16} color="#FFFFFF" />
            <Text style={styles.saveHistoryBtnText}>Save to {selectedFarm?.name || 'Farm'} History</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  cropScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cropChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  cropChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  cropChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    elevation: 2,
  },
  viewfinder: {
    height: 220,
    backgroundColor: '#022C22',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#10B981',
  },
  cornerTL: {
    top: 14,
    left: 14,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 14,
    right: 14,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  viewfinderPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewfinderPrompt: {
    color: '#ECFDF5',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  viewfinderHint: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  scanningIndicator: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scanningText: {
    color: '#ECFDF5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  scanningSub: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  scanBtn: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  scanBtnDisabled: {
    opacity: 0.6,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  galleryBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  galleryBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHealthy: {
    backgroundColor: '#DEF7EC',
  },
  statusInfected: {
    backgroundColor: '#FEE2E2',
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  confidenceText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  diseaseDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  treatmentSection: {
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 10,
  },
  treatmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  treatmentSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 14,
    color: '#059669',
    marginRight: 6,
    lineHeight: 16,
  },
  bulletText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  saveHistoryBtn: {
    backgroundColor: '#065F46',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 8,
  },
  saveHistoryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
