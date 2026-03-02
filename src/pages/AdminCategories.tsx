import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const SortableCategory = ({ cat, getIcon, onEdit, onDelete }: { cat: Category, getIcon: any, onEdit: any, onDelete: any }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = getIcon(cat.icon);

  return (
    <div ref={setNodeRef} style={style} className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 group shadow-sm">
      <div {...attributes} {...listeners} className="flex items-center flex-1 cursor-grab active:cursor-grabbing">
        <GripVertical size={16} className="text-zinc-300 ml-2" />
        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-black flex items-center justify-center text-zinc-500 ml-3">
          <IconComponent size={18} />
        </div>
        <span className="font-bold">{cat.name}</span>
      </div>
      <div className="flex items-center space-x-1 space-x-reverse">
        <button
          onClick={() => onEdit(cat)}
          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
        >
          <Edit3 size={18} />
        </button>
        <button
          onClick={() => onDelete(cat)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const AdminCategories: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, reorderCategories, deleteCategory, isAdmin, posts } = useContent();
  
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('BookOpen');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [migrateToId, setMigrateToId] = useState<string>('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!isAdmin) return null;

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name];
    return typeof Icon === 'function' || typeof Icon === 'object' ? Icon : BookOpen;
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
    setNewCategoryIcon(cat.icon);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategoryConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id, migrateToId || undefined);
        setSuccess('کټګوري حذف شوه');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('د کټګورۍ حذف کولو پر مهال تېروتنه وشوه');
      }
      setCategoryToDelete(null);
      setMigrateToId('');
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      reorderCategories(newOrder);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center space-x-4 space-x-reverse">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-black">کټګورۍ مدیریت</h1>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 space-x-reverse">
          <FolderPlus size={20} className="text-[var(--accent-color)]" />
          <h2 className="text-lg font-black">{editingCategory ? 'کټګوري ایډیټ کړئ' : 'نوې کټګوري اضافه کړئ'}</h2>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="h-full px-5 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-[var(--accent-color)] transition-colors min-h-[56px]"
              >
                {React.createElement(getIcon(newCategoryIcon), { size: 24 })}
              </button>
              
              <AnimatePresence>
                {showIconPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-6 gap-2 max-h-64 overflow-y-auto"
                  >
                    {availableIcons.map(iconName => {
                      const IconComponent = getIcon(iconName);
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            setNewCategoryIcon(iconName);
                            setShowIconPicker(false);
                          }}
                          className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                            newCategoryIcon === iconName 
                              ? 'bg-[var(--accent-color)] text-white' 
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          <IconComponent size={20} />
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="د کټګورۍ نوم..."
              className="flex-1 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="flex-1 bg-[var(--accent-color)] text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 space-x-reverse active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {editingCategory ? <Edit3 size={18} /> : <PlusCircle size={18} />}
              <span>{editingCategory ? 'تغیرات خوندي کړئ' : 'اضافه کول'}</span>
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory('');
                  setNewCategoryIcon('BookOpen');
                }}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold px-6 rounded-2xl active:scale-[0.98] transition-all"
              >
                لغوه
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">کټګورۍ ({categories.length})</h2>
          <p className="text-[10px] text-zinc-400 font-medium">د ترتیب لپاره یې کش کړئ</p>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map(c => c.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-3">
              {categories.map(cat => (
                <SortableCategory 
                  key={cat.id} 
                  cat={cat} 
                  getIcon={getIcon} 
                  onEdit={handleEditCategory} 
                  onDelete={setCategoryToDelete} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="کټګوري حذف کول"
        message={
          <div className="space-y-4">
            <p>ایا تاسو ډاډه یاست چې دا کټګوري حذف کوئ؟</p>
            {posts.filter(p => p.category === categoryToDelete?.name).length > 0 && (
              <div className="space-y-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                <p className="text-red-600 dark:text-red-400 text-xs font-bold">
                  پاملرنه: دا کټګوري {posts.filter(p => p.category === categoryToDelete?.name).length} مطالب لري.
                </p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">مطالب بلې کټګورۍ ته انتقال کړئ:</label>
                  <select
                    value={migrateToId}
                    onChange={(e) => setMigrateToId(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm font-bold"
                  >
                    <option value="">-- ټول مطالب حذف کړئ --</option>
                    {categories.filter(c => c.id !== categoryToDelete?.id).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        }
        onConfirm={handleDeleteCategoryConfirm}
        onCancel={() => {
          setCategoryToDelete(null);
          setMigrateToId('');
        }}
      />

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 space-x-reverse z-50 ${error ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-bold text-sm">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
