import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  PlusCircle, 
  FileText, 
  ArrowRight, 
  Send, 
  Edit3, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  ChevronDown,
  Trash2,
  Calendar
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminPosts: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addPost, updatePost, deletePost, posts, isAdmin, categories } = useContent();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'عمومي');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!isAdmin) return null;

  const handleSubmit = async () => {
    if (!title || !content) {
      setError('مهرباني وکړئ ټول ځایونه ډک کړئ');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (editingId) {
        await updatePost(editingId, title, content, category);
        setSuccess('مطلب په بریالیتوب سره ایډیټ شو');
      } else {
        await addPost(title, content, category);
        setSuccess('مطلب په بریالیتوب سره خپور شو');
      }
      setTitle('');
      setContent('');
      setCategory(categories[0]?.name || 'عمومي');
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('د مطلب په خپرولو کې ستونزه راغله');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setSuccess('مطلب حذف شو');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('د حذف کولو پر مهال تېروتنه وشوه');
        setTimeout(() => setError(''), 3000);
      }
      setPostToDelete(null);
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setCategory(categories[0]?.name || 'عمومي');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowRight size={20} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>مطالب مدیریت</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowForm(!showForm)}
            style={[styles.toggleFormButton, showForm && styles.toggleFormButtonActive]}
          >
            {showForm ? <XCircle size={20} color="#6b7280" /> : <PlusCircle size={20} color="white" />}
            <Text style={[styles.toggleFormText, showForm && styles.toggleFormTextActive]}>
              {showForm ? 'بندول' : 'نوی مطلب'}
            </Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>د مطلب سرلیک</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="دلته سرلیک ولیکئ..."
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>کټګوري</Text>
              {/* Note: React Native doesn't have a built-in select/dropdown that matches web exactly. 
                  For a real app, use a library like @react-native-picker/picker. 
                  Here we use a simplified TextInput as a placeholder for the picker. */}
              <View style={styles.pickerWrapper}>
                <TextInput
                  style={styles.pickerInput}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="کټګوري وټاکئ"
                  placeholderTextColor="#9ca3af"
                />
                <View style={styles.pickerIcon}>
                  <ChevronDown size={18} color="#9ca3af" />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>د مطلب متن</Text>
              <TextInput
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
                placeholder="خپل مطلب په تفصیل سره دلته ولیکئ..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.submitButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    {editingId ? <Edit3 size={18} color="white" /> : <Send size={18} color="white" />}
                    <Text style={styles.submitButtonText}>{editingId ? 'تغیرات خوندي کړئ' : 'خپور کړئ'}</Text>
                  </>
                )}
              </TouchableOpacity>
              
              {editingId && (
                <TouchableOpacity
                  onPress={cancelEdit}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>لغوه</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>خپاره شوي مطالب ({posts.length})</Text>
          
          <View style={styles.listContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postCardContent}>
                  <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                  <View style={styles.postMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{post.category}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Calendar size={10} color="#9ca3af" />
                      <Text style={styles.dateText}>
                        {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(post)}
                    style={styles.actionButton}
                  >
                    <Edit3 size={18} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPostToDelete(post.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            {posts.length === 0 && (
              <View style={styles.emptyState}>
                <FileText size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyStateText}>تر اوسه کوم مطلب نشته</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="مطلب حذف کول"
        message="ایا تاسو ډاډه یاست چې دا مطلب حذف کوئ؟ دا عمل بیرته نشي ګرځېدلی."
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
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
  toggleFormButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'var(--accent-color)', // Fallback needed
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: 'var(--accent-color)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  toggleFormButtonActive: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0,
    elevation: 0,
  },
  toggleFormText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleFormTextActive: {
    color: '#6b7280',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
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
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  pickerWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  pickerInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  pickerIcon: {
    position: 'absolute',
    left: 20,
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'right',
    minHeight: 120,
  },
  formActions: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'var(--accent-color)', // Fallback needed
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listSection: {
    marginTop: 8,
  },
  listSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    marginRight: 8,
    textAlign: 'right',
  },
  listContainer: {
    gap: 12,
  },
  postCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  postCardContent: {
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
  categoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Fallback accent
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'var(--accent-color)', // Fallback needed
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
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#f9fafb',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9ca3af',
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

export default AdminPosts;
