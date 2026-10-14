import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { login, register, isLoading } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Login inputs
  const [email, setEmail] = useState('farmer@agribandhu.org');
  const [password, setPassword] = useState('Farmer@1234');

  // Register inputs
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [village, setVillage] = useState('Sahnewal');
  const [district, setDistrict] = useState('Ludhiana');
  const [state, setState] = useState('Punjab');
  const [farmSize, setFarmSize] = useState('5.0');
  const [primaryCrop, setPrimaryCrop] = useState('Wheat');

  const handleLogin = async (overrideEmail?: string, overridePass?: string) => {
    setErrorMessage('');
    const targetEmail = overrideEmail || email;
    const targetPass = overridePass || password;

    if (!targetEmail.trim() || !targetPass.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    try {
      await login(targetEmail, targetPass);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegister = async () => {
    setErrorMessage('');
    if (!name.trim() || !regEmail.trim() || !regPassword.trim() || !phone.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      await register({
        name,
        email: regEmail,
        phone,
        password: regPassword,
        role: 'FARMER',
        state,
        district,
        village,
        preferredLanguage: 'en',
        farmSize: parseFloat(farmSize) || 1,
        experience: 5,
        primaryCrop,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  // Quick Demo Login helper (registers if not present, then logs in)
  const handleDemoLogin = async () => {
    setErrorMessage('');
    try {
      await login('farmer@agribandhu.org', 'Farmer@1234');
    } catch {
      // If demo user does not exist in DB yet, create it then login!
      try {
        await register({
          name: 'Gurpreet Singh',
          email: 'farmer@agribandhu.org',
          phone: '+91 98765 43210',
          password: 'Farmer@1234',
          role: 'FARMER',
          state: 'Punjab',
          district: 'Ludhiana',
          village: 'Sahnewal',
          preferredLanguage: 'en',
          farmSize: 5.5,
          experience: 8,
          primaryCrop: 'Sharbati Wheat',
        });
      } catch (e: any) {
        setErrorMessage(e.message || 'Failed demo authentication');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Branding Banner */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="sprout" size={36} color="#10B981" />
          </View>
          <Text style={styles.brandTitle}>AgriBandhu 2.0</Text>
          <Text style={styles.brandSubtitle}>
            Empowering Farmers with AI-Driven Agriculture
          </Text>
        </View>

        {/* Auth Mode Toggle Pill */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLoginMode && styles.toggleBtnActive]}
            onPress={() => {
              setIsLoginMode(true);
              setErrorMessage('');
            }}
          >
            <Text style={[styles.toggleText, isLoginMode && styles.toggleTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLoginMode && styles.toggleBtnActive]}
            onPress={() => {
              setIsLoginMode(false);
              setErrorMessage('');
            }}
          >
            <Text style={[styles.toggleText, !isLoginMode && styles.toggleTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Alert Banner */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Login Form */}
        {isLoginMode ? (
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Farmer Email Address</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@domain.com"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleLogin()}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Sign In to Farm Portal</Text>
                  <Feather name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR QUICK ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleDemoLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#059669" />
              <Text style={styles.demoBtnText}>⚡ 1-Click Demo Farmer Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Register Form */
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Gurpreet Singh"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={regEmail}
                onChangeText={setRegEmail}
                placeholder="farmer@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.inputLabel}>Mobile Phone *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="phone" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={regPassword}
                onChangeText={setRegPassword}
                placeholder="Min 6 characters"
                secureTextEntry
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.splitRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Village</Text>
                <TextInput
                  style={styles.splitInput}
                  value={village}
                  onChangeText={setVillage}
                  placeholder="Village"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.inputLabel}>District</Text>
                <TextInput
                  style={styles.splitInput}
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="District"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.splitRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Farm Size (Acres)</Text>
                <TextInput
                  style={styles.splitInput}
                  value={farmSize}
                  onChangeText={setFarmSize}
                  keyboardType="numeric"
                  placeholder="5.0"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.inputLabel}>Primary Crop</Text>
                <TextInput
                  style={styles.splitInput}
                  value={primaryCrop}
                  onChangeText={setPrimaryCrop}
                  placeholder="Wheat / Rice"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Register & Create Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            🔒 Connected directly to AgriBandhu 2.0 Unified REST API & Database
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064E3B',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#022C22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ECFDF5',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#A7F3D0',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#022C22',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#10B981',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A7F3D0',
  },
  toggleTextActive: {
    color: '#022C22',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  splitRow: {
    flexDirection: 'row',
  },
  splitInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  demoBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  demoBtnText: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '700',
  },
  footerInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#A7F3D0',
    fontSize: 11,
    textAlign: 'center',
  },
});
