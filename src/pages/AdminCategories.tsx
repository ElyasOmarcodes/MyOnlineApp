import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  PlusCircle, 
  Tag, 
  ArrowRight, 
  Edit3, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown,
  Trash2,
  FolderPlus,
  BookOpen,
  GripVertical
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent, Category } from '../context/ContentContext';
import ConfirmDialog from '../components/ConfirmDialog';

const availableIcons = [
  'BookOpen', 'Book', 'Heart', 'Moon', 'Sun', 'Star', 'MessageSquare', 'Music',
  'Video', 'Image', 'Camera', 'Mic', 'Headphones', 'FileText', 'Folder', 'List',
  'CheckCircle', 'Info', 'AlertCircle', 'HelpCircle', 'Settings', 'User', 'Users',
  'Home', 'Search', 'Bell', 'Calendar', 'Clock', 'Map', 'Navigation', 'Compass',
  'Globe', 'Cloud', 'Droplet', 'Wind', 'Zap', 'Activity', 'Award', 'Briefcase',
  'Coffee', 'Feather', 'Gift', 'Key', 'Link', 'Lock', 'Unlock', 'Mail', 'PenTool',
  'Phone', 'Printer', 'Radio', 'Save', 'Send', 'Share2', 'Shield', 'ShoppingBag',
  'ShoppingCart', 'Tag', 'Terminal', 'Tool', 'Trash2', 'TrendingUp', 'Truck', 'Tv',
  'Umbrella', 'Watch', 'Wifi'
];

const AdminCategories: React.FC = () => {
  const navigation = useNavigation<any>();
  const { categories, addCategory, updateCategory, reorderCategories, deleteCategory, isAdmin, posts } = useContent();
  
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('BookOpen');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [migrateToId, setMigrateToId] = useState<string>('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!isAdmin) return null;

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name];
    return typeof Icon === 'function' || typeof Icon === 'object' ? Icon : BookOpen;
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, newCategory.trim(), newCategoryIcon);
          setSuccess('کټګوري ایډیټ شوه');
          setEditingCategory(null);
        } else {
          await addCategory(newCategory.trim(), newCategoryIcon);
          setSuccess('کټګوري اضافه شوه');
        }
        setNewCategory('');
        setNewCategoryIcon('BookOpen');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('تېروتنه رامنځته شوه');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
    setNewCategoryIcon(cat.icon);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id, migrateToId || undefined);
        setSuccess('کټګوري حذف شوه');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('د کټګورۍ حذف کولو پر مهال تېروتنه وشوه');
        setTimeout(() => setError(''), 3000);
      }
      setCategoryToDelete(null);
      setMigrateToId('');
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
          <Text style={styles.headerTitle}>کټګورۍ مدیریت</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <FolderPlus size={20} color="var(--accent-color)" />
            <Text style={styles.formTitle}>
              {editingCategory ? 'کټګوري ایډیټ کړئ' : 'نوې کټګوري اضافه کړئ'}
            </Text>
          </View>

          <View style={styles.inputRow}>
            <TouchableOpacity
              onPress={() => setShowIconPicker(true)}
              style={styles.iconPickerButton}
            >
              {React.createElement(getIcon(newCategoryIcon), { size: 24, color: '#6b7280' })}
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="د کټګورۍ نوم..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              onPress={handleAddCategory}
              disabled={!newCategory.trim()}
              style={[styles.submitButton, !newCategory.trim() && styles.submitButtonDisabled]}
            >
              {editingCategory ? <Edit3 size={18} color="white" /> : <PlusCircle size={18} color="white" />}
              <Text style={styles.submitButtonText}>
                {editingCategory ? 'تغیرات خوندي کړئ' : 'اضافه کول'}
              </Text>
            </TouchableOpacity>
            
            {editingCategory && (
              <TouchableOpacity
                onPress={() => {
                  setEditingCategory(null);
                  setNewCategory('');
                  setNewCategoryIcon('BookOpen');
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>لغوه</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>کټګورۍ ({categories.length})</Text>
            <Text style={styles.listSubtitle}>د ترتیب لپاره یې کش کړئ (Not implemented in RN yet)</Text>
          </View>

          <View style={styles.listContainer}>
            {categories.map(cat => {
              const IconComponent = getIcon(cat.icon);
              return (
                <View key={cat.id} style={styles.categoryCard}>
                  <View style={styles.categoryCardLeft}>
                    <GripVertical size={16} color="#d1d5db" style={{ marginLeft: 8 }} />
                    <View style={styles.categoryIconWrapper}>
                      <IconComponent size={18} color="#6b7280" />
                    </View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </View>
                  <View style={styles.categoryActions}>
                    <TouchableOpacity
                      onPress={() => handleEditCategory(cat)}
                      style={styles.actionButton}
                    >
                      <Edit3 size={18} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setCategoryToDelete(cat)}
                      style={styles.actionButton}
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIconPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>آیکون وټاکئ</Text>
              <TouchableOpacity onPress={() => setShowIconPicker(false)}>
                <XCircle size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.iconGrid}>
              {availableIcons.map(iconName => {
                const IconComponent = getIcon(iconName);
                const isSelected = newCategoryIcon === iconName;
                return (
                  <TouchableOpacity
                    key={iconName}
                    onPress={() => {
                      setNewCategoryIcon(iconName);
                      setShowIconPicker(false);
                    }}
                    style={[
                      styles.iconGridItem,
                      isSelected && styles.iconGridItemSelected
                    ]}
                  >
                    <IconComponent size={24} color={isSelected ? 'white' : '#6b7280'} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="کټګوري حذف کول"
        message="ایا تاسو ډاډه یاست چې دا کټګوري حذف کوئ؟"
        onConfirm={handleDeleteCategoryConfirm}
        onCancel={() => {
          setCategoryToDelete(null);
          setMigrateToId('');
        }}
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
  formHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  inputRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 16,
  },
  iconPickerButton: {
    width: 56,
    height: 56,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  formActions: {
    flexDirection: 'row-reverse',
    gap: 12,
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
  submitButtonDisabled: {
    opacity: 0.5,
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
  listHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  listTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  listSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  listContainer: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  categoryCardLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  categoryActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  iconGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  iconGridItem: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGridItemSelected: {
    backgroundColor: 'var(--accent-color)', // Fallback needed
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

export default AdminCategories;
