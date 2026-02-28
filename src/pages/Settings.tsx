import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Switch } from 'react-native';
import { Moon, Sun, Monitor, Palette, ChevronRight, Check, Sparkles, ShieldCheck, BellRing, Lock, LogOut, User, Type } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { useNavigation } from '@react-navigation/native';

const SettingSection = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: any }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconContainer}>
        <Icon size={18} color="var(--accent-color)" />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const Settings: React.FC = () => {
  const { mode, setMode, accentColor, setAccentColor, fontSize, setFontSize } = useTheme();
  const { isAdmin, login, logout, currentUser } = useContent();
  const navigation = useNavigation<any>();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (login(username, password)) {
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('غلط کارن نوم یا پټ نوم');
    }
  };

  const presetColors = [
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#6366f1', // Indigo
    '#14b8a6', // Teal
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          {/* SVG placeholder for RN */}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>تنظیمات</Text>
          <Text style={styles.headerSubtitle}>اپلیکیشن په خپله خوښه عیار کړئ</Text>
        </View>
      </View>

      {/* Profile Section */}
      <SettingSection title="پروفایل" icon={User}>
        <View style={styles.sectionPadding}>
          <TouchableOpacity 
            style={styles.profileRow}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <View style={styles.profileInfo}>
              <View 
                style={[styles.profileAvatar, { backgroundColor: currentUser?.color || accentColor }]}
              >
                <Text style={styles.profileAvatarText}>{currentUser?.name?.charAt(0) || 'U'}</Text>
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{currentUser?.name || 'کارونکی'}</Text>
                <Text style={styles.profilePhone}>{currentUser?.phone || 'شمېره نشته'}</Text>
              </View>
            </View>
            <View style={styles.profileAction}>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>ایډیټ</Text>
              </View>
              <ChevronRight size={18} color="#d1d5db" />
            </View>
          </TouchableOpacity>
        </View>
      </SettingSection>

      {/* Appearance Section */}
      <SettingSection title="بڼه (Appearance)" icon={Monitor}>
        <View style={styles.sectionPadding}>
          <View style={styles.themeGrid}>
            {[
              { id: 'light', label: 'روښانه', icon: Sun },
              { id: 'dark', label: 'تیاره', icon: Moon },
              { id: 'system', label: 'سیسټم', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <TouchableOpacity
                key={id}
                onPress={() => setMode(id as any)}
                style={[
                  styles.themeButton,
                  mode === id && styles.themeButtonActive
                ]}
              >
                <Icon size={24} color={mode === id ? accentColor : "#9ca3af"} style={styles.themeIcon} />
                <Text style={[styles.themeLabel, mode === id && { color: accentColor }]}>{label}</Text>
                {mode === id && (
                  <View style={[styles.themeCheck, { backgroundColor: accentColor }]}>
                    <Check size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SettingSection>

      {/* Font Size Section */}
      <SettingSection title="د خط اندازه (Font Size)" icon={Type}>
        <View style={styles.sectionPadding}>
          <View style={styles.fontSizeHeader}>
            <Text style={styles.fontSizeLabelSmall}>کوچنی</Text>
            <Text style={styles.fontSizeLabelLarge}>غټ</Text>
          </View>
          {/* RN doesn't have a built-in slider, using a simple placeholder or buttons for now */}
          <View style={styles.fontSizeControls}>
             <TouchableOpacity onPress={() => setFontSize(Math.max(14, fontSize - 1))} style={styles.fontSizeBtn}>
               <Text style={styles.fontSizeBtnText}>-</Text>
             </TouchableOpacity>
             <Text style={styles.fontSizeValue}>{fontSize}</Text>
             <TouchableOpacity onPress={() => setFontSize(Math.min(24, fontSize + 1))} style={styles.fontSizeBtn}>
               <Text style={styles.fontSizeBtnText}>+</Text>
             </TouchableOpacity>
          </View>
          <View style={styles.fontPreviewContainer}>
            <Text style={[styles.fontPreviewText, { fontSize }]}>
              دا د خط نمونه ده.
            </Text>
          </View>
        </View>
      </SettingSection>

      {/* Accent Color Section */}
      <SettingSection title="اصلي رنګ (Accent Color)" icon={Palette}>
        <View style={styles.sectionPadding}>
          <View style={styles.colorGrid}>
            {presetColors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setAccentColor(color)}
                style={[styles.colorButton, { backgroundColor: color }]}
              >
                {accentColor === color && (
                  <View style={styles.colorCheck}>
                    <Check size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SettingSection>

      {/* Admin Section */}
      <SettingSection title="اډمین مدیریت" icon={Lock}>
        <View style={styles.adminContainer}>
          {!isAdmin ? (
            <View style={styles.sectionPadding}>
              <TouchableOpacity 
                style={styles.adminLoginRow}
                onPress={() => setShowLogin(!showLogin)}
              >
                <View style={styles.adminLoginInfo}>
                  <View style={styles.adminIconContainer}>
                    <Lock size={20} color="#f59e0b" />
                  </View>
                  <View style={styles.adminTextContainer}>
                    <Text style={styles.adminTitle}>اډمین ننوتل</Text>
                    <Text style={styles.adminSubtitle}>د مطالبو د مدیریت لپاره ننوځئ</Text>
                  </View>
                </View>
                <View style={{ transform: [{ rotate: showLogin ? '90deg' : '0deg' }] }}>
                  <ChevronRight size={18} color="#d1d5db" />
                </View>
              </TouchableOpacity>

              {showLogin && (
                <View style={styles.loginForm}>
                  <TextInput
                    style={styles.input}
                    placeholder="کارن نوم"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="پټ نوم"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  <TouchableOpacity style={[styles.loginButton, { backgroundColor: accentColor }]} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>ننوتل</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.adminLoggedInRow}>
              <View style={styles.adminLoginInfo}>
                <View style={styles.adminLoggedInIconContainer}>
                  <User size={20} color="#10b981" />
                </View>
                <View style={styles.adminTextContainer}>
                  <Text style={styles.adminTitle}>تاسو ننوتی یاست</Text>
                  <Text style={styles.adminSubtitle}>اډمین پینل اوس په مینو کې خلاص دی</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={logout}
              >
                <LogOut size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SettingSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 2.1.0 • Ramadan Edition</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    backgroundColor: 'var(--accent-color)', // Needs dynamic handling in RN, using fallback for now if possible, or just a static color
    borderRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 40,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  headerContent: {
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Example accent color
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  sectionPadding: {
    padding: 20,
  },
  profileRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  profileAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileTextContainer: {
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profilePhone: {
    fontSize: 12,
    color: '#9ca3af',
  },
  profileAction: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  editBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  editBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10b981',
  },
  themeGrid: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#f9fafb',
    backgroundColor: '#f9fafb',
    marginHorizontal: 4,
  },
  themeButtonActive: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  themeIcon: {
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  themeCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fontSizeLabelSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  fontSizeLabelLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fontSizeControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  fontSizeBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  fontSizeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  fontSizeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  fontPreviewContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  fontPreviewText: {
    textAlign: 'center',
    color: '#374151',
  },
  colorGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 16,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminContainer: {
    // padding: 20,
  },
  adminLoginRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminLoginInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  adminIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  adminTextContainer: {
    alignItems: 'flex-end',
  },
  adminTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  adminSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  loginForm: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    textAlign: 'right',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 10,
    textAlign: 'center',
  },
  loginButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  adminLoggedInRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  adminLoggedInIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  logoutButton: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default Settings;
