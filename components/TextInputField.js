import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/config';

export default function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      {isPassword ? (
        <View style={[styles.passwordRow, error && styles.borderError]}>
          <TextInput
            style={styles.passwordInput}
            placeholder={placeholder}
            placeholderTextColor={COLORS.PLACEHOLDER}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeBtn}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[styles.input, error && styles.borderError]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_MEDIUM,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.TEXT_DARK,
    backgroundColor: COLORS.INPUT_BG,
  },
  borderError: {
    borderColor: COLORS.ERROR,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.BORDER,
    borderRadius: 10,
    backgroundColor: COLORS.INPUT_BG,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.TEXT_DARK,
  },
  eyeBtn: { paddingHorizontal: 12 },
  eyeIcon: { fontSize: 18 },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 13,
    marginTop: 4,
  },
});
