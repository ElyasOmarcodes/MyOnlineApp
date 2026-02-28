import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BookOpen, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const { width, height } = Dimensions.get('window');

const SplashAndRegister: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser, registerUser } = useContent();
  const [showSplash, setShowSplash] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const completeTimer = setTimeout(() => {
      if (currentUser) {
        onComplete();
      } else {
        setShowSplash(false);
      }
    }, duration + 200);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [currentUser, onComplete]);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError('مهرباني وکړئ نوم او د موبایل شمېره ولیکئ');
      return;
    }
    registerUser(name, phone);
    onComplete();
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.backgroundEffect1} />
        <View style={styles.backgroundEffect2} />
        
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <View style={styles.logoInner}>
            <BookOpen size={56} color="#10b981" strokeWidth={1.5} />
            <Sparkles size={24} color="#fbbf24" style={styles.sparkleIcon} />
          </View>
        </View>

        <View style={styles.splashTextContainer}>
          <Text style={styles.splashTitle}>اسلامي مطالب</Text>
          <Text style={styles.splashSubtitle}>
            د دیني معلوماتو او ښکلو ویناوو غوره ټولګه
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>باریږي...</Text>
              <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.registerContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.registerScroll}>
        <View style={styles.registerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.userIconContainer}>
              <User size={32} color="#10b981" strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>ښه راغلاست!</Text>
            <Text style={styles.cardSubtitle}>د کمنټونو لیکلو لپاره خپل معلومات ثبت کړئ</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ستاسو نوم</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="احمد..."
                  placeholderTextColor="#9ca3af"
                  textAlign="right"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>د موبایل شمېره</Text>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="07..."
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  textAlign="left"
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>ننوتل</Text>
              <ArrowRight size={20} color="white" style={styles.submitIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundEffect1: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.1,
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: width * 0.35,
  },
  backgroundEffect2: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: -width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: width * 0.3,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 48,
  },
  logoGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#10b981',
    borderRadius: 40,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
  },
  logoInner: {
    width: 128,
    height: 128,
    backgroundColor: 'white',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -12,
    right: -12,
  },
  splashTextContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 48,
  },
  splashTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 48,
  },
  progressContainer: {
    width: '100%',
    gap: 8,
  },
  progressBarBg: {
    height: 6,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  progressTextRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
  },
  registerContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  registerScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  registerCard: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 8,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 56,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    height: 64,
    borderRadius: 24,
    marginTop: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  submitIcon: {
    marginRight: 12,
  },
});

export default SplashAndRegister;
