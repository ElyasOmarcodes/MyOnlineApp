import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContent } from '../context/ContentContext';
import { 
  Lock, 
  LogOut, 
  FileText, 
  Tag, 
  LayoutDashboard, 
  Sparkles,
  ChevronLeft,
  Users,
  Settings,
  ShieldCheck
} from 'lucide-react';

const AdminCard = ({ title, desc, icon: Icon, onClick, color }: { title: string, desc: string, icon: any, onClick: () => void, color: string }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onClick}
    style={styles.adminCard}
  >
    <View style={[styles.cardIconWrapper, { backgroundColor: `${color}15` }]}>
      <Icon size={32} color={color} strokeWidth={1.5} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
    <View style={styles.cardArrow}>
      <ChevronLeft size={20} color="#9ca3af" />
    </View>
  </TouchableOpacity>
);

const Admin: React.FC = () => {
  const { isAdmin, logout, posts, categories, topPosts } = useContent();
  const navigation = useNavigation<any>();

  if (!isAdmin) {
    return (
      <View style={styles.noAccessContainer}>
        <View style={styles.noAccessIconWrapper}>
          <Lock size={40} color="#ef4444" />
        </View>
        <Text style={styles.noAccessTitle}>لاسرسی نشته</Text>
        <Text style={styles.noAccessDesc}>تاسو باید لومړی په تنظیماتو کې ننوځئ</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrapper}>
            <LayoutDashboard size={24} color="var(--accent-color)" />
          </View>
          <View>
            <Text style={styles.headerTitle}>اډمین پینل</Text>
            <Text style={styles.headerSubtitle}>د اپلیکیشن مدیریت مرکز</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={logout}
          style={styles.logoutButton}
        >
          <LogOut size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <AdminCard 
          title="مطالب مدیریت" 
          desc={`${posts.length} خپاره شوي مطالب`} 
          icon={FileText} 
          color="#3b82f6"
          onClick={() => navigation.navigate('AdminPosts')} 
        />
        <AdminCard 
          title="کټګورۍ مدیریت" 
          desc={`${categories.length} فعالې کټګورۍ`} 
          icon={Tag} 
          color="#10b981"
          onClick={() => navigation.navigate('AdminCategories')} 
        />
        <AdminCard 
          title="بهترینې خبرې" 
          desc={`${topPosts?.length || 0} غوره خبرې`} 
          icon={Sparkles} 
          color="#f59e0b"
          onClick={() => navigation.navigate('AdminTopPosts')} 
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
            <Users size={20} color="#a855f7" />
          </View>
          <Text style={styles.statLabel}>کارونکي</Text>
          <Text style={styles.statValue}>---</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <ShieldCheck size={20} color="#3b82f6" />
          </View>
          <Text style={styles.statLabel}>امنیت</Text>
          <Text style={styles.statValue}>خوندي</Text>
        </View>
      </View>

      <View style={styles.warningContainer}>
        <Settings size={20} color="#f59e0b" style={styles.warningIcon} />
        <Text style={styles.warningText}>
          پاملرنه: دلته هر ډول بدلون به په مستقیم ډول ټولو کارونکو ته ښکاره شي. مهرباني وکړئ په دقت سره کار وکړئ.
        </Text>
      </View>
    </ScrollView>
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
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  noAccessIconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: '#fef2f2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  noAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  noAccessDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  headerIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Fallback accent
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textAlign: 'right',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  adminCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textAlign: 'right',
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  warningContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#b45309',
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'right',
  },
});

export default Admin;

