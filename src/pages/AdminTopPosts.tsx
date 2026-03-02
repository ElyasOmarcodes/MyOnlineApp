import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Edit2,
  X
} from 'lucide-react';
import { useContent, Post } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminTopPosts: React.FC = () => {
  const navigate = useNavigate();
  const { topPosts, addTopPost, updateTopPost, deleteTopPost, isAdmin } = useContent();
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ title: '', content: '' });

  if (!isAdmin) return null;

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('مهرباني وکړئ ټول اړین معلومات ډک کړئ');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      if (editingId) {
        await updateTopPost(editingId, formData.title, formData.content);
        setSuccess('مطلب په بریالیتوب سره بدل شو');
      } else {
        await addTopPost(formData.title, formData.content);
        setSuccess('مطلب په غوره لیست کې اضافه شو');
      }
      setTimeout(() => setSuccess(''), 3000);
      resetForm();
    } catch (err) {
      setError('تېروتنه رامنځته شوه');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (post: Post) => {
    setFormData({ title: post.title, content: post.content });
    setEditingId(post.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center space-x-4 space-x-reverse">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-black">بهترینې خبرې مدیریت</h1>
      </header>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{isEditing ? 'د مطلب سمون' : 'نوی مطلب اضافه کول'}</h2>
          {isEditing && (
            <button onClick={resetForm} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="د مطلب عنوان..."
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2">متن</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="د مطلب بشپړ متن..."
              rows={4}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={topPosts.length >= 10 && !isEditing}
            className="w-full bg-[var(--accent-color)] text-white p-4 rounded-2xl font-bold flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
          >
            {isEditing ? <Edit2 size={20} /> : <PlusCircle size={20} />}
            <span>{isEditing ? 'بدلونونه خوندي کړئ' : 'اضافه کړئ'}</span>
          </button>
          {topPosts.length >= 10 && !isEditing && (
            <p className="text-xs text-amber-500 text-center font-bold">تاسو یوازې ۱۰ غوره مطالب اضافه کولی شئ. مهرباني وکړئ لومړی یو حذف کړئ.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">غوره لیست ({topPosts.length}/10)</h2>
          <p className="text-[10px] text-zinc-400 font-medium">یوازې ۱۰ وروستي ساتل کیږي</p>
        </div>

        <div className="space-y-3">
          {topPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-amber-100 dark:border-amber-900/20 shadow-sm flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0 ml-4">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{post.title}</h3>
                <div className="flex items-center space-x-3 space-x-reverse mt-1">
                  <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">غوره مطلب</span>
                  <div className="flex items-center text-[10px] text-zinc-400 font-medium">
                    <Calendar size={10} className="ml-1" />
                    {new Date(post.timestamp).toLocaleDateString('fa-AF')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => setPostToDelete(post.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {topPosts.length === 0 && (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800">
              <Sparkles size={32} className="mx-auto text-zinc-300 mb-2" />
              <p className="text-zinc-400 text-xs font-medium">تر اوسه کوم غوره مطلب نشته</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!postToDelete}
        title="له غوره لیست څخه حذف"
        message="ایا غواړئ دا مطلب له غوره لیست څخه حذف کړئ؟"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
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

export default AdminTopPosts;
