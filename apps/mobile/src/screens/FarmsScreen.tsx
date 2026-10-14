import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Farm } from '../types';

export const FarmsScreen: React.FC = () => {
  const { farms, selectedFarm, setSelectedFarm, addFarm } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [farmType, setFarmType] = useState('Grains & Cereals');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [stateName, setStateName] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [village, setVillage] = useState('');
  const [cropName, setCropName] = useState('');
  const [soilType, setSoilType] = useState('Loamy Alluvial');

  const handleAddFarm = async () => {
    if (!name.trim()) {
      alert('Please enter a farm name.');
      return;
    }
    await addFarm({
      name,
      farmType,
      area: parseFloat(area) || 2.5,
      unit,
      state: stateName,
      district,
      village: village || 'Local Block',
      address: `${village}, ${district}`,
      crop: cropName
        ? {
            id: `crop-${Date.now()}`,
            farmId: '',
            name: cropName,
            variety: 'Standard High-Yield',
            growthStage: 'Vegetative Phase',
          }
        : null,
      soil: {
        id: `soil-${Date.now()}`,
        farmId: '',
        soilType,
        ph: 7.0,
      },
    });

    // Reset form
    setName('');
    setArea('');
    setVillage('');
    setCropName('');
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>My Agricultural Lands</Text>
          <Text style={styles.subtitle}>Manage plots, crop varieties & soil records</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Farm</Text>
        </TouchableOpacity>
      </View>

      {/* Farm Cards */}
      {farms.map((farm) => {
        const isSelected = selectedFarm?.id === farm.id;
        return (
          <TouchableOpacity
            key={farm.id}
            style={[styles.farmCard, isSelected && styles.farmCardActive]}
            onPress={() => setSelectedFarm(farm)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <View style={styles.farmTitleRow}>
                <View style={[styles.farmIcon, isSelected && styles.farmIconActive]}>
                  <MaterialCommunityIcons
                    name="terrain"
                    size={22}
                    color={isSelected ? '#FFFFFF' : '#059669'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.farmName}>{farm.name}</Text>
                  <Text style={styles.farmType}>{farm.farmType}</Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>ACTIVE</Text>
                </View>
              )}
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="ruler-square" size={16} color="#64748B" />
                <Text style={styles.detailText}>
                  {farm.area} {farm.unit}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {farm.village}, {farm.district}
                </Text>
              </View>
            </View>

            {farm.crop && (
              <View style={styles.cropInfoBox}>
                <View style={styles.cropBadge}>
                  <MaterialCommunityIcons name="sprout" size={16} color="#059669" />
                  <Text style={styles.cropBadgeText}>{farm.crop.name}</Text>
                </View>
                <Text style={styles.cropStageBadge}>
                  {farm.crop.growthStage || 'Vegetative Stage'}
                </Text>
              </View>
            )}

            {farm.soil && (
              <View style={styles.soilStatsRow}>
                <Text style={styles.soilStatText}>Soil: {farm.soil.soilType || 'Alluvial'}</Text>
                <Text style={styles.soilStatText}>pH: {farm.soil.ph ?? '7.0'}</Text>
                <Text style={styles.soilStatText}>
                  Nitrogen: {farm.soil.nitrogen ? `${farm.soil.nitrogen} kg/ha` : 'Optimal'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Add Farm Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Farm Plot</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Farm Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ganga Canal Wheat Field"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#94A3B8"
              />

              <View style={styles.inputSplitRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Area Size *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 3.5"
                    keyboardType="numeric"
                    value={area}
                    onChangeText={setArea}
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.unitToggle}>
                    <TouchableOpacity
                      style={[styles.unitBtn, unit === 'Acres' && styles.unitBtnActive]}
                      onPress={() => setUnit('Acres')}
                    >
                      <Text
                        style={[
                          styles.unitBtnText,
                          unit === 'Acres' && styles.unitBtnTextActive,
                        ]}
                      >
                        Acres
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.unitBtn, unit === 'Hectares' && styles.unitBtnActive]}
                      onPress={() => setUnit('Hectares')}
                    >
                      <Text
                        style={[
                          styles.unitBtnText,
                          unit === 'Hectares' && styles.unitBtnTextActive,
                        ]}
                      >
                        Hectares
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={styles.inputLabel}>Village / Area *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sahnewal"
                value={village}
                onChangeText={setVillage}
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Primary Crop (Current Season)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sharbati Wheat, Basmati Rice"
                value={cropName}
                onChangeText={setCropName}
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Soil Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Clay Loam, Black Cotton, Sandy Loam"
                value={soilType}
                onChangeText={setSoilType}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddFarm}>
                <Text style={styles.saveBtnText}>Save Farm Record</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerRow: {
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  farmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  farmCardActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  farmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  farmIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmIconActive: {
    backgroundColor: '#059669',
  },
  farmName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  farmType: {
    fontSize: 11,
    color: '#64748B',
  },
  activePill: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  cropInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cropBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  cropStageBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  soilStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  soilStatText: {
    fontSize: 11,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  inputSplitRow: {
    flexDirection: 'row',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
    height: 42,
  },
  unitBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitBtnActive: {
    backgroundColor: '#059669',
  },
  unitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
