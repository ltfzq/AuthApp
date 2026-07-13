import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import TextInputField from '../components/TextInputField';
import { useFormValidation } from '../hooks/useFormValidation';
import { COLORS, MIN_PASSWORD_LENGTH } from '../constants/config';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { values, errors, setField, validate } = useFormValidation(
    { name: '', email: '', password: '' },
    {
      name: { label: 'Name', required: true },
      email: { label: 'Email', required: true, email: true },
      password: { label: 'Password', required: true, minLength: MIN_PASSWORD_LENGTH },
    }
  );

  const handleSignup = async () => {
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(values.name.trim(), values.email.trim(), values.password);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us — it only takes a minute</Text>

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <TextInputField
            label="Full Name"
            placeholder="Jane Doe"
            value={values.name}
            onChangeText={(t) => setField('name', t)}
            error={errors.name}
            autoCapitalize="words"
          />

          <TextInputField
            label="Email"
            placeholder="you@example.com"
            value={values.email}
            onChangeText={(t) => setField('email', t)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInputField
            label="Password"
            placeholder="Min. 6 characters"
            value={values.password}
            onChangeText={(t) => setField('password', t)}
            error={errors.password}
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account?{' '}
              <Text style={styles.linkText}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_LIGHT,
    marginBottom: 24,
  },
  apiErrorBox: {
    backgroundColor: COLORS.ERROR_BG,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  apiErrorText: {
    color: COLORS.ERROR_TEXT,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    color: COLORS.SURFACE,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
  linkText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});
