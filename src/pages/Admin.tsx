import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';
import * as Icons from 'lucide-react';
import { 
  Lock, 
  Send, 
  LogOut, 
  PlusCircle, 
  FileText, 
  Tag, 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Sparkles,
  Edit3,
  Trash2,
  XCircle,
  FolderPlus,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';

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

const Admin: React.FC = () => {
  const { addPost, updatePost, deletePost, posts, isAdmin, logout, categories, addCategory, deleteCategory } = useContent();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'عمومي');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('BookOpen');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Helper to get icon component safely
  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name];
    return typeof Icon === 'function' || typeof Icon === 'object' ? Icon : BookOpen;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('مهرباني وکړئ ټول ځایونه ډک کړئ');
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
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('د مطلب په خپرولو کې ستونزه راغله');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setSuccess('مطلب حذف شو');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('د حذف کولو پر مهال تېروتنه وشوه');
      }
      setPostToDelete(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await addCategory(newCategory.trim(), newCategoryIcon);
      setSuccess('کټګوري اضافه شوه');
      setNewCategory('');
      setNewCategoryIcon('BookOpen');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setCategory(categories[0]?.name || 'عمومي');
    setEditingId(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-3xl flex items-center justify-center">
          <Lock size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">لاسرسی نشته</h2>
          <p className="text-zinc-500 text-sm">تاسو باید لومړی په تنظیماتو کې ننوځئ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-2xl flex items-center justify-center">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">اډمین پینل</h1>
            <div className="flex items-center space-x-2 space-x-reverse text-zinc-500 text-xs font-medium">
              <Sparkles size={12} className="text-[var(--accent-color)]" />
              <span>{posts.length} خپاره شوي مطالب</span>
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl active:scale-90 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Main Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse mr-4 mb-1">
                  <PlusCircle size={14} className="text-[var(--accent-color)]" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">د مطلب سرلیک</label>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 px-5 sm:px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold text-base sm:text-lg"
                  placeholder="دلته سرلیک ولیکئ..."
                />
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse mr-4 mb-1">
                  <Tag size={14} className="text-[var(--accent-color)]" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">کټګوري</label>
                </div>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 px-5 sm:px-6 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all font-bold appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse mr-4 mb-1">
                <FileText size={14} className="text-[var(--accent-color)]" />
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">د مطلب متن</label>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-[24px] sm:rounded-[32px] py-4 sm:py-6 px-5 sm:px-8 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] transition-all leading-relaxed font-medium text-zinc-700 dark:text-zinc-300 text-sm sm:text-base"
                placeholder="خپل مطلب په تفصیل سره دلته ولیکئ..."
              />
            </div>

            {/* Feedback Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3 space-x-reverse bg-red-50 dark:bg-red-900/10 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/20"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3 space-x-reverse bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500 p-4 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-900/20"
                >
                  <CheckCircle2 size={18} />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-[var(--accent-color)] text-white font-black py-4 sm:py-6 rounded-2xl sm:rounded-[28px] shadow-2xl shadow-[var(--accent-color)]/30 flex items-center justify-center space-x-3 space-x-reverse active:scale-[0.98] transition-all relative overflow-hidden ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {editingId ? <Edit3 size={20} /> : <Send size={20} />}
                    <span className="text-base sm:text-lg">{editingId ? 'تغیرات خوندي کړئ' : 'مطلب خپور کړئ'}</span>
                  </>
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-2xl sm:rounded-[28px] flex items-center justify-center space-x-2 space-x-reverse active:scale-[0.98] transition-all"
                >
                  <XCircle size={20} />
                  <span className="text-sm sm:text-base">بندول</span>
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Category Management */}
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center space-x-2 space-x-reverse mb-6">
            <FolderPlus size={20} className="text-[var(--accent-color)]" />
            <h2 className="text-lg sm:text-xl font-black">کټګورۍ مدیریت</h2>
          </div>
          
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-6 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="h-full px-4 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-[var(--accent-color)] transition-colors min-h-[50px]"
              >
                {React.createElement(getIcon(newCategoryIcon), { size: 20 })}
              </button>
              
              <AnimatePresence>
                {showIconPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-xl p-3 z-50 grid grid-cols-6 gap-2 max-h-60 overflow-y-auto"
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
                          <IconComponent size={18} />
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
              placeholder="نوې کټګوري..."
              className="flex-1 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 font-bold text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform disabled:opacity-50 text-sm sm:text-base"
            >
              اضافه کول
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const IconComponent = getIcon(cat.icon);
              return (
                <div key={cat.id} className="flex items-center bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-1.5">
                  <IconComponent size={14} className="text-zinc-400" />
                  <span className="text-xs sm:text-sm font-bold ml-2 mr-2">{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-lg transition-colors"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Posts List for Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black">د مطالبو مدیریت</h2>
            <span className="text-xs text-zinc-400">{posts.length} مطالب</span>
          </div>
          
          <div className="space-y-3">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group"
              >
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-sm line-clamp-1">{post.title}</h3>
                  <p className="text-[10px] text-zinc-400">{post.category}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse mr-4">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:scale-110 transition-transform"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => setPostToDelete(post.id)}
                    className="p-2 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl hover:scale-110 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats / Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">وروستی فعالیت</div>
            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {posts.length > 0 ? new Date(posts[0].timestamp).toLocaleDateString('fa-AF') : 'نشته'}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">فعاله کټګورۍ</div>
            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {categories.length} کټګورۍ
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="مطلب حذف کول"
        message="ایا تاسو ډاډه یاست چې دا مطلب حذف کوئ؟ دا عمل بیرته نشي ګرځېدلی."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};

export default Admin;

