import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContent } from '../context/ContentContext';
import { User, Phone, Check, ChevronRight } from 'lucide-react';

const ProfileEdit: React.FC = () => {
  const { currentUser, updateUser } = useContent();
  const navigation = useNavigation<any>();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (name.trim() && phone.trim()) {
      updateUser(name.trim(), phone.trim());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigation.goBack();
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronRight size={24} color="#717a8b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>پروفایل ایډیټ</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ستاسو نوم</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <User size={18} color="#9ca3af" />
              </View>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="نوم"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>د موبایل شمېره</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Phone size={18} color="#9ca3af" />
              </View>
              <TextInput
                style={[styles.textInput, { textAlign: 'left' }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="شمېره"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            {success ? (
              <View style={styles.buttonContent}>
                <Check size={20} color="white" />
                <Text style={styles.buttonText}>خوندي شو!</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>تغیرات خوندي کړئ</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    marginRight: 16,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
  },
  inputIconRight: {
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: 'var(--accent-color)', // Fallback needed
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: 'var(--accent-color)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileEdit;
