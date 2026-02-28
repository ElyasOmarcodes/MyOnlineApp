import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { 
  ChevronDown, 
  ShieldCheck, 
  User, 
  Sparkles,
  Github,
  Twitter,
  Mail,
  Zap,
  Globe,
  Database,
  Shield,
  Layout as LayoutIcon,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

const About: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          {/* SVG placeholder */}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>زمونږ په اړه</Text>
          <Text style={styles.headerSubtitle}>د اسلامي مطالبو او ښکلو ویناوو د خپرولو آنلاین پلیټ فارم.</Text>
        </View>
      </View>

      {/* Developer Profile Card */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPulse} />
              <View style={styles.avatarInner}>
                <User size={64} color="#d1d5db" />
              </View>
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>الیاس عمر</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>پروګرام جوړونکی</Text>
              </View>
            </View>

            <Text style={styles.profileDescription}>
              د مؤمن ولس یو پروګرام جوړونکی دی چې غواړي د ټکنالوژۍ له لارې د اسلام خدمت وکړي او د دیني معلوماتو د خپرولو په برخه کې خپله ونډه واخلي.
            </Text>

            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://github.com')}>
                <Github size={20} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://twitter.com')}>
                <Twitter size={20} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => openLink('mailto:example@email.com')}>
                <Mail size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>د اپلیکیشن ځانګړتیاوې</Text>
        <View style={styles.featuresGrid}>
          {[
            { icon: Database, title: 'فایربیس', desc: 'آنلاین ډیټابیس' },
            { icon: Zap, title: 'چټک', desc: 'لوړ سرعت' },
            { icon: Shield, title: 'خوندي', desc: 'اډمین پینل' },
            { icon: LayoutIcon, title: 'ښکلی UI', desc: 'عصري ډیزاین' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <feature.icon size={24} color="var(--accent-color)" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Privacy Policy Accordion */}
      <View style={styles.privacySection}>
        <TouchableOpacity
          style={styles.privacyHeader}
          onPress={() => setIsPrivacyOpen(!isPrivacyOpen)}
        >
          <View style={styles.privacyHeaderLeft}>
            <View style={styles.privacyIconContainer}>
              <ShieldCheck size={24} color="#10b981" />
            </View>
            <View style={styles.privacyTitleContainer}>
              <Text style={styles.privacyTitle}>قوانین او پالیسي</Text>
              <Text style={styles.privacySubtitle}>Privacy Policy</Text>
            </View>
          </View>
          <View style={{ transform: [{ rotate: isPrivacyOpen ? '180deg' : '0deg' }] }}>
            <ChevronDown size={20} color="#d1d5db" />
          </View>
        </TouchableOpacity>
        
        {isPrivacyOpen && (
          <View style={styles.privacyContent}>
            <Text style={styles.privacyText}>
              دا اپلیکیشن ستاسو د معلوماتو د خوندي ساتلو لپاره جوړ شوی دی. ټول مطالب په فایربیس کې خوندي کیږي.
            </Text>
            <View style={styles.privacyList}>
              {[
                'مطالب په ژوندۍ بڼه له فایربیس څخه راځي.',
                'اډمین پینل د مطالبو د خپرولو لپاره دی.',
                'خوښ شوي مطالب ستاسو په موبایل کې خوندي کیږي.'
              ].map((item, i) => (
                <View key={i} style={styles.privacyListItem}>
                  <View style={styles.privacyListBullet} />
                  <Text style={styles.privacyListItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDivider}>
          <View style={styles.footerLine} />
          <Text style={styles.footerBrand}>Ramadan Content App</Text>
          <View style={styles.footerLine} />
        </View>
        <View style={styles.footerCopyright}>
          <Text style={styles.footerCopyrightText}>© ۲۰۲۴ ټول حقونه خوندي دي</Text>
          <Text style={styles.footerVersionText}>نسخه ۲.۰.۰ • Crafted with Love</Text>
        </View>
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
    backgroundColor: 'var(--accent-color)', // Fallback needed
    borderRadius: 40,
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 48,
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
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 40,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarPulse: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // Example accent color
    borderRadius: 100,
  },
  avatarInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#f9fafb',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  profileDescription: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  socialLinks: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  featuresGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTextContainer: {
    alignItems: 'flex-end',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 10,
    color: '#9ca3af',
  },
  privacySection: {
    backgroundColor: 'white',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    marginBottom: 48,
  },
  privacyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
  },
  privacyHeaderLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  privacyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  privacyTitleContainer: {
    alignItems: 'flex-end',
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  privacySubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  privacyContent: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  privacyText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 16,
  },
  privacyList: {
    gap: 12,
  },
  privacyListItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  privacyListBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'var(--accent-color)',
    marginLeft: 12,
  },
  privacyListItemText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  footerDivider: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  footerLine: {
    height: 1,
    width: 32,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footerCopyright: {
    alignItems: 'center',
  },
  footerCopyrightText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerVersionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    opacity: 0.5,
  },
});

export default About;
