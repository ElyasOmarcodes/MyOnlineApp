import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Calendar,
  FileText
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminTopPosts: React.FC = () => {
  const navigation = useNavigation<any>();
  const { topPosts, addTopPost, deleteTopPost, posts, isAdmin } = useContent();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  if (!isAdmin) return null;

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !topPosts.some(tp => tp.id === post.id)
  );

  const handleAdd = async (post: any) => {
    try {
      await addTopPost(post.title, post.content);
      setSuccess('مطلب په غوره لیست کې اضافه شو');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('تېروتنه رامنځته شوه');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deleteTopPost(postToDelete);
        setSuccess('مطلب له غوره لیست څخه حذف شو');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('تېروتنه رامنځته شوه');
        setTimeout(() => setError(''), 3000);
      }
      setPostToDelete(null);
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
            <ArrowRight size={20} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>بهترینې خبرې مدیریت</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>غوره لیست ({topPosts.length}/10)</Text>
            <Text style={styles.sectionSubtitle}>یوازې ۱۰ وروستي ساتل کیږي</Text>
          </View>

          <View style={styles.listContainer}>
            {topPosts.map((post) => (
              <View key={post.id} style={styles.topPostCard}>
                <View style={styles.postInfo}>
                  <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                  <View style={styles.postMeta}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>غوره مطلب</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Calendar size={10} color="#9ca3af" />
                      <Text style={styles.dateText}>
                        {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setPostToDelete(post.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            {topPosts.length === 0 && (
              <View style={styles.emptyState}>
                <Sparkles size={32} color="#d1d5db" style={{ marginBottom: 8 }} />
                <Text style={styles.emptyStateText}>تر اوسه کوم غوره مطلب نشته</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.section, { marginTop: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>د مطالبو انتخاب</Text>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="د مطلب پلټنه..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.selectionList}>
            {filteredPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => handleAdd(post)}
                style={styles.selectionItem}
              >
                <View style={styles.selectionInfo}>
                  <Text style={styles.selectionTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.selectionCategory}>{post.category}</Text>
                </View>
                <View style={styles.addButton}>
                  <PlusCircle size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))}
            {filteredPosts.length === 0 && searchQuery ? (
              <Text style={styles.noResults}>هیڅ مطلب ونه موندل شو</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="له غوره لیست څخه حذف"
        message="ایا غواړئ دا مطلب له غوره لیست څخه حذف کړئ؟ (اصلي مطلب به پاتې وي)"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />

      {(error || success) ? (
        <View style={[styles.toast, error ? styles.toastError : styles.toastSuccess]}>
          {error ? <AlertCircle size={20} color="white" /> : <CheckCircle2 size={20} color="white" />}
          <Text style={styles.toastText}>{error || success}</Text>
        </View>
      ) : null}
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
    marginBottom: 24,
    marginTop: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  listContainer: {
    gap: 12,
  },
  topPostCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fef3c7', // amber-100
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postInfo: {
    flex: 1,
    marginRight: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    backgroundColor: '#fffbeb', // amber-50
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f59e0b', // amber-500
  },
  dateContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingRight: 48,
    paddingLeft: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionList: {
    gap: 8,
  },
  selectionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  selectionInfo: {
    flex: 1,
    marginRight: 16,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
  },
  selectionCategory: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 2,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    textAlign: 'center',
    paddingVertical: 24,
    color: '#9ca3af',
    fontSize: 12,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  toastError: {
    backgroundColor: '#ef4444',
  },
  toastSuccess: {
    backgroundColor: '#10b981',
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdminTopPosts;
